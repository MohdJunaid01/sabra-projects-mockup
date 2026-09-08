import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';
import {
  TIMBER_MATERIALS,
  CABINET_STYLES,
  CABINET_LAYOUTS,
  HARDWARE_OPTIONS,
  COUNTERTOP_OPTIONS,
  getMaterialById
} from '../data/materials';

// Procedural Canvas Texture Generator for realistic timber PBR materials
function createTimberCanvasTexture(timber) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Fill base wood color
  ctx.fillStyle = timber.baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Micro fine wood grain lines
  ctx.strokeStyle = timber.grainColor;
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 3 + Math.random() * 3) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    let curX = i;
    for (let y = 0; y < 512; y += 16) {
      curX += (Math.random() - 0.5) * 1.5;
      ctx.lineTo(curX, y);
    }
    ctx.stroke();
  }

  // Characteristic grain features based on wood cut
  if (timber.grainType === 'wide-wave' || timber.grainType === 'flowing-crown') {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = timber.grainColor;
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.bezierCurveTo(220, 160, 140, 340, 260, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(340, 0);
    ctx.bezierCurveTo(420, 200, 300, 360, 440, 512);
    ctx.stroke();
  } else if (timber.grainType === 'charred-alligator') {
    ctx.strokeStyle = timber.highlightColor;
    ctx.lineWidth = 1.2;
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Procedural Canvas Texture Generator for benchtop stone materials
function createStoneCanvasTexture(benchtopId) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const benchtop = COUNTERTOP_OPTIONS.find(b => b.id === benchtopId) || COUNTERTOP_OPTIONS[0];

  ctx.fillStyle = benchtop.baseColor;
  ctx.fillRect(0, 0, 512, 512);

  if (benchtopId === 'calacatta') {
    // Marble veining
    ctx.strokeStyle = benchtop.veinColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.bezierCurveTo(180, 160, 120, 320, 420, 512);
    ctx.stroke();

    ctx.strokeStyle = benchtop.goldVein;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 240);
    ctx.bezierCurveTo(160, 200, 320, 380, 512, 410);
    ctx.stroke();
  } else if (benchtopId === 'travertine') {
    // Linear horizontal sedimentary bedding bands
    ctx.strokeStyle = benchtop.veinColor;
    for (let y = 0; y < 512; y += 12 + Math.random() * 8) {
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y + (Math.random() - 0.5) * 3);
      ctx.stroke();
    }
  } else if (benchtopId === 'charcoal') {
    // Dark slate fine mineral flecks
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.12)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  } else if (benchtopId === 'concrete') {
    // Micro-cement trowel texture
    for (let k = 0; k < 600; k++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Procedural soft studio contact shadow ground texture
function createStudioShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(256, 256, 40, 256, 256, 240);
  gradient.addColorStop(0, 'rgba(15, 15, 15, 0.28)');
  gradient.addColorStop(0.5, 'rgba(30, 30, 30, 0.12)');
  gradient.addColorStop(0.8, 'rgba(50, 50, 50, 0.03)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  return new THREE.CanvasTexture(canvas);
}

export default function Interactive3DCabinet({
  timberId = 'smoked-oak',
  styleId = 'slatted',
  layoutId = '3-door',
  hardwareId = 'brushed-brass',
  benchtopId = 'calacatta',
  height = '520px',
  isHeroView = false
}) {
  const mountRef = useRef(null);
  const resetCameraRef = useRef(null);
  const stateRef = useRef({ timberId, styleId, layoutId, hardwareId, benchtopId });

  // Update ref whenever props change
  useEffect(() => {
    stateRef.current = { timberId, styleId, layoutId, hardwareId, benchtopId };
  }, [timberId, styleId, layoutId, hardwareId, benchtopId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE & PURE WHITE STUDIO BACKGROUND (#FFFFFF)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    // 2. CAMERA - 3/4 Architectural Perspective
    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 520;
    const camera = new THREE.PerspectiveCamera(34, width / heightPx, 0.1, 100);

    // Spherical Coordinates for Custom Orbit (No OrbitControls import)
    let radius = 5.1;
    let targetRadius = 5.1;
    let theta = 0.65; // ~37 deg horizontal yaw for ideal 3/4 perspective
    let targetTheta = 0.65;
    let phi = 1.25;   // ~71 deg vertical pitch
    let targetPhi = 1.25;

    const lookTarget = new THREE.Vector3(0, 0.55, 0);

    function updateCameraPosition() {
      camera.position.x = lookTarget.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = lookTarget.y + radius * Math.cos(phi);
      camera.position.z = lookTarget.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(lookTarget);
    }
    updateCameraPosition();

    resetCameraRef.current = () => {
      targetTheta = 0.65;
      targetPhi = 1.25;
      targetRadius = 5.1;
    };

    // 3. RENDERER with soft shadows on pure white
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.outline = 'none';
    container.appendChild(renderer.domElement);

    // 4. STUDIO LIGHTING
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
    scene.add(ambientLight);

    // Key Light from front-top-right
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light from front-left
    const fillLight = new THREE.DirectionalLight(0xF5F3EF, 0.6);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    // Rim Light from back-top
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 0.4);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Pure White Studio Floor with soft radial contact shadow
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.005;
    scene.add(floor);

    // Contact shadow plane directly beneath cabinet
    const shadowTexture = createStudioShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(3.6, 1.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, 0.001, 0.05);
    scene.add(shadowPlane);

    // 5. CABINET 3D HIERARCHY
    const cabinetRoot = new THREE.Group();
    scene.add(cabinetRoot);

    // Carcass & Plinth Geometry definitions
    const carcassWidth = 2.4;
    const carcassHeight = 0.92;
    const carcassDepth = 0.62;
    const plinthHeight = 0.12;

    // Recessed Plinth (Toe-kick)
    const plinthGeo = new THREE.BoxGeometry(2.28, plinthHeight, 0.54);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x181716,
      roughness: 0.8,
      metalness: 0.1
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.set(0, plinthHeight / 2, 0.01);
    plinthMesh.receiveShadow = true;
    cabinetRoot.add(plinthMesh);

    // Carcass Box (Internal & Sides)
    let timberTexture = null;
    let stoneTexture = null;

    let timberMaterial = null;
    let benchtopMaterial = null;
    let hardwareMaterial = null;

    // Sub-groups for dynamic parts that rebuild on style/layout/hardware changes
    const carcassGroup = new THREE.Group();
    const benchtopGroup = new THREE.Group();
    const doorsGroup = new THREE.Group();
    const hardwareGroup = new THREE.Group();

    cabinetRoot.add(carcassGroup);
    cabinetRoot.add(benchtopGroup);
    cabinetRoot.add(doorsGroup);
    cabinetRoot.add(hardwareGroup);

    // Function to build / rebuild cabinet components
    function rebuildCabinet() {
      const current = stateRef.current;
      const timber = getMaterialById(current.timberId);
      const benchtop = COUNTERTOP_OPTIONS.find(b => b.id === current.benchtopId) || COUNTERTOP_OPTIONS[0];
      const hardware = HARDWARE_OPTIONS.find(h => h.id === current.hardwareId) || HARDWARE_OPTIONS[0];
      const layout = CABINET_LAYOUTS.find(l => l.id === current.layoutId) || CABINET_LAYOUTS[1];
      const style = CABINET_STYLES.find(s => s.id === current.styleId) || CABINET_STYLES[0];

      // Dispose previous textures
      if (timberTexture) timberTexture.dispose();
      if (stoneTexture) stoneTexture.dispose();

      timberTexture = createTimberCanvasTexture(timber);
      stoneTexture = createStoneCanvasTexture(benchtop.id);

      // Materials
      timberMaterial = new THREE.MeshStandardMaterial({
        map: timberTexture,
        roughness: 0.65,
        metalness: 0.04
      });

      benchtopMaterial = new THREE.MeshStandardMaterial({
        map: stoneTexture,
        roughness: benchtop.id === 'calacatta' ? 0.25 : (benchtop.id === 'travertine' ? 0.45 : 0.6),
        metalness: 0.08
      });

      hardwareMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hardware.color),
        roughness: hardware.id === 'steel' ? 0.22 : (hardware.id === 'black' ? 0.45 : 0.28),
        metalness: hardware.id === 'steel' ? 0.92 : (hardware.id === 'black' ? 0.5 : 0.88)
      });

      // 1. CARCASS REBUILD
      while (carcassGroup.children.length > 0) {
        const obj = carcassGroup.children[0];
        carcassGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      }

      // Left Gable
      const gableGeo = new THREE.BoxGeometry(0.024, carcassHeight, carcassDepth);
      const leftGable = new THREE.Mesh(gableGeo, timberMaterial);
      leftGable.position.set(-carcassWidth / 2 + 0.012, plinthHeight + carcassHeight / 2, 0);
      leftGable.castShadow = true;
      leftGable.receiveShadow = true;
      carcassGroup.add(leftGable);

      // Right Gable
      const rightGable = new THREE.Mesh(gableGeo, timberMaterial);
      rightGable.position.set(carcassWidth / 2 - 0.012, plinthHeight + carcassHeight / 2, 0);
      rightGable.castShadow = true;
      rightGable.receiveShadow = true;
      carcassGroup.add(rightGable);

      // Bottom Base Shelf
      const baseGeo = new THREE.BoxGeometry(carcassWidth - 0.048, 0.024, carcassDepth);
      const baseShelf = new THREE.Mesh(baseGeo, timberMaterial);
      baseShelf.position.set(0, plinthHeight + 0.012, 0);
      baseShelf.receiveShadow = true;
      carcassGroup.add(baseShelf);

      // Back Panel
      const backGeo = new THREE.BoxGeometry(carcassWidth - 0.048, carcassHeight - 0.024, 0.018);
      const backPanel = new THREE.Mesh(backGeo, timberMaterial);
      backPanel.position.set(0, plinthHeight + carcassHeight / 2, -carcassDepth / 2 + 0.009);
      backPanel.receiveShadow = true;
      carcassGroup.add(backPanel);

      // 2. BENCHTOP SLAB REBUILD (80mm architectural mitred stone slab)
      while (benchtopGroup.children.length > 0) {
        const obj = benchtopGroup.children[0];
        benchtopGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      }

      const slabWidth = carcassWidth + 0.06;
      const slabDepth = carcassDepth + 0.05;
      const slabHeight = 0.06; // 60mm architectural slab
      const benchtopGeo = new THREE.BoxGeometry(slabWidth, slabHeight, slabDepth);
      const benchtopMesh = new THREE.Mesh(benchtopGeo, benchtopMaterial);
      benchtopMesh.position.set(0, plinthHeight + carcassHeight + slabHeight / 2, 0.015);
      benchtopMesh.castShadow = true;
      benchtopMesh.receiveShadow = true;
      benchtopGroup.add(benchtopMesh);

      // 3. DOORS & DRAWERS REBUILD
      while (doorsGroup.children.length > 0) {
        const obj = doorsGroup.children[0];
        doorsGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      }

      // 4. HARDWARE REBUILD
      while (hardwareGroup.children.length > 0) {
        const obj = hardwareGroup.children[0];
        hardwareGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      }

      const doorCount = layout.doorCount || 3;
      const hasDrawers = layout.hasDrawers;
      const doorZ = carcassDepth / 2 + 0.012;
      const doorMargin = 0.03;
      const availableWidth = carcassWidth - (doorMargin * 2);
      const doorGap = 0.006;
      const singleDoorWidth = (availableWidth - (doorCount - 1) * doorGap) / doorCount;

      const fullDoorHeight = carcassHeight - 0.024;
      const drawerHeight = 0.22;
      const lowerDoorHeight = fullDoorHeight - drawerHeight - doorGap;

      // Handle parameters
      const handleRadius = 0.007;
      const handleLength = 0.16;
      const handleDepth = 0.028;

      for (let i = 0; i < doorCount; i++) {
        const doorX = -availableWidth / 2 + singleDoorWidth / 2 + i * (singleDoorWidth + doorGap);

        if (hasDrawers) {
          // A) UPPER DRAWER
          const drawerY = plinthHeight + fullDoorHeight - drawerHeight / 2;
          buildDoorPanel(doorsGroup, style.id, singleDoorWidth, drawerHeight, doorX, drawerY, doorZ, timberMaterial);

          // Horizontal handle on drawer
          if (hardware.id !== 'handleless') {
            const handleBarGeo = new THREE.CylinderGeometry(handleRadius, handleRadius, handleLength, 16);
            const handleBar = new THREE.Mesh(handleBarGeo, hardwareMaterial);
            handleBar.rotation.z = Math.PI / 2;
            handleBar.position.set(doorX, drawerY, doorZ + handleDepth);
            handleBar.castShadow = true;
            hardwareGroup.add(handleBar);

            // Stanchion posts
            const postGeo = new THREE.CylinderGeometry(handleRadius * 0.8, handleRadius * 0.8, handleDepth, 12);
            [-handleLength / 2.5, handleLength / 2.5].forEach(postX => {
              const post = new THREE.Mesh(postGeo, hardwareMaterial);
              post.rotation.x = Math.PI / 2;
              post.position.set(doorX + postX, drawerY, doorZ + handleDepth / 2);
              hardwareGroup.add(post);
            });
          }

          // B) LOWER DOOR
          const lowerY = plinthHeight + lowerDoorHeight / 2;
          buildDoorPanel(doorsGroup, style.id, singleDoorWidth, lowerDoorHeight, doorX, lowerY, doorZ, timberMaterial);

          // Vertical handle on lower door
          if (hardware.id !== 'handleless') {
            const handleBarGeo = new THREE.CylinderGeometry(handleRadius, handleRadius, handleLength, 16);
            const handleBar = new THREE.Mesh(handleBarGeo, hardwareMaterial);
            const handleOffset = i % 2 === 0 ? (singleDoorWidth / 2 - 0.04) : (-singleDoorWidth / 2 + 0.04);
            handleBar.position.set(doorX + handleOffset, lowerY + lowerDoorHeight / 4, doorZ + handleDepth);
            handleBar.castShadow = true;
            hardwareGroup.add(handleBar);

            const postGeo = new THREE.CylinderGeometry(handleRadius * 0.8, handleRadius * 0.8, handleDepth, 12);
            [-handleLength / 2.5, handleLength / 2.5].forEach(postY => {
              const post = new THREE.Mesh(postGeo, hardwareMaterial);
              post.rotation.x = Math.PI / 2;
              post.position.set(doorX + handleOffset, lowerY + lowerDoorHeight / 4 + postY, doorZ + handleDepth / 2);
              hardwareGroup.add(post);
            });
          }
        } else {
          // FULL HEIGHT DOORS (2, 3, or 4 Door layouts)
          const doorY = plinthHeight + fullDoorHeight / 2;
          buildDoorPanel(doorsGroup, style.id, singleDoorWidth, fullDoorHeight, doorX, doorY, doorZ, timberMaterial);

          // Handles for full doors
          if (hardware.id !== 'handleless') {
            const handleBarGeo = new THREE.CylinderGeometry(handleRadius, handleRadius, handleLength, 16);
            const handleBar = new THREE.Mesh(handleBarGeo, hardwareMaterial);
            const handleOffset = i % 2 === 0 ? (singleDoorWidth / 2 - 0.04) : (-singleDoorWidth / 2 + 0.04);
            handleBar.position.set(doorX + handleOffset, doorY, doorZ + handleDepth);
            handleBar.castShadow = true;
            hardwareGroup.add(handleBar);

            const postGeo = new THREE.CylinderGeometry(handleRadius * 0.8, handleRadius * 0.8, handleDepth, 12);
            [-handleLength / 2.5, handleLength / 2.5].forEach(postY => {
              const post = new THREE.Mesh(postGeo, hardwareMaterial);
              post.rotation.x = Math.PI / 2;
              post.position.set(doorX + handleOffset, doorY + postY, doorZ + handleDepth / 2);
              hardwareGroup.add(post);
            });
          }
        }
      }

      // Handleless J-Groove Shadowline Channel
      if (hardware.id === 'handleless') {
        const grooveGeo = new THREE.BoxGeometry(carcassWidth - 0.04, 0.016, 0.024);
        const grooveMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const grooveMesh = new THREE.Mesh(grooveGeo, grooveMat);
        grooveMesh.position.set(0, plinthHeight + carcassHeight - 0.01, doorZ);
        hardwareGroup.add(grooveMesh);
      }
    }

    // Helper to build 3D Door Panels with real architectural profile geometry
    function buildDoorPanel(parentGroup, styleId, dWidth, dHeight, dX, dY, dZ, mat) {
      const panelThickness = 0.022;

      if (styleId === 'flat-panel') {
        // Clean Minimal Slab Door
        const flatGeo = new THREE.BoxGeometry(dWidth, dHeight, panelThickness);
        const flatMesh = new THREE.Mesh(flatGeo, mat);
        flatMesh.position.set(dX, dY, dZ);
        flatMesh.castShadow = true;
        flatMesh.receiveShadow = true;
        parentGroup.add(flatMesh);
      } else if (styleId === 'shaker') {
        // Shaker recessed framed door: outer stiles & rails with recessed inner panel
        const frameWidth = 0.06;
        const recessedDepth = 0.012;

        // Recessed Center Panel
        const innerGeo = new THREE.BoxGeometry(dWidth - frameWidth * 2, dHeight - frameWidth * 2, panelThickness - recessedDepth);
        const innerMesh = new THREE.Mesh(innerGeo, mat);
        innerMesh.position.set(dX, dY, dZ - recessedDepth / 2);
        innerMesh.castShadow = true;
        innerMesh.receiveShadow = true;
        parentGroup.add(innerMesh);

        // Left stile
        const leftStileGeo = new THREE.BoxGeometry(frameWidth, dHeight, panelThickness);
        const leftStile = new THREE.Mesh(leftStileGeo, mat);
        leftStile.position.set(dX - dWidth / 2 + frameWidth / 2, dY, dZ);
        leftStile.castShadow = true;
        parentGroup.add(leftStile);

        // Right stile
        const rightStileGeo = new THREE.BoxGeometry(frameWidth, dHeight, panelThickness);
        const rightStile = new THREE.Mesh(rightStileGeo, mat);
        rightStile.position.set(dX + dWidth / 2 - frameWidth / 2, dY, dZ);
        rightStile.castShadow = true;
        parentGroup.add(rightStile);

        // Top rail
        const railGeo = new THREE.BoxGeometry(dWidth - frameWidth * 2, frameWidth, panelThickness);
        const topRail = new THREE.Mesh(railGeo, mat);
        topRail.position.set(dX, dY + dHeight / 2 - frameWidth / 2, dZ);
        topRail.castShadow = true;
        parentGroup.add(topRail);

        // Bottom rail
        const bottomRail = new THREE.Mesh(railGeo, mat);
        bottomRail.position.set(dX, dY - dHeight / 2 + frameWidth / 2, dZ);
        bottomRail.castShadow = true;
        parentGroup.add(bottomRail);
      } else if (styleId === 'slatted') {
        // Slatted: Backing board with rhythmic 3D vertical timber slats
        const backGeo = new THREE.BoxGeometry(dWidth, dHeight, panelThickness * 0.5);
        const backMesh = new THREE.Mesh(backGeo, mat);
        backMesh.position.set(dX, dY, dZ - panelThickness * 0.25);
        backMesh.castShadow = true;
        parentGroup.add(backMesh);

        const slatWidth = 0.016;
        const slatGap = 0.008;
        const slatCount = Math.floor(dWidth / (slatWidth + slatGap));
        const slatActualGap = (dWidth - (slatCount * slatWidth)) / (slatCount - 1);
        const slatGeo = new THREE.BoxGeometry(slatWidth, dHeight - 0.004, panelThickness * 0.5);

        for (let s = 0; s < slatCount; s++) {
          const slatX = dX - dWidth / 2 + slatWidth / 2 + s * (slatWidth + slatActualGap);
          const slatMesh = new THREE.Mesh(slatGeo, mat);
          slatMesh.position.set(slatX, dY, dZ + panelThickness * 0.25);
          slatMesh.castShadow = true;
          parentGroup.add(slatMesh);
        }
      } else if (styleId === 'framed') {
        // Framed: Main flush panel with delicate perimeter moulding border
        const mainGeo = new THREE.BoxGeometry(dWidth, dHeight, panelThickness);
        const mainMesh = new THREE.Mesh(mainGeo, mat);
        mainMesh.position.set(dX, dY, dZ);
        mainMesh.castShadow = true;
        parentGroup.add(mainMesh);

        const borderThickness = 0.012;
        const borderHeight = 0.008;
        const borderGeoH = new THREE.BoxGeometry(dWidth - 0.02, borderThickness, borderHeight);
        const borderGeoV = new THREE.BoxGeometry(borderThickness, dHeight - 0.02, borderHeight);

        const borderMat = mat;
        // Top border
        const topB = new THREE.Mesh(borderGeoH, borderMat);
        topB.position.set(dX, dY + dHeight / 2 - 0.018, dZ + panelThickness / 2 + borderHeight / 2);
        parentGroup.add(topB);

        // Bottom border
        const bottomB = new THREE.Mesh(borderGeoH, borderMat);
        bottomB.position.set(dX, dY - dHeight / 2 + 0.018, dZ + panelThickness / 2 + borderHeight / 2);
        parentGroup.add(bottomB);

        // Left border
        const leftB = new THREE.Mesh(borderGeoV, borderMat);
        leftB.position.set(dX - dWidth / 2 + 0.018, dY, dZ + panelThickness / 2 + borderHeight / 2);
        parentGroup.add(leftB);

        // Right border
        const rightB = new THREE.Mesh(borderGeoV, borderMat);
        rightB.position.set(dX + dWidth / 2 - 0.018, dY, dZ + panelThickness / 2 + borderHeight / 2);
        parentGroup.add(rightB);
      }
    }

    // Initial build
    rebuildCabinet();

    // 6. CUSTOM POINTER & TOUCH CONTROLS (Smooth 3D orbit without OrbitControls)
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let initialTouchDist = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      targetTheta -= deltaX * 0.007;
      targetPhi -= deltaY * 0.005;

      // Clamp vertical pitch so camera never flips or goes underground
      targetPhi = Math.max(0.45, Math.min(Math.PI / 2 - 0.08, targetPhi));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      targetRadius += e.deltaY * 0.003;
      // Clamp zoom distance so user never loses the cabinet
      targetRadius = Math.max(3.0, Math.min(6.5, targetRadius));
    };

    // Touch controls for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        initialTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - prevX;
        const deltaY = e.touches[0].clientY - prevY;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;

        targetTheta -= deltaX * 0.007;
        targetPhi -= deltaY * 0.005;
        targetPhi = Math.max(0.45, Math.min(Math.PI / 2 - 0.08, targetPhi));
      } else if (e.touches.length === 2 && initialTouchDist > 0) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = (initialTouchDist - dist) * 0.005;
        targetRadius += factor;
        targetRadius = Math.max(3.0, Math.min(6.5, targetRadius));
        initialTouchDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      initialTouchDist = 0;
    };

    const domElement = renderer.domElement;
    domElement.style.touchAction = 'none';
    domElement.style.cursor = 'grab';

    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // 7. ANIMATION LOOP & RESIZE HANDLING
    let animationFrameId;
    let lastRenderState = { ...stateRef.current };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Check if external state changed (e.g. user clicked a component button)
      const current = stateRef.current;
      if (
        current.timberId !== lastRenderState.timberId ||
        current.styleId !== lastRenderState.styleId ||
        current.layoutId !== lastRenderState.layoutId ||
        current.hardwareId !== lastRenderState.hardwareId ||
        current.benchtopId !== lastRenderState.benchtopId
      ) {
        lastRenderState = { ...current };
        rebuildCabinet();
      }

      // Smooth damping/lerp for rotation and zoom
      theta += (targetTheta - theta) * 0.12;
      phi += (targetPhi - phi) * 0.12;
      radius += (targetRadius - radius) * 0.12;

      updateCameraPosition();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 520;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);

      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }

      renderer.dispose();
      if (timberTexture) timberTexture.dispose();
      if (stoneTexture) stoneTexture.dispose();
      shadowTexture.dispose();
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      height: height,
      backgroundColor: '#FFFFFF',
      position: 'relative',
      borderRadius: '2px',
      overflow: 'hidden'
    }}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF' }} />

      {/* Floating 3D Interaction Badge */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        border: '1px solid #D8D4CE',
        borderRadius: '2px',
        padding: '5px 12px',
        fontSize: '0.68rem',
        fontWeight: 600,
        color: '#66615C',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B', borderRadius: '50%' }} />
        <span>DRAG TO ROTATE · SCROLL TO ZOOM</span>
      </div>

      {/* Reset Camera View Button */}
      <button
        onClick={() => resetCameraRef.current && resetCameraRef.current()}
        style={{
          position: 'absolute',
          top: '14px',
          right: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          border: '1px solid #D8D4CE',
          borderRadius: '2px',
          padding: '5px 10px',
          fontSize: '0.66rem',
          fontWeight: 600,
          color: '#111111',
          letterSpacing: '0.06em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#111111';
          e.currentTarget.style.color = '#EC202B';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#D8D4CE';
          e.currentTarget.style.color = '#111111';
        }}
      >
        <RotateCcw size={12} />
        <span>RESET VIEW</span>
      </button>
    </div>
  );
}
