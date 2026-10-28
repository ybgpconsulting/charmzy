import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface JewelrySceneProps {
  interactive?: boolean;
  compact?: boolean;
  className?: string;
  showControls?: boolean;
}

export const JewelryScene: React.FC<JewelrySceneProps> = ({
  compact = false,
  className = '',
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Mutable animation refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const masterGroupRef = useRef<THREE.Group | null>(null);
  const hangingDropsGroupRef = useRef<THREE.Group | null>(null);
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.1, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const previousPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const autoRotateRef = useRef<boolean>(true);
  const zoomLevelRef = useRef<number>(compact ? 5.6 : 4.4);

  useEffect(() => {
    autoRotateRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.15, zoomLevelRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Realistic Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point Lighting for authentic thread & mirror reflections
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(3, 5, 4);
    sunLight.castShadow = !isSoftwareGl;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xfff1f5, 1.6);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffe4e6, 0.9);
    scene.add(hemiLight);

    // Soft Contact Grounding Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
      grad.addColorStop(0, 'rgba(219, 39, 119, 0.28)');
      grad.addColorStop(0.5, 'rgba(244, 114, 182, 0.12)');
      grad.addColorStop(1, 'rgba(255, 240, 245, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.9;
    scene.add(shadowPlane);

    // MASTER JHUMKA GROUP (Matching user's attached photo!)
    const masterGroup = new THREE.Group();
    masterGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // REUSABLE MATERIALS
    // Mirror material (highly reflective mirror disc)
    const mirrorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f9fa,
      metalness: 0.98,
      roughness: 0.05,
    });

    // Yellow silk thread ring
    const yellowThreadMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Bright Sunny Yellow
      roughness: 0.85,
      metalness: 0.1,
    });

    // Sky blue / Turquoise base dome material
    const turquoiseDomeMaterial = new THREE.MeshStandardMaterial({
      color: 0x67e8f9, // Soft Sky Blue / Turquoise
      roughness: 0.65,
      metalness: 0.15,
    });

    // Gold braided bead material
    const goldLaceMaterial = new THREE.MeshStandardMaterial({
      color: 0xebb846,
      metalness: 0.9,
      roughness: 0.3,
    });

    // Pearl material
    const pearlMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfffcf5,
      roughness: 0.25,
      metalness: 0.05,
      clearcoat: 0.9,
    });

    // Translucent crystal drop materials (Magenta, Aqua, Purple, Amber)
    const crystalColors = [0xec4899, 0x06b6d4, 0x9333ea, 0xeab308];
    const crystalMaterials = crystalColors.map(
      (col) =>
        new THREE.MeshPhysicalMaterial({
          color: col,
          roughness: 0.1,
          metalness: 0.1,
          transmission: isSoftwareGl ? 0 : 0.88,
          thickness: 1.2,
          clearcoat: 1.0,
        })
    );

    // Multi-color bead materials for borders (Pink, Cyan, Yellow, White, Orange)
    const rainbowColors = [0xf43f5e, 0x0ea5e9, 0xfacc15, 0xffffff, 0xf97316, 0xa855f7];
    const rainbowMaterials = rainbowColors.map(
      (c) =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.4,
          metalness: 0.1,
        })
    );

    // ==========================================
    // 1. TOP STUD / CIRCULAR MIRROR DISC
    // ==========================================
    const studGroup = new THREE.Group();
    studGroup.position.set(0, 1.25, 0);

    // Center circular mirror
    const centerMirror = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.04, 32),
      mirrorMaterial
    );
    centerMirror.rotation.x = Math.PI / 2;
    studGroup.add(centerMirror);

    // Sunny yellow thread wrapped ring framing the mirror
    const yellowThreadRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.065, 16, 36),
      yellowThreadMaterial
    );
    studGroup.add(yellowThreadRing);

    // Outer multi-colored pastel seed bead rim (40 tiny colorful beads)
    const seedBeadCount = 36;
    const outerBeadRadius = 0.54;
    for (let i = 0; i < seedBeadCount; i++) {
      const angle = (i / seedBeadCount) * Math.PI * 2;
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 10, 10),
        rainbowMaterials[i % rainbowMaterials.length]
      );
      bead.position.set(
        Math.cos(angle) * outerBeadRadius,
        Math.sin(angle) * outerBeadRadius,
        0.02
      );
      studGroup.add(bead);
    }

    // Bottom dangling mini pearls on the stud
    for (let i = -2; i <= 2; i++) {
      const miniPearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        pearlMaterial
      );
      miniPearl.position.set(i * 0.14, -0.66, 0.02);
      studGroup.add(miniPearl);

      const linkWire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8),
        goldLaceMaterial
      );
      linkWire.position.set(i * 0.14, -0.59, 0.02);
      studGroup.add(linkWire);
    }

    masterGroup.add(studGroup);

    // ==========================================
    // 2. CENTRAL PEARL CONNECTOR LINK
    // ==========================================
    const centralPearl = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 18, 18),
      pearlMaterial
    );
    centralPearl.position.set(0, 0.52, 0);
    masterGroup.add(centralPearl);

    const connectorPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.28, 10),
      goldLaceMaterial
    );
    connectorPin.position.set(0, 0.44, 0);
    masterGroup.add(connectorPin);

    // ==========================================
    // 3. MAIN JHUMKI BELL DOME WITH MIRROR INSETS
    // ==========================================
    const domeGroup = new THREE.Group();

    // Upper crown cap: Gold beaded braid + Pink embroidered rim
    const crownCap = new THREE.Mesh(
      new THREE.TorusGeometry(0.26, 0.04, 12, 28),
      goldLaceMaterial
    );
    crownCap.position.set(0, 0.28, 0);
    crownCap.rotation.x = Math.PI / 2;
    domeGroup.add(crownCap);

    const pinkCrownRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.035, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.8 })
    );
    pinkCrownRim.position.set(0, 0.24, 0);
    pinkCrownRim.rotation.x = Math.PI / 2;
    domeGroup.add(pinkCrownRim);

    // Main Flared Sky Blue Bell Dome
    const domePoints: THREE.Vector2[] = [];
    domePoints.push(new THREE.Vector2(0.12, 0.28));
    domePoints.push(new THREE.Vector2(0.24, 0.24));
    domePoints.push(new THREE.Vector2(0.48, 0.15));
    domePoints.push(new THREE.Vector2(0.78, -0.05));
    domePoints.push(new THREE.Vector2(0.96, -0.32));
    domePoints.push(new THREE.Vector2(0.98, -0.42));
    domePoints.push(new THREE.Vector2(0.94, -0.44));
    domePoints.push(new THREE.Vector2(0.82, -0.42));
    domePoints.push(new THREE.Vector2(0.58, -0.15));
    domePoints.push(new THREE.Vector2(0.12, 0.1));

    const domeGeo = new THREE.LatheGeometry(domePoints, 32);
    domeGeo.computeVertexNormals();
    const bellDome = new THREE.Mesh(domeGeo, turquoiseDomeMaterial);
    bellDome.castShadow = !isSoftwareGl;
    domeGroup.add(bellDome);

    // Circumference inset mirrors with colored embroidered borders
    // Like the photo: red, yellow, turquoise, purple, orange mirror rings!
    const mirrorInsetCount = 8;
    const insetRadius = 0.91;
    const borderColors = [0xef4444, 0xfacc15, 0x38bdf8, 0xa855f7, 0xf97316, 0xec4899, 0x10b981, 0xf43f5e];

    for (let i = 0; i < mirrorInsetCount; i++) {
      const angle = (i / mirrorInsetCount) * Math.PI * 2;
      const x = Math.cos(angle) * insetRadius;
      const z = Math.sin(angle) * insetRadius;

      // Small round mirror disc
      const smallMirror = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.02, 16),
        mirrorMaterial
      );
      smallMirror.position.set(x, -0.22, z);
      smallMirror.lookAt(x * 2, -0.22, z * 2);
      smallMirror.rotateX(Math.PI / 2);
      domeGroup.add(smallMirror);

      // Colorful thread ring border around each mirror
      const coloredBorderRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.13, 0.025, 10, 20),
        new THREE.MeshStandardMaterial({
          color: borderColors[i % borderColors.length],
          roughness: 0.7,
        })
      );
      coloredBorderRing.position.set(x * 1.01, -0.22, z * 1.01);
      coloredBorderRing.lookAt(x * 2, -0.22, z * 2);
      domeGroup.add(coloredBorderRing);

      // Pearl separator bead between mirrors
      const halfAngle = angle + (Math.PI / mirrorInsetCount);
      const pearlX = Math.cos(halfAngle) * (insetRadius - 0.02);
      const pearlZ = Math.sin(halfAngle) * (insetRadius - 0.02);
      const separatorPearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        pearlMaterial
      );
      separatorPearl.position.set(pearlX, -0.22, pearlZ);
      domeGroup.add(separatorPearl);
    }

    // Lower Bell Rim Lace Ribbon
    const lowerRimRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.96, 0.035, 12, 36),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.5 })
    );
    lowerRimRing.position.set(0, -0.42, 0);
    lowerRimRing.rotation.x = Math.PI / 2;
    domeGroup.add(lowerRimRing);

    masterGroup.add(domeGroup);

    // ==========================================
    // 4. DANGLING FACETED CRYSTALS & PEARLS
    // ==========================================
    const hangingDropsGroup = new THREE.Group();
    hangingDropsGroupRef.current = hangingDropsGroup;
    masterGroup.add(hangingDropsGroup);

    const tasselCount = 14;
    const dropRadius = 0.95;

    for (let i = 0; i < tasselCount; i++) {
      const angle = (i / tasselCount) * Math.PI * 2;
      const x = Math.cos(angle) * dropRadius;
      const z = Math.sin(angle) * dropRadius;

      // Gold connecting loop wire
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8),
        goldLaceMaterial
      );
      wire.position.set(x, -0.52, z);
      hangingDropsGroup.add(wire);

      // Intermediate white seed pearl
      const midPearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 12, 12),
        pearlMaterial
      );
      midPearl.position.set(x, -0.63, z);
      hangingDropsGroup.add(midPearl);

      // Hanging faceted colorful crystal drop (magenta, cyan, purple, amber!)
      const crystalMat = crystalMaterials[i % crystalMaterials.length];
      const crystalDrop = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.09, 1),
        crystalMat
      );
      crystalDrop.position.set(x, -0.77, z);
      crystalDrop.scale.set(0.9, 1.25, 0.9);
      hangingDropsGroup.add(crystalDrop);

      // Bottom tiny pin pearl
      const bottomPearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 10, 10),
        pearlMaterial
      );
      bottomPearl.position.set(x, -0.9, z);
      hangingDropsGroup.add(bottomPearl);
    }

    // Subtle gentle sparkle particles
    const sparkleCount = 45;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount * 3; i += 3) {
      sparklePositions[i] = (Math.random() - 0.5) * 3.2;
      sparklePositions[i + 1] = (Math.random() - 0.5) * 3.2;
      sparklePositions[i + 2] = (Math.random() - 0.5) * 3.2;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const sparklePoints = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparklePoints);

    // Pointer Interaction (Drag / Touch to rotate)
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      previousPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousPointerRef.current.x;
      const deltaY = e.clientY - previousPointerRef.current.y;

      targetRotationRef.current.y += deltaX * 0.009;
      targetRotationRef.current.x = THREE.MathUtils.clamp(
        targetRotationRef.current.x + deltaY * 0.007,
        -0.4,
        0.65
      );

      previousPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomLevelRef.current = THREE.MathUtils.clamp(
        zoomLevelRef.current + e.deltaY * 0.004,
        2.6,
        7.5
      );
      if (cameraRef.current) {
        cameraRef.current.position.z = zoomLevelRef.current;
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += delta * 0.55;
      }

      if (masterGroup) {
        masterGroup.rotation.y = THREE.MathUtils.damp(
          masterGroup.rotation.y,
          targetRotationRef.current.y,
          8,
          delta
        );
        masterGroup.rotation.x = THREE.MathUtils.damp(
          masterGroup.rotation.x,
          targetRotationRef.current.x,
          8,
          delta
        );
        masterGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.04 + 0.08;
      }

      if (hangingDropsGroup) {
        hangingDropsGroup.rotation.z = Math.sin(elapsedTime * 2.0) * 0.025;
      }

      if (sparklePoints) {
        sparklePoints.rotation.y = elapsedTime * 0.06;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = THREE.MathUtils.damp(
          cameraRef.current.position.z,
          zoomLevelRef.current,
          6,
          delta
        );
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        frameId = window.setTimeout(tick, 45);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('wheel', handleWheel);

      masterGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      shadowPlane.geometry.dispose();
      (shadowPlane.material as THREE.Material).dispose();
      shadowTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    const delta = direction === 'in' ? -0.8 : 0.8;
    zoomLevelRef.current = THREE.MathUtils.clamp(
      zoomLevelRef.current + delta,
      2.6,
      7.5
    );
  };

  return (
    <div className={`relative w-full h-full min-h-[380px] select-none ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
      />

      {/* Floating minimal zoom controls (Non-obstructive) */}
      {showControls && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-pink-200 p-1 rounded-full shadow-sm">
          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-1.5 text-zinc-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-1.5 text-zinc-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            title={isRotating ? 'Pause 360 Spin' : 'Resume 360 Spin'}
            className={`p-1.5 rounded-full transition cursor-pointer ${
              isRotating ? 'text-pink-600 bg-pink-100' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`}
              style={{ animationDuration: '8s' }}
            />
          </button>
        </div>
      )}
    </div>
  );
};
