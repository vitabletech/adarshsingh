"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createPhotoModel } from "../lib/create-photo-model";
import "./model-viewer.css";

type ViewName = "front" | "side" | "back";

export default function ModelViewer({ modelUrl }: { modelUrl?: string }) {
  const canvasHost = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const guideRef = useRef<THREE.Group | null>(null);
  const targetRotation = useRef(0);
  const drag = useRef<{ x: number; rotation: number } | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [view, setView] = useState<ViewName>("front");
  const [showGuides, setShowGuides] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [scanLoaded, setScanLoaded] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);

  useEffect(() => {
    const host = canvasHost.current;
    if (!host) return;

    let disposed = false;
    let frame = 0;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#20211f");
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
    camera.position.set(0, 1.18, 5.25);
    camera.lookAt(0, 1.05, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.className = "model-canvas";
    renderer.domElement.setAttribute("aria-label", "Interactive photo-informed three-dimensional model. Drag to rotate.");
    renderer.domElement.tabIndex = 0;
    renderer.domElement.style.touchAction = "none";
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xdad8c9, 0x373831, 2.0));
    const key = new THREE.DirectionalLight(0xffead1, 3.2);
    key.position.set(-3, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd1d69c, 1.1);
    fill.position.set(3, 2, -3);
    scene.add(fill);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x20211f, roughness: 1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.07;
    floor.receiveShadow = true;
    scene.add(floor);

    const photoModel = createPhotoModel(scene);
    modelRef.current = photoModel.group;
    guideRef.current = photoModel.guides;

    if (modelUrl) {
      import("three/addons/loaders/GLTFLoader.js").then(({ GLTFLoader }) => {
        new GLTFLoader().load(modelUrl, (gltf) => {
          if (disposed) return;
          const scan = gltf.scene;
          const bounds = new THREE.Box3().setFromObject(scan);
          const size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          const scale = 2.08 / Math.max(size.y, 0.001);
          scan.scale.setScalar(scale);
          scan.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
          photoModel.photoModel.visible = false;
          photoModel.group.add(scan);
          setScanLoaded(true);
        }, undefined, () => {
          if (!disposed) setScanFailed(true);
        });
      }).catch(() => setScanFailed(true));
    }

    const resize = () => {
      if (!host) return;
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      if (modelRef.current) {
        modelRef.current.rotation.y += (targetRotation.current - modelRef.current.rotation.y) * 0.16;
      }
      renderer.render(scene, camera);
    };
    animate();

    const canvas = renderer.domElement;
    const onPointerDown = (event: PointerEvent) => {
      drag.current = { x: event.clientX, rotation: modelRef.current?.rotation.y ?? 0 };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current) return;
      targetRotation.current = drag.current.rotation + (event.clientX - drag.current.x) * 0.009;
      if (modelRef.current) modelRef.current.rotation.y = targetRotation.current;
    };
    const onPointerUp = () => { drag.current = null; };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") targetRotation.current -= Math.PI / 12;
      if (event.key === "ArrowRight") targetRotation.current += Math.PI / 12;
      if (event.key === "+" || event.key === "=") camera.position.z = Math.max(3.4, camera.position.z - 0.3);
      if (event.key === "-") camera.position.z = Math.min(7, camera.position.z + 0.3);
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("keydown", onKeyDown);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("keydown", onKeyDown);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      cameraRef.current = null;
      modelRef.current = null;
      guideRef.current = null;
    };
  }, [modelUrl]);

  useEffect(() => {
    if (guideRef.current) guideRef.current.visible = showGuides;
  }, [showGuides]);

  useEffect(() => {
    if (!stageRef.current) return;
    const sync = () => setFullScreen(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  function setViewAngle(name: ViewName) {
    const rotation = name === "front" ? 0 : name === "side" ? Math.PI / 2 : Math.PI;
    targetRotation.current = rotation;
    setView(name);
  }

  function zoom(amount: number) {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = THREE.MathUtils.clamp(cameraRef.current.position.z + amount, 3.4, 7);
  }

  async function toggleFullScreen() {
    if (!stageRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await stageRef.current.requestFullscreen();
  }

  return (
    <section className="model-section" aria-labelledby="model-viewer-title">
      <div className="model-section-inner">
        <div className="model-section-heading">
          <div><p className="model-eyebrow">The fitting room / 03</p><h2 id="model-viewer-title">See it from<br /><em>every side.</em></h2></div>
          <p>A photo-informed 3D interpretation of the black shirt look. Drag to turn, zoom in for detail, or jump to a view.</p>
        </div>
        <div className="model-stage" ref={stageRef}>
          <div className="model-stage-top"><span><i /> {scanLoaded ? "Model scan" : "Photo-informed 3D model"}</span><span>DRAG TO ROTATE</span></div>
          <div className="model-canvas-host" ref={canvasHost} />
          <div className="model-stage-bottom">
            <div className="model-view-buttons" role="group" aria-label="Choose model view">
              {(["front", "side", "back"] as ViewName[]).map((name) => <button key={name} className={view === name ? "model-view-button selected" : "model-view-button"} aria-pressed={view === name} onClick={() => setViewAngle(name)}>{name}</button>)}
            </div>
            <div className="model-tools">
              <button className="model-tool" aria-label="Zoom out" onClick={() => zoom(0.45)}>−</button>
              <button className="model-tool" aria-label="Zoom in" onClick={() => zoom(-0.45)}>+</button>
              <button className="model-tool fullscreen-tool" aria-label={fullScreen ? "Exit full screen" : "View full screen"} onClick={toggleFullScreen}>{fullScreen ? "↙" : "⛶"}</button>
            </div>
          </div>
          <button className={showGuides ? "guide-toggle is-on" : "guide-toggle"} aria-pressed={showGuides} onClick={() => setShowGuides((value) => !value)}><span className="guide-checkbox">{showGuides ? "✓" : ""}</span> Measurement guides</button>
          {showGuides && <div className="guide-key" aria-live="polite"><span>Chest</span><span>Waist</span><span>Hips</span><span>Height</span></div>}
        </div>
        <div className="model-disclaimer"><span>{scanFailed ? "Custom scan unavailable · showing photo-informed model" : "Photo-informed 3D illustration · back and cropped details approximated"}</span><span>Guides show placement only, not measured values</span></div>
      </div>
    </section>
  );
}
