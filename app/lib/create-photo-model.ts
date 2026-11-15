import * as THREE from "three";

const skin = new THREE.MeshStandardMaterial({ color: 0xb88968, roughness: 0.87, metalness: 0 });
const skinLight = new THREE.MeshStandardMaterial({ color: 0xc99b77, roughness: 0.84, metalness: 0 });
const shirt = new THREE.MeshStandardMaterial({ color: 0x101c2a, roughness: 0.9, metalness: 0 });
const shirtDetail = new THREE.MeshStandardMaterial({ color: 0x26364a, roughness: 0.92, metalness: 0 });
const trouser = new THREE.MeshStandardMaterial({ color: 0xd7cfb6, roughness: 0.96, metalness: 0 });
const trouserShadow = new THREE.MeshStandardMaterial({ color: 0xc6bda5, roughness: 0.96, metalness: 0 });
const hair = new THREE.MeshStandardMaterial({ color: 0x111319, roughness: 0.76, metalness: 0 });
const facialHair = new THREE.MeshStandardMaterial({ color: 0x30251f, roughness: 0.92, metalness: 0 });
const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xeee5d7, roughness: 0.78, metalness: 0 });
const eyeDark = new THREE.MeshStandardMaterial({ color: 0x211c1a, roughness: 0.7, metalness: 0 });
const silver = new THREE.MeshStandardMaterial({ color: 0xc5c7c5, roughness: 0.35, metalness: 0.72 });
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x74736d, roughness: 0.7, metalness: 0.24 });

