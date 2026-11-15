import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { createPhotoModel } from "../app/lib/create-photo-model";

class NodeFileReader {
  result: ArrayBuffer | null = null;
  onloadend: (() => void) | null = null;

  readAsArrayBuffer(blob: Blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
}

Object.defineProperty(globalThis, "FileReader", { value: NodeFileReader, configurable: true });

const scene = new THREE.Scene();
const { photoModel } = createPhotoModel(scene);
photoModel.name = "Adarsh Singh Kushwah — photo-informed 3D illustration";

const output = resolve("public/models/adarsh-photo-avatar.glb");
await mkdir(dirname(output), { recursive: true });
const exporter = new GLTFExporter();
const result = await exporter.parseAsync(photoModel, { binary: true, onlyVisible: true });
if (!(result instanceof ArrayBuffer)) throw new Error("GLB export did not return binary data");
await writeFile(output, Buffer.from(result));
console.log(`Wrote ${output} (${(result.byteLength / 1024 / 1024).toFixed(2)} MB)`);
