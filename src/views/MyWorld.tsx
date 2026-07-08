import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html, Billboard, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { Hammer, Trash2, Plus, X, Palette, Settings, Eye, CloudRain, Sun, Info, Zap } from 'lucide-react';
import { User, ViewType } from '../types';
import { useQuestManager } from '../lib/QuestManager';

function Avatar({ position, rotation, isMoving }: { position: THREE.Vector3, rotation: number, isMoving: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Animation logic for walking
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      if (isMoving) {
        // Bobbing up and down when moving
        groupRef.current.position.y = 0.5 + Math.sin(t * 12) * 0.08;
        // Slight tilt
        groupRef.current.rotation.z = Math.sin(t * 12) * 0.05;
      } else {
        // Idle breathing
        groupRef.current.position.y = 0.5 + Math.sin(t * 2) * 0.02;
        groupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={[position.x, 0.5, position.z]} rotation={[0, rotation, 0]}>
      {/* Glow aura */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial color="#00D9FF" transparent opacity={0.4} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.25, 0.5, 8, 16]} />
        <meshStandardMaterial color="#B026FF" emissive="#B026FF" emissiveIntensity={2} roughness={0.1} metalness={0.9} />
      </mesh>
      
      {/* Visor/Face - BRIGHT NEON */}
      <mesh position={[0, 0.7, 0.18]}>
        <boxGeometry args={[0.35, 0.12, 0.1]} />
        <meshBasicMaterial color="#00D9FF" />
      </mesh>

      {/* Backpack / Jetpack */}
      <mesh position={[0, 0.4, -0.15]}>
        <boxGeometry args={[0.3, 0.4, 0.2]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Name tag */}
      <Billboard position={[0, 1.4, 0]}>
        <Text fontSize={0.25} color="white" outlineWidth={0.02} outlineColor="#00D9FF">
          YOU
        </Text>
      </Billboard>

      {/* Spotlight on player */}
      <pointLight position={[0, 2, 0]} intensity={1.5} color="#00D9FF" distance={5} />
    </group>
  );
}

function CyberBuilding({ 
  position, 
  height, 
  color, 
  secondaryColor,
  name, 
  onClick, 
  isUpgraded, 
  isNight,
  buildingType 
}: { 
  position: [number, number, number], 
  height: number, 
  color: string, 
  secondaryColor?: string,
  name?: string, 
  onClick?: () => void, 
  isUpgraded?: boolean, 
  isNight?: boolean,
  buildingType?: string
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  const finalColor = isUpgraded ? '#FFD700' : color;
  const accentColor = secondaryColor || '#00D9FF';
  const emIntensity = hovered ? 4.0 : (isUpgraded ? 2.5 : (isNight ? 1.5 : 0.8));

  // Determine label based on name or type
  const label = name?.includes('Python') ? 'Python' : 
                name?.includes('JS') || name?.includes('Script') ? 'JavaScript' :
                name?.includes('Java') ? 'Java' : name;

  return (
    <group 
      position={position} 
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Main Structure */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[1.5, height, 1.5]} />
        <meshStandardMaterial 
          color="#161b33" 
          roughness={0.1} 
          metalness={0.9} 
          emissive="#161b33"
          emissiveIntensity={0.2}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.5, height, 1.5)]} />
          <lineBasicMaterial color={accentColor} opacity={0.5} transparent />
        </lineSegments>
      </mesh>

      {/* Neon Bands */}
      {Array.from({ length: Math.floor(height) }).map((_, i) => (
        <mesh key={i} position={[0, i + 0.5, 0]}>
          <boxGeometry args={[1.52, 0.05, 1.52]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
      ))}

      {/* Display Panels with Labels */}
      <mesh position={[0.76, height - 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={emIntensity} />
      </mesh>
      
      <Billboard position={[0.8, height - 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Text 
          fontSize={0.3} 
          color="white" 
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t6fqA9L7S3y5pQf9_sS06W1k.woff"
          maxWidth={1}
          textAlign="center"
        >
          {label}
        </Text>
      </Billboard>

      {/* Floating Crystals (like in the image) */}
      <mesh position={[0, height + 1.5, 0]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function SkyBridge({ start, end, color }: { start: [number, number, number], end: [number, number, number], color: string }) {
  const mid = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2];
  const distance = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2));
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <group position={[mid[0], start[1], mid[2]]} rotation={[0, -angle, 0]}>
      <mesh>
        <boxGeometry args={[distance, 0.1, 1.2]} />
        <meshStandardMaterial color="#1E2248" roughness={0.1} metalness={0.8} transparent opacity={0.6} />
      </mesh>
      {/* Neon side rails */}
      <mesh position={[0, 0.1, 0.6]}>
        <boxGeometry args={[distance, 0.05, 0.05]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.1, -0.6]}>
        <boxGeometry args={[distance, 0.05, 0.05]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Underglow */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[distance, 0.02, 1.2]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}


function Tree({ position }: { position: [number, number, number] }) {
  const seed = position[0] * 123 + position[2];
  const height = 0.8 + (Math.abs(seed) % 10) / 10;
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 0.6]} />
        <meshStandardMaterial color="#4A2E1B" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 0.6 + height / 2, 0]}>
        <coneGeometry args={[0.3, height, 5]} />
        <meshStandardMaterial color="#00FF88" roughness={0.8} emissive="#00FF88" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

