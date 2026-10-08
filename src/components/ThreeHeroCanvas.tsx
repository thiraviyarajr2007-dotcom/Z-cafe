'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ThreeHeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability safely
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Ambient & Point Lighting for warm 3D glow
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.2);
    scene.add(ambientLight);

    const warmLight = new THREE.PointLight(0xff9900, 3.5, 20);
    warmLight.position.set(2, 3, 3);
    warmLight.castShadow = true;
    scene.add(warmLight);

    const goldenLight = new THREE.PointLight(0xf7b52c, 2.5, 15);
    goldenLight.position.set(-2.5, 1.5, 2);
    scene.add(goldenLight);

    const rimLight = new THREE.DirectionalLight(0xff4422, 1.5);
    rimLight.position.set(0, -3, -2);
    scene.add(rimLight);

    // Group for all floating 3D objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. 3D Biryani Bowl Object (Left-Center)
    const bowlGroup = new THREE.Group();
    bowlGroup.position.set(-1.8, -0.2, 0.4);

    // Clay/Ceramic Bowl
    const bowlGeo = new THREE.CylinderGeometry(0.85, 0.45, 0.5, 32, 1, true);
    const bowlMat = new THREE.MeshStandardMaterial({
      color: 0x8b3a1b,
      roughness: 0.6,
      metalness: 0.1,
    });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.castShadow = true;
    bowlGroup.add(bowl);

    // Biryani Rice Mound
    const riceGeo = new THREE.SphereGeometry(0.82, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const riceMat = new THREE.MeshStandardMaterial({
      color: 0xf4a622,
      roughness: 0.85,
      metalness: 0.05,
    });
    const riceMound = new THREE.Mesh(riceGeo, riceMat);
    riceMound.position.y = 0.15;
    bowlGroup.add(riceMound);

    // Saffron Spice speckles
    const spiceGeo = new THREE.DodecahedronGeometry(0.12);
    const spiceMat = new THREE.MeshStandardMaterial({ color: 0x801818, roughness: 0.5 });
    const spice1 = new THREE.Mesh(spiceGeo, spiceMat);
    spice1.position.set(0.2, 0.4, 0.1);
    bowlGroup.add(spice1);
    mainGroup.add(bowlGroup);

    // 2. 3D Golden Samosa Object (Right Foreground)
    const samosaGroup = new THREE.Group();
    samosaGroup.position.set(1.9, -0.4, 0.8);
    const samosaGeo = new THREE.ConeGeometry(0.55, 0.85, 4);
    const samosaMat = new THREE.MeshStandardMaterial({
      color: 0xdf942a,
      roughness: 0.55,
      metalness: 0.1,
    });
    const samosa = new THREE.Mesh(samosaGeo, samosaMat);
    samosa.rotation.x = Math.PI * 0.15;
    samosa.rotation.z = Math.PI * 0.2;
    samosa.castShadow = true;
    samosaGroup.add(samosa);
    mainGroup.add(samosaGroup);

    // 3. 3D Juice Cup / Soda Glass (Right-Center)
    const juiceGroup = new THREE.Group();
    juiceGroup.position.set(1.6, 0.8, -0.4);
    const glassGeo = new THREE.CylinderGeometry(0.42, 0.32, 1.1, 24);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xff3b30,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.4,
    });
    const juice = new THREE.Mesh(glassGeo, glassMat);
    juiceGroup.add(juice);

    // Straw
    const strawGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 16);
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const straw = new THREE.Mesh(strawGeo, strawMat);
    straw.position.set(0.1, 0.3, 0);
    straw.rotation.z = -0.3;
    juiceGroup.add(straw);
    mainGroup.add(juiceGroup);

    // 4. 3D Floating Token #104 Hologram Card (Top Left)
    const tokenCardGroup = new THREE.Group();
    tokenCardGroup.position.set(-1.6, 1.1, -0.2);
    const cardGeo = new THREE.BoxGeometry(1.1, 0.65, 0.05);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0x1f1317,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x5a1a2b,
      emissiveIntensity: 0.4,
    });
    const tokenCard = new THREE.Mesh(cardGeo, cardMat);
    tokenCardGroup.add(tokenCard);
    mainGroup.add(tokenCardGroup);

    // 5. Ambient Floating Particle Sparks
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 5;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf7b52c,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Interactive mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.45;
      mouseY = y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth floating rotations & oscillations
      bowlGroup.rotation.y = elapsed * 0.35;
      bowlGroup.position.y = -0.2 + Math.sin(elapsed * 1.5) * 0.08;

      samosaGroup.rotation.y = elapsed * 0.4;
      samosaGroup.position.y = -0.4 + Math.cos(elapsed * 1.8) * 0.07;

      juiceGroup.rotation.y = elapsed * 0.25;
      juiceGroup.position.y = 0.8 + Math.sin(elapsed * 1.4 + 1) * 0.09;

      tokenCardGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.15;
      tokenCardGroup.position.y = 1.1 + Math.cos(elapsed * 1.2) * 0.06;

      particles.rotation.y = elapsed * 0.05;

      // Parallax smooth interpolation
      mainGroup.rotation.y += (mouseX - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (-mouseY - mainGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-90 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
