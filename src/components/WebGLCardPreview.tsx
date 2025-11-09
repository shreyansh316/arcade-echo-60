import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface WebGLCardPreviewProps {
  color?: string;
  active?: boolean;
}

export const WebGLCardPreview: React.FC<WebGLCardPreviewProps> = ({
  color = "#06b6d4",
  active = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(1.5);
    container.appendChild(renderer.domElement);

    // Glowing 3D Mesh Core
    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.OctahedronGeometry(1.2, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    // Particle Cloud Ring
    const pCount = 60;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const angle = (i / pCount) * Math.PI * 2;
      const rad = 1.8 + (Math.random() - 0.5) * 0.4;
      pPos[i * 3] = Math.cos(angle) * rad;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      pPos[i * 3 + 2] = Math.sin(angle) * rad;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.06,
      transparent: true,
      opacity: 0.9,
    });
    const pMesh = new THREE.Points(pGeo, pMat);
    group.add(pMesh);

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      mesh.rotation.x += delta * 0.8;
      mesh.rotation.y += delta * 1.2;
      pMesh.rotation.y -= delta * 0.6;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      geo.dispose();
      mat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [active, color]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center animate-in fade-in zoom-in-95 duration-300"
    />
  );
};