function Car({ curve, speedOffset, color, isNight }: { curve: THREE.CatmullRomCurve3, speedOffset: number, color: string, isNight: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const [lightsColor] = useState(() => Math.random() > 0.5 ? '#FFFFAA' : '#00D9FF'); // Randomized headlights
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      const t = ((time * (0.05 + speedOffset)) % 1);
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      
      ref.current.position.set(pos.x, pos.y + 0.1, pos.z);
      ref.current.lookAt(pos.x + tangent.x, pos.y + tangent.y, pos.z + tangent.z);
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} emissive={color} emissiveIntensity={isNight ? 0.4 : 0.1} />
      </mesh>
      {/* Headlights */}
      <mesh position={[0.15, 0.05, 0.36]}>
         <sphereGeometry args={[0.05, 8, 8]} />
         <meshBasicMaterial color={isNight ? lightsColor : '#333'} />
      </mesh>
      <mesh position={[-0.15, 0.05, 0.36]}>
         <sphereGeometry args={[0.05, 8, 8]} />
         <meshBasicMaterial color={isNight ? lightsColor : '#333'} />
      </mesh>
      {isNight && (
        <spotLight 
          position={[0, 0.2, 0.4]} 
          angle={Math.PI / 4} 
          penumbra={0.5} 
          intensity={2} 
          distance={10} 
          color={lightsColor} 
          target-position={[0, 0, 5]}
        />
      )}
      {/* Taillights */}
      <mesh position={[0.15, 0.05, -0.36]}>
         <boxGeometry args={[0.1, 0.05, 0.05]} />
         <meshBasicMaterial color={isNight ? '#FF0000' : '#440000'} />
      </mesh>
      <mesh position={[-0.15, 0.05, -0.36]}>
         <boxGeometry args={[0.1, 0.05, 0.05]} />
         <meshBasicMaterial color={isNight ? '#FF0000' : '#440000'} />
      </mesh>
    </group>
  );
}