function addEllipsoid(parent: THREE.Group, material: THREE.Material, position: [number, number, number], size: [number, number, number]) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 22), material);
  mesh.position.set(...position);
  mesh.scale.set(...size);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addLimb(parent: THREE.Group, from: THREE.Vector3, to: THREE.Vector3, radiusTop: number, radiusBottom: number, material = skin) {
  const direction = new THREE.Vector3().subVectors(to, from);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, direction.length(), 20, 1), material);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createPhotoModel(scene: THREE.Scene) {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);
  scene.add(group);

  const joint = (x: number, y: number, z: number, radius: number) => addEllipsoid(body, skin, [x, y, z], [radius, radius, radius]);

  // Photo-informed clothing, hair and facial hair; unseen angles remain approximations.
  addEllipsoid(body, shirt, [0, 1.43, 0], [0.365, 0.43, 0.185]); // button-front shirt
  addEllipsoid(body, shirt, [0, 1.68, 0], [0.4, 0.145, 0.165]); // shoulder line
  addEllipsoid(body, trouser, [0, 1.04, 0], [0.255, 0.2, 0.17]); // trouser waist
  addEllipsoid(body, skin, [0, 1.82, 0], [0.07, 0.13, 0.07]); // neck
  addEllipsoid(body, skinLight, [0, 2.025, 0], [0.146, 0.202, 0.132]); // face

  // Swept dark hair, a neat moustache, brows and simple facial features echo the reference portrait.
  addEllipsoid(body, hair, [-0.005, 2.19, -0.012], [0.153, 0.105, 0.139]);
  addEllipsoid(body, hair, [0.035, 2.215, 0.065], [0.122, 0.062, 0.09]);
  addEllipsoid(body, hair, [-0.083, 2.175, 0.043], [0.064, 0.065, 0.083]);
  addEllipsoid(body, skin, [-0.146, 2.025, 0], [0.032, 0.064, 0.033]);
  addEllipsoid(body, skin, [0.146, 2.025, 0], [0.032, 0.064, 0.033]);
  for (const side of [-1, 1]) {
    addEllipsoid(body, eyeWhite, [side * 0.052, 2.057, 0.119], [0.027, 0.014, 0.009]);
    addEllipsoid(body, eyeDark, [side * 0.052, 2.057, 0.128], [0.009, 0.011, 0.006]);
    const brow = addEllipsoid(body, facialHair, [side * 0.052, 2.082, 0.119], [0.035, 0.008, 0.008]);
    brow.rotation.z = side * -0.08;
    const moustache = addEllipsoid(body, facialHair, [side * 0.025, 1.982, 0.13], [0.033, 0.012, 0.014]);
    moustache.rotation.z = side * 0.12;
  }
  addEllipsoid(body, skin, [0, 2.025, 0.133], [0.018, 0.045, 0.025]); // nose bridge
  addEllipsoid(body, facialHair, [0, 1.948, 0.122], [0.036, 0.018, 0.018]); // chin shadow
  const earring = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.004, 8, 20), new THREE.MeshStandardMaterial({ color: 0xc49a50, roughness: 0.35, metalness: 0.75 }));
  earring.position.set(0.153, 1.994, 0.022);
  earring.rotation.y = Math.PI / 2;
  body.add(earring);

  // Open collar, central placket, silver buttons and two chest pockets.
  const placket = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.6, 0.016), shirtDetail);
  placket.position.set(0, 1.43, 0.177);
  body.add(placket);
  const leftCollar = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.17, 0.028), shirtDetail);
  leftCollar.position.set(-0.07, 1.735, 0.145);
  leftCollar.rotation.z = -0.36;
  body.add(leftCollar);
  const rightCollar = leftCollar.clone();
  rightCollar.position.x = 0.07;
  rightCollar.rotation.z = 0.36;
  body.add(rightCollar);
  for (const y of [1.64, 1.51, 1.38, 1.25, 1.12]) {
    const button = new THREE.Mesh(new THREE.SphereGeometry(0.015, 14, 10), silver);
    button.position.set(0, y, 0.193);
    body.add(button);
  }
  for (const side of [-1, 1]) {
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.13, 0.025), shirtDetail);
    pocket.position.set(side * 0.205, 1.49, 0.165);
    body.add(pocket);
    const flap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.045, 0.032), shirt);
    flap.position.set(side * 0.205, 1.56, 0.178);
    body.add(flap);
    const pocketButton = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), silver);
    pocketButton.position.set(side * 0.205, 1.56, 0.2);
    body.add(pocketButton);
    const stitch = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.095, 0.004), shirtDetail);
    stitch.position.set(side * 0.205, 1.49, 0.181);
    body.add(stitch);
  }

  for (const side of [-1, 1]) {
    const hip = new THREE.Vector3(side * 0.135, 0.97, 0);
    const knee = new THREE.Vector3(side * 0.145, 0.55, 0.008);
    const ankle = new THREE.Vector3(side * 0.15, 0.15, 0.01);
    addLimb(body, hip, knee, 0.13, 0.09, trouser);
    addLimb(body, knee, ankle, 0.091, 0.064, trouserShadow);
    addEllipsoid(body, trouser, [knee.x, knee.y, knee.z], [0.083, 0.083, 0.083]);
    addEllipsoid(body, trouser, [side * 0.15, 0.125, 0.075], [0.08, 0.055, 0.15]);
    const shoulder = new THREE.Vector3(side * 0.34, 1.67, 0);
    const elbow = new THREE.Vector3(side * 0.39, 1.37, 0.015);
    const wrist = new THREE.Vector3(side * 0.42, 1.09, 0.045);
    addLimb(body, shoulder, elbow, 0.092, 0.068, shirt);
    addLimb(body, elbow, wrist, 0.057, 0.037, skinLight);
    joint(elbow.x, elbow.y, elbow.z, 0.06);
    joint(wrist.x, wrist.y, wrist.z, 0.04);
    addEllipsoid(body, skin, [side * 0.425, 1.0, 0.055], [0.045, 0.085, 0.035]);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.009, 8, 24), shirtDetail);
    cuff.position.set(elbow.x, elbow.y, elbow.z);
    cuff.rotation.x = Math.PI / 2;
    body.add(cuff);
  }

  const platform = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.075, 64), baseMaterial);
  platform.position.y = -0.025;
  platform.receiveShadow = true;
  group.add(platform);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.705, 0.012, 8, 64), new THREE.MeshStandardMaterial({ color: 0xaaa79e, metalness: 0.46, roughness: 0.48 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.015;
  group.add(rim);

  const guides = new THREE.Group();
  const guideMaterial = new THREE.MeshBasicMaterial({ color: 0xc8d64b, transparent: true, opacity: 0.84 });
  for (const [radius, y] of [[0.315, 1.56], [0.205, 1.31], [0.255, 1.08]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 8, 64), guideMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    guides.add(ring);
  }
  const heightLine = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 2.03, 8), guideMaterial);
  heightLine.position.set(0.58, 1.04, 0);
  guides.add(heightLine);
  const capMaterial = guideMaterial.clone();
  for (const y of [0.025, 2.055]) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 10), capMaterial);
    cap.position.set(0.58, y, 0);
    guides.add(cap);
  }
  group.add(guides);
  guides.visible = false;

  return { group, guides, photoModel: body };
}