function StreetLight({ position, rotation, isNight }: { position: [number, number, number], rotation: [number, number, number], isNight: boolean }) {
  return (
    <group position={position} rotation={rotation}>
       <mesh position={[0, 1.5, 0]}>
         <cylinderGeometry args={[0.02, 0.05, 3]} />
         <meshStandardMaterial color="#222" />
       </mesh>
       <mesh position={[0.3, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
         <cylinderGeometry args={[0.02, 0.02, 0.6]} />
         <meshStandardMaterial color="#222" />
       </mesh>
       <mesh position={[0.6, 2.95, 0]}>
          <coneGeometry args={[0.1, 0.1, 8]} />
          <meshStandardMaterial color="#333" />
       </mesh>
       <mesh position={[0.6, 2.9, 0]}>
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial color={isNight ? '#FFD700' : '#444'} />
       </mesh>
       {isNight && <pointLight position={[0.6, 2.8, 0]} intensity={2} distance={8} color="#FFD700" decay={2} />}
    </group>
  );
}

function Person({ curve, speedOffset, color }: { curve: THREE.CatmullRomCurve3, speedOffset: number, color: string }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      const t = ((time * (0.03 + speedOffset)) % 1);
      const pos = curve.getPointAt(t);
      ref.current.position.set(pos.x, 0.3, pos.z);
    }
  });

  return (
    <group ref={ref}>
      <Billboard>
        <mesh>
          <planeGeometry args={[0.2, 0.4]} />
          <meshStandardMaterial color={color} transparent opacity={0.8} />
          <Html position={[0, 0.1, 0]} center distanceFactor={5}>
            <div className="flex flex-col items-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 mb-0.5" />
              <div className="w-2 h-3 bg-white/20 rounded-sm" />
            </div>
          </Html>
        </mesh>
      </Billboard>
    </group>
  );
}

function CityGrid({ 
  buildings, 
  onBuildingClick, 
  isNight,
  isBuildMode,
  onGroundClick,
  avatarPos,
  avatarRot,
  isMoving
}: { 
  buildings: BuildingInstance[], 
  onBuildingClick: (id: string) => void, 
  isNight: boolean,
  isBuildMode: boolean,
  onGroundClick: (pos: [number, number, number]) => void,
  avatarPos: THREE.Vector3,
  avatarRot: number,
  isMoving: boolean
}) {
  const { roads, trees, vehicles, pedestrians, streetLights, skyBridges } = useMemo(() => {
    const r = [];
    const t = [];
    const v = [];
    const p = [];
    const sl = [];
    const sb = [];
    const size = 15;

    // Roads
    for (let i = -size; i <= size; i += 6) {
      r.push({ position: [0, 0.01, i] as [number,number,number], args: [40, 0.5] as [number,number], rotation: [0, 0, 0] as [number,number,number] });
      r.push({ position: [i, 0.01, 0] as [number,number,number], args: [0.5, 40] as [number,number], rotation: [0, 0, 0] as [number,number,number] });
      
      // Street lights
      for (let j = -size; j <= size; j += 8) {
        sl.push({ position: [j, 0, i + 0.6] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] });
        sl.push({ position: [i + 0.6, 0, j] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] });
      }
    }

    // Sky Bridges (like in image)
    sb.push({ start: [0, 4, 0] as [number, number, number], end: [8, 4, 8] as [number, number, number], color: '#00D9FF' });
    sb.push({ start: [0, 4, 0] as [number, number, number], end: [-8, 4, -8] as [number, number, number], color: '#B026FF' });
    sb.push({ start: [8, 4, 8] as [number, number, number], end: [-8, 4, 8] as [number, number, number], color: '#00FF88' });

    // Vehicle Paths
    const createLoop = (offset: number, reverse = false) => {
      const points = [
        new THREE.Vector3(-size, 0, offset),
        new THREE.Vector3(size, 0, offset),
        new THREE.Vector3(size, 0, -offset),
        new THREE.Vector3(-size, 0, -offset),
      ];
      if (reverse) points.reverse();
      return new THREE.CatmullRomCurve3(points, true);
    };

    [6, 12].forEach(offset => {
      for (let i = 0; i < 4; i++) {
        v.push({ 
          id: `v-${offset}-${i}`, 
          curve: createLoop(offset + (i * 0.2), i % 2 === 0), 
          speedOffset: Math.random() * 0.03, 
          color: i % 2 === 0 ? '#00D9FF' : '#B026FF' 
        });
      }
    });

    // Pedestrian Paths
    for (let i = 0; i < 12; i++) {
      const px = (Math.random() - 0.5) * 20;
      const pz = (Math.random() - 0.5) * 20;
      const personPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(px, 0, pz),
        new THREE.Vector3(px + 3, 0, pz + 1),
        new THREE.Vector3(px + 2, 0, pz + 4),
        new THREE.Vector3(px - 1, 0, pz + 2),
      ], true);
      
      p.push({ 
        id: `p-${i}`, 
        curve: personPath, 
        speedOffset: Math.random() * 0.01, 
        color: i % 2 === 0 ? '#00FF88' : '#FFD700' 
      });
    }

    return { roads: r, trees: t, vehicles: v, pedestrians: p, streetLights: sl, skyBridges: sb };
  }, []);

  return (
    <group>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.05, 0]}
        onClick={(e) => {
          if (isBuildMode) {
            e.stopPropagation();
            onGroundClick([Math.round(e.point.x), 0, Math.round(e.point.z)]);
          }
        }}
        onPointerOver={() => { if(isBuildMode) document.body.style.cursor = 'crosshair'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1e35" roughness={0.2} metalness={0.8} />
      </mesh>
      
      <gridHelper args={[100, 50, '#00D9FF', '#3a3d5a']} position={[0, 0.01, 0]} />
      
      {roads.map((road, i) => (
        <mesh key={`road-${i}`} position={road.position} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={road.args} />
          <meshStandardMaterial color="#0d112b" roughness={0.8} />
        </mesh>
      ))}

      {buildings.map(b => (
        <CyberBuilding 
          key={b.id} 
          position={b.position} 
          height={2 + b.level * 2} 
          color={b.color} 
          secondaryColor={b.secondaryColor}
          name={b.name}
          onClick={() => onBuildingClick(b.id)}
          isNight={isNight}
          isUpgraded={b.level > 1}
          buildingType={b.type}
        />
      ))}

      {skyBridges.map((bridge, i) => (
        <SkyBridge key={`bridge-${i}`} {...bridge} />
      ))}

      {vehicles.map(v => (
        <Car key={v.id} curve={v.curve} speedOffset={v.speedOffset} color={v.color} isNight={isNight} />
      ))}

      {pedestrians.map(p => (
        <Person key={p.id} curve={p.curve} speedOffset={p.speedOffset} color={p.color} />
      ))}

      {streetLights.map((sl, i) => (
        <StreetLight key={`sl-${i}`} position={sl.position} rotation={sl.rotation} isNight={isNight} />
      ))}

      <Avatar position={avatarPos} rotation={avatarRot} isMoving={isMoving} />
    </group>
  );
}


function AnimatedCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame(({ clock }) => {
    if (cameraRef.current) {
       // Gentle bobbing and rotating around the city
       const t = clock.getElapsedTime();
       cameraRef.current.position.x = Math.sin(t * 0.1) * 20;
       cameraRef.current.position.z = Math.cos(t * 0.1) * 20;
       cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[15, 10, 15]} fov={45} />;
}


function WeatherRain({ count = 1000 }: { count?: number }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = Math.random() * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= 20 * delta; // Falling speed
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 20;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#00D9FF" size={0.05} transparent opacity={0.4} />
    </points>
  );
}

interface BuildingInstance {
  id: string;
  type: 'residential' | 'tech' | 'industrial' | 'monument';
  position: [number, number, number];
  color: string;
  secondaryColor?: string;
  name: string;
  level: number;
}

export function MyWorld({ user, onNavigate }: { user: User, onNavigate: (view: ViewType) => void }) {
  // Use user.xp to determine city level
  const cityLevel = Math.floor(user.xp / 500) + 1;
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [isBuildMode, setIsBuildMode] = useState(false);
  const [buildings, setBuildings] = useState<BuildingInstance[]>(() => {
    const saved = localStorage.getItem('cyber-city-layout-v3');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'tech', position: [0, 0, 0], color: '#00D9FF', name: 'Python Core', level: 2 },
      { id: '2', type: 'tech', position: [6, 0, 6], color: '#B026FF', name: 'JavaScript Nexus', level: 1 },
      { id: '3', type: 'tech', position: [-6, 0, -6], color: '#FFD700', name: 'Java Sanctuary', level: 1 },
      { id: '4', type: 'residential', position: [0, 0, 10], color: '#00FF88', name: 'Citizen Tower', level: 1 },
    ];
  });

  // Avatar state
  const [avatarPos, setAvatarPos] = useState(new THREE.Vector3(5, 0, 5));
  const [avatarRot, setAvatarRot] = useState(Math.PI / 4);
  const [isMoving, setIsMoving] = useState(false);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Movement loop
  useEffect(() => {
    let frameId: number;
    const move = () => {
      let moving = false;
      setAvatarPos(prev => {
        const next = prev.clone();
        const speed = 0.25;
        
        if (keys['ArrowUp'] || keys['KeyW']) {
          next.z -= Math.cos(avatarRot) * speed;
          next.x -= Math.sin(avatarRot) * speed;
          moving = true;
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
          next.z += Math.cos(avatarRot) * speed;
          next.x += Math.sin(avatarRot) * speed;
          moving = true;
        }
        if (keys['ArrowLeft'] || keys['KeyA']) {
          setAvatarRot(r => r + 0.06);
          moving = true;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
          setAvatarRot(r => r - 0.06);
          moving = true;
        }

        // Boundary check
        next.x = Math.max(-45, Math.min(45, next.x));
        next.z = Math.max(-45, Math.min(45, next.z));
        
        return next;
      });
      setIsMoving(moving);
      frameId = requestAnimationFrame(move);
    };
    move();
    return () => cancelAnimationFrame(frameId);
  }, [keys, avatarRot]);

  useEffect(() => {
    localStorage.setItem('cyber-city-layout-v3', JSON.stringify(buildings));
  }, [buildings]);

  const updateBuilding = (id: string, updates: Partial<BuildingInstance>) => {
    setBuildings(buildings.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBuilding = (id: string) => {
    setBuildings(buildings.filter(b => b.id !== id));
    setSelectedBuildingId(null);
  };

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);
  const [editingName, setEditingName] = useState('');

  const [weather, setWeather] = useState<{ condition: 'clear' | 'rain' | 'fog', temp: number }>({ condition: 'clear', temp: 22 });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const data = await response.json();
          const code = data.current_weather.weathercode;
          
          let condition: 'clear' | 'rain' | 'fog' = 'clear';
          if (code >= 51 && code <= 67) condition = 'rain';
          if (code >= 45 && code <= 48) condition = 'fog';
          
          setWeather({ condition, temp: data.current_weather.temperature });
        });
      } catch (e) {
        console.error('Failed to fetch weather', e);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 1000 * 60 * 30); // Every 30 mins
    return () => clearInterval(interval);
  }, []);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const timeHours = time.getHours() + time.getMinutes() / 60;
  const isNight = timeHours < 6 || timeHours >= 18;
  
  const skyColor = isNight ? '#0a0b1e' : '#1A1E35';
  const ambientIntensity = isNight ? 0.8 : 1.5;
  const ambientColor = isNight ? '#1a1b3a' : '#ffffff';
  const sunIntensity = isNight ? 0.6 : 2.5;
  const sunColor = isNight ? '#4e5fae' : '#ffffff';
  
  const fogDensity = isNight ? 0.01 : 0.005;

  const { addXp, universalCoins, deductCoins } = useQuestManager();

  const handleUpgradeNode = () => {
    if (selectedBuilding) {
      const cost = selectedBuilding.level * 150;
      const requirement = selectedBuilding.level === 1 ? 'Complete 3 Code Lab Tasks' : 'Achieve Level 5 Mastery';
      
      if (universalCoins < cost) {
        alert(`Insufficient Neural Coins for upgrade. Need: ${cost} | Balance: ${universalCoins}`);
        return;
      }

      if (confirm(`Required protocol: ${requirement}\nUpgrade Cost: ${cost} Coins\n\nInitiate visual architecture upgrade?`)) {
        if (deductCoins(cost)) {
          updateBuilding(selectedBuilding.id, { level: Math.min(selectedBuilding.level + 1, 5) });
          addXp(100, `Protocol Upgrade: ${selectedBuilding.name}`);
        }
      }
    }
  };

  const addBuilding = (type: BuildingInstance['type']) => {
    const cost = 300;
    if (deductCoins(cost)) {
      const newBuilding: BuildingInstance = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        position: [(Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20],
        color: type === 'tech' ? '#00D9FF' : type === 'industrial' ? '#FF9500' : '#B026FF',
        secondaryColor: '#FFFFFF',
        name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        level: 1
      };
      setBuildings([...buildings, newBuilding]);
      setSelectedBuildingId(newBuilding.id);
      addXp(50, `Constructed ${type}`);
    } else {
      alert(`Neural Credit Depletion. Need ${cost} Coins. Current: ${universalCoins}`);
    }
  };

  return (
    <div className="h-full w-full flex flex-col space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">
          Cyber City: {user.name}'s World
        </h1>
        <p className="text-gray-400">Your city grows as you complete quests and earn XP. Current Level: {cityLevel}. Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border border-brand-cyan/30 shadow-[0_0_30px_rgba(0,217,255,0.2)] relative bg-black">
        {/* UI Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <button 
            onClick={() => setIsBuildMode(!isBuildMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isBuildMode ? 'bg-brand-cyan text-black border-brand-cyan shadow-[0_0_20px_rgba(0,217,255,0.4)]' : 'bg-black/60 text-brand-cyan border-brand-cyan/50 backdrop-blur-md'}`}
          >
            {isBuildMode ? <Eye size={18} /> : <Hammer size={18} />}
            <span className="font-bold uppercase tracking-widest text-xs">{isBuildMode ? 'Exit Build Protocol' : 'Build Protocol'}</span>
          </button>

          {isBuildMode && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-black/60 backdrop-blur-md border border-brand-cyan/30 p-3 rounded-xl flex flex-col gap-2"
            >
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Structures</p>
              <div className="grid grid-cols-2 gap-2">
                {(['tech', 'residential', 'industrial', 'monument'] as const).map(type => (
                  <button 
                    key={type}
                    onClick={() => addBuilding(type)}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-brand-cyan/10 hover:border-brand-cyan/50 transition-all text-[10px] font-bold text-white uppercase"
                  >
                    {type}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-brand-cyan italic mt-1">Click on ground to place at random or select type to spawn</p>
            </motion.div>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <div className="bg-black/60 backdrop-blur-md border border-brand-cyan/50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-brand-cyan font-bold flex items-center gap-2">
                <Settings size={14} /> City Stats
              </h3>
              <span className="text-[10px] text-brand-orange font-mono bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/30 flex items-center gap-1 uppercase tracking-tighter">
                {weather.condition === 'rain' ? <CloudRain size={10} /> : <Sun size={10} />}
                {weather.condition} {weather.temp}°C
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Temporal Sync</span>
                <span className="font-mono text-[10px] text-brand-cyan">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Day Cycle</span>
                <span className="font-mono text-[10px] text-white">{isNight ? 'NIGHT PHASE' : 'DAY PHASE'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Neural Coins</span>
                <span className="font-mono text-[10px] text-[#FFD700]">{universalCoins.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-4 pt-1 border-t border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Structures</span>
                <span className="font-mono text-[10px] text-white">{buildings.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Editor Overlay */}
        {selectedBuilding && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-80 z-20 bg-brand-sidebar/95 backdrop-blur-xl border border-brand-cyan/50 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Structure Protocol</h2>
                <button onClick={() => setSelectedBuildingId(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
             </div>
             
             <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-brand-cyan mb-1 font-bold uppercase tracking-widest">Identifier</label>
                  <input 
                    type="text" 
                    value={selectedBuilding.name} 
                    onChange={e => updateBuilding(selectedBuilding.id, { name: e.target.value })} 
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-brand-cyan mb-1 font-bold uppercase tracking-widest">Aura Color (Primary)</label>
                  <div className="flex gap-2 mb-3">
                    {['#00D9FF', '#B026FF', '#FF9500', '#00FF88', '#FF0055'].map(c => (
                      <button 
                        key={`primary-${c}`}
                        onClick={() => updateBuilding(selectedBuilding.id, { color: c })}
                        className={`w-6 h-6 rounded-full border-2 ${selectedBuilding.color === c ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <label className="block text-[10px] text-brand-purple mb-1 font-bold uppercase tracking-widest">Accent Color (Secondary)</label>
                  <div className="flex gap-2">
                    {['#FFFFFF', '#00D9FF', '#B026FF', '#FFD700', '#FF0055'].map(c => (
                      <button 
                        key={`secondary-${c}`}
                        onClick={() => updateBuilding(selectedBuilding.id, { secondaryColor: c })}
                        className={`w-6 h-6 rounded-full border-2 ${selectedBuilding.secondaryColor === c ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-xl">
                  <h4 className="text-[9px] text-brand-purple font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Info size={10} /> Upgrade Requirements
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    {selectedBuilding.level === 1 
                      ? "Complete 3 Code Lab challenges to unlock visual structural enhancement." 
                      : "Achieve Level 5 Mastery in Arena to unlock Monument status."}
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                   <button 
                    onClick={handleUpgradeNode}
                    className="flex-1 bg-brand-cyan text-black font-bold py-2.5 rounded-lg text-xs hover:bg-brand-cyan/80 transition-all flex items-center justify-center gap-2"
                   >
                     <Zap size={14} />
                     {selectedBuilding.level === 5 ? 'Maximized' : 'Initiate Upgrade'}
                   </button>
                   <button 
                    onClick={() => deleteBuilding(selectedBuilding.id)}
                    className="p-2.5 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
             </div>
          </div>
        )}


        {/* 3D Canvas */}
        <Canvas shadows camera={{ position: [50, 40, 50], fov: 45 }}>
          <color attach="background" args={[skyColor]} />
          
          {weather.condition === 'rain' && <WeatherRain />}
          
          <ambientLight intensity={ambientIntensity} color={ambientColor} />
          <directionalLight 
            position={[50, 60, 50]} 
            intensity={sunIntensity} 
            color={sunColor} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          
          <pointLight position={[0, 40, 0]} intensity={5} color="#00D9FF" />
          <pointLight position={[30, 20, 30]} intensity={4} color="#B026FF" />
          <pointLight position={[-30, 20, -30]} intensity={4} color="#00FF88" />
          <pointLight position={[30, 20, -30]} intensity={4} color="#FFD700" />
          
          {isNight && <Stars radius={250} depth={100} count={6000} factor={6} saturation={0} fade speed={2} />}
          
          <OrbitControls 
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.1}
            minDistance={15}
            maxDistance={150}
            target={[0, 0, 0]}
          />
          
          <CityGrid 
            buildings={buildings} 
            onBuildingClick={(id) => setSelectedBuildingId(id)} 
            isNight={isNight} 
            isBuildMode={isBuildMode}
            avatarPos={avatarPos}
            avatarRot={avatarRot}
            isMoving={isMoving}
            onGroundClick={(pos) => {
              const newBuilding: BuildingInstance = {
                id: Math.random().toString(36).substr(2, 9),
                type: 'tech',
                position: pos,
                color: '#00D9FF',
                level: 1
              };
              setBuildings([...buildings, newBuilding]);
              setSelectedBuildingId(newBuilding.id);
            }}
          />
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.1} 
              luminanceSmoothing={0.9} 
              intensity={isNight ? 2.5 : 1.2} 
            />
          </EffectComposer>
        </Canvas>

        {/* Controls Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md border border-brand-cyan/30 px-4 py-2 rounded-full flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded border border-white/20 text-[10px] text-white font-bold">W</span>
              <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded border border-white/20 text-[10px] text-white font-bold">A</span>
              <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded border border-white/20 text-[10px] text-white font-bold">S</span>
              <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded border border-white/20 text-[10px] text-white font-bold">D</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Move Avatar</span>
          </div>
        </div>

      </div>
    </div>
  );
}
