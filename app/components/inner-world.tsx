/* This experience turns the hidden passage into a four-destination spatial navigation map. */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  SRGBColorSpace,
  Vector2,
  Vector3,
} from "three";
import type { Mesh, MeshBasicMaterial } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type InnerWorldProps = {
  onReturn: () => void;
};

type NodeId = "fitness" | "gaming" | "food" | "travel";

type WorldNode = {
  id: NodeId;
  label: string;
  accent: string;
  position: [number, number, number];
};

const CYAN = "#58f6ff";
const WORLD_NODES: WorldNode[] = [
  { id: "fitness", label: "FITNESS", accent: "#ff5d55", position: [-7, 0, 0] },
  { id: "gaming", label: "GAMING", accent: "#ad72ff", position: [0, 0, -7] },
  { id: "food", label: "FOOD", accent: "#ffad4d", position: [7, 0, 0] },
  { id: "travel", label: "TRAVEL", accent: "#4da3ff", position: [0, 0, 7] },
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function LabelSprite({ color, mobile, text }: { color: string; mobile: boolean; text: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(18, 38);
    context.lineTo(18, 18);
    context.lineTo(86, 18);
    context.moveTo(426, 18);
    context.lineTo(494, 18);
    context.lineTo(494, 38);
    context.stroke();
    context.fillStyle = "#f2fbff";
    context.font = `${mobile ? 700 : 600} ${mobile ? 52 : 34}px "Geist Variable", sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 70);

    const nextTexture = new CanvasTexture(canvas);
    nextTexture.colorSpace = SRGBColorSpace;
    return nextTexture;
  }, [color, mobile, text]);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;
  return (
    <mesh position={[0, 0.035, mobile ? 1.95 : 2.05]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={mobile ? [5, 1.4] : [3.6, 0.9]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

function NodePlatform({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.55, 1.72, 0.16, 6]} />
        <meshStandardMaterial color="#101b24" metalness={0.8} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[1.42, 1.42, 0.08, 6]} />
        <meshStandardMaterial color="#101820" emissive={color} emissiveIntensity={0.72} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[1.18, 1.32, 0.08, 6]} />
        <meshStandardMaterial color="#11181d" metalness={0.75} roughness={0.34} />
      </mesh>
    </group>
  );
}

function FitnessVisual({ accent }: { accent: string }) {
  return (
    <group position={[0, 0.34, 0]}>
      <mesh position={[0, 0.35, 0]} scale={[1.35, 0.18, 0.5]}>
        <boxGeometry />
        <meshStandardMaterial color="#17212a" metalness={0.72} roughness={0.3} />
      </mesh>
      {[-0.72, 0.72].map((x) => (
        <mesh position={[x, 0.9, 0]} scale={[0.1, 1.35, 0.1]} key={x}>
          <boxGeometry />
          <meshStandardMaterial color="#263844" emissive={accent} emissiveIntensity={0.36} />
        </mesh>
      ))}
      <mesh position={[0, 1.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 2.25, 12]} />
        <meshStandardMaterial color="#c4d0d8" metalness={0.92} roughness={0.16} />
      </mesh>
      {[-1.02, -0.86, 0.86, 1.02].map((x) => (
        <mesh position={[x, 1.25, 0]} rotation={[0, 0, Math.PI / 2]} key={x}>
          <cylinderGeometry args={[0.25, 0.25, 0.12, 16]} />
          <meshStandardMaterial color="#10181e" emissive={accent} emissiveIntensity={0.48} />
        </mesh>
      ))}
    </group>
  );
}

function GamingVisual({ accent }: { accent: string }) {
  return (
    <group position={[0, 0.32, 0]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0.88, 0]} rotation={[0, 0, -0.1]} scale={[1.2, 1.7, 0.72]}>
        <boxGeometry />
        <meshStandardMaterial color="#111a22" metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.1, -0.38]} rotation={[-0.12, 0, 0]} scale={[0.92, 0.62, 0.04]}>
        <boxGeometry />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh position={[0, 0.28, -0.62]} rotation={[-0.15, 0, 0]} scale={[0.72, 0.12, 0.32]}>
        <boxGeometry />
        <meshStandardMaterial color="#263843" emissive={accent} emissiveIntensity={0.55} />
      </mesh>
      {[-0.22, 0.22].map((x) => (
        <mesh position={[x, 0.44, -0.79]} key={x}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#eafcff" />
        </mesh>
      ))}
    </group>
  );
}

function FoodVisual({ accent }: { accent: string }) {
  return (
    <group position={[0, 0.3, 0]}>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[1.12, 1.12, 0.14, 24]} />
        <meshStandardMaterial color="#1a252c" metalness={0.68} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 0.76, 16]} />
        <meshStandardMaterial color="#26343d" metalness={0.8} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.88, 0]} scale={[1, 0.18, 1]}>
        <sphereGeometry args={[0.7, 24, 16]} />
        <meshStandardMaterial color="#111b21" emissive={accent} emissiveIntensity={0.24} />
      </mesh>
      <mesh position={[0, 1.04, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#f8fbf5" />
      </mesh>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle) => (
        <mesh position={[Math.cos(angle) * 0.78, 0.81, Math.sin(angle) * 0.78]} key={angle}>
          <cylinderGeometry args={[0.2, 0.2, 0.035, 18]} />
          <meshStandardMaterial color="#dce8ed" emissive={accent} emissiveIntensity={0.24} />
        </mesh>
      ))}
    </group>
  );
}

function TravelVisual({ accent }: { accent: string }) {
  return (
    <group position={[0, 0.32, 0]}>
      <mesh position={[-0.42, 0.72, 0]} scale={[0.92, 1.25, 0.48]}>
        <boxGeometry />
        <meshStandardMaterial color="#131e26" emissive={accent} emissiveIntensity={0.32} metalness={0.66} />
      </mesh>
      <mesh position={[-0.42, 1.45, 0]}>
        <torusGeometry args={[0.24, 0.055, 8, 18, Math.PI]} />
        <meshStandardMaterial color="#c7d4db" metalness={0.86} roughness={0.2} />
      </mesh>
      <mesh position={[0.62, 0.72, 0]} scale={[0.08, 1.42, 0.08]}>
        <boxGeometry />
        <meshStandardMaterial color="#d4e1e7" metalness={0.72} />
      </mesh>
      <mesh position={[0.82, 1.15, 0]} rotation={[0, 0, -0.12]} scale={[0.72, 0.24, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color="#17232b" emissive={accent} emissiveIntensity={0.72} />
      </mesh>
      <mesh position={[0.44, 0.76, 0]} rotation={[0, 0, 0.12]} scale={[0.58, 0.21, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color="#17232b" emissive={accent} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function NodeVisual({ id, accent }: { id: NodeId; accent: string }) {
  if (id === "fitness") return <FitnessVisual accent={accent} />;
  if (id === "gaming") return <GamingVisual accent={accent} />;
  if (id === "food") return <FoodVisual accent={accent} />;
  return <TravelVisual accent={accent} />;
}

function DestinationNode({
  node,
  focused,
  mobile,
  onSelect,
}: {
  node: WorldNode;
  focused: boolean;
  mobile: boolean;
  onSelect: (id: NodeId) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const color = focused ? node.accent : CYAN;

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  return (
    <group position={node.position}>
      <NodePlatform color={color} />
      <NodeVisual id={node.id} accent={color} />
      <LabelSprite color={color} mobile={mobile} text={node.label} />
      <mesh
        position={[0, 1, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[5.2, 3.2, 5.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CentralChip() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.2, 0.18, 2.2]} />
        <meshStandardMaterial color="#17242c" emissive={CYAN} emissiveIntensity={0.62} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.65, 0.28, 1.65]} />
        <meshStandardMaterial color="#05090c" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[1.3, 0.16, 1.3]} />
        <meshStandardMaterial color="#94e8ee" emissive={CYAN} emissiveIntensity={0.84} />
      </mesh>
      {[-0.88, -0.58, 0.58, 0.88].map((offset) => (
        <group key={offset}>
          <mesh position={[offset, 0.08, 1.22]} scale={[0.16, 0.05, 0.5]}>
            <boxGeometry />
            <meshBasicMaterial color={CYAN} />
          </mesh>
          <mesh position={[offset, 0.08, -1.22]} scale={[0.16, 0.05, 0.5]}>
            <boxGeometry />
            <meshBasicMaterial color={CYAN} />
          </mesh>
          <mesh position={[1.22, 0.08, offset]} scale={[0.5, 0.05, 0.16]}>
            <boxGeometry />
            <meshBasicMaterial color={CYAN} />
          </mesh>
          <mesh position={[-1.22, 0.08, offset]} scale={[0.5, 0.05, 0.16]}>
            <boxGeometry />
            <meshBasicMaterial color={CYAN} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ConnectionPath({ position }: { position: [number, number, number] }) {
  const [x, , z] = position;
  const length = Math.hypot(x, z) - 2.5;
  const angle = -Math.atan2(z, x);
  return (
    <mesh position={[x * 0.5, 0.03, z * 0.5]} rotation={[0, angle, 0]}>
      <boxGeometry args={[length, 0.025, 0.055]} />
      <meshBasicMaterial color={CYAN} transparent opacity={0.72} />
    </mesh>
  );
}

function GridDots() {
  const positions = useMemo(() => {
    const values: number[] = [];
    for (let x = -22; x <= 22; x += 2) {
      for (let z = -22; z <= 22; z += 2) values.push(x, -0.015, z);
    }
    return new Float32Array(values);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9dcbd5" size={0.045} transparent opacity={0.82} sizeAttenuation />
    </points>
  );
}

function EnergyWave({ node }: { node: WorldNode }) {
  const shell = useRef<Mesh>(null);
  const material = useRef<MeshBasicMaterial>(null);

  useEffect(() => {
    if (!shell.current || !material.current) return;
    const shellTween = gsap.fromTo(shell.current.scale, { x: 0.08, y: 0.08, z: 0.08 }, { x: 7, y: 7, z: 7, duration: 0.82, ease: "power3.out" });
    const materialTween = gsap.fromTo(material.current, { opacity: 0.68 }, { opacity: 0, duration: 0.82, ease: "power2.out" });
    return () => {
      shellTween.kill();
      materialTween.kill();
    };
  }, []);

  return (
    <mesh ref={shell} position={node.position}>
      <sphereGeometry args={[1, 48, 32]} />
      <meshBasicMaterial
        ref={material}
        color={node.accent}
        transparent
        opacity={0}
        side={BackSide}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

function CameraRig({
  focusedNode,
  mobile,
  reducedMotion,
}: {
  focusedNode: WorldNode | null;
  mobile: boolean;
  reducedMotion: boolean;
}) {
  const { camera, pointer } = useThree();
  const overview = useMemo(
    () => (mobile ? new Vector3(30, 34, 30) : new Vector3(15, 18, 15)),
    [mobile],
  );
  const position = useRef(overview.clone());
  const target = useRef(new Vector3());
  const desired = useMemo(() => new Vector3(), []);
  const parallax = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const nextTarget = focusedNode
      ? new Vector3(...focusedNode.position).add(new Vector3(0, 0.65, 0))
      : new Vector3();
    const nextPosition = focusedNode
      ? new Vector3(...focusedNode.position).add(mobile ? new Vector3(8, 7, 8) : new Vector3(4.6, 4.2, 4.6))
      : overview;

    if (reducedMotion) {
      position.current.copy(nextPosition);
      target.current.copy(nextTarget);
      camera.position.copy(nextPosition);
      camera.lookAt(nextTarget);
      return;
    }

    const positionTween = gsap.to(position.current, {
      x: nextPosition.x,
      y: nextPosition.y,
      z: nextPosition.z,
      duration: 1.15,
      ease: "power3.inOut",
    });
    const targetTween = gsap.to(target.current, {
      x: nextTarget.x,
      y: nextTarget.y,
      z: nextTarget.z,
      duration: 1.05,
      ease: "power3.inOut",
    });
    return () => {
      positionTween.kill();
      targetTween.kill();
    };
  }, [camera, focusedNode, mobile, overview, reducedMotion]);

  useFrame((_, delta) => {
    const parallaxX = !mobile && !focusedNode && !reducedMotion ? pointer.x * 0.55 : 0;
    const parallaxY = !mobile && !focusedNode && !reducedMotion ? pointer.y * 0.35 : 0;
    parallax.set(parallaxX, parallaxY, -parallaxX);
    desired.copy(position.current).add(parallax);
    camera.position.lerp(desired, 1 - Math.exp(-delta * 5));
    camera.lookAt(target.current);
  });

  return null;
}

function Bloom() {
  const { camera, gl, scene, size } = useThree();
  const composer = useMemo(() => {
    const nextComposer = new EffectComposer(gl);
    nextComposer.addPass(new RenderPass(scene, camera));
    nextComposer.addPass(new UnrealBloomPass(new Vector2(1, 1), 0.42, 0.18, 0.88));
    return nextComposer;
  }, [camera, gl, scene]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size]);

  useEffect(() => () => composer.dispose(), [composer]);
  useFrame(() => composer.render(), 1);
  return null;
}

function WorldScene({
  focused,
  mobile,
  reducedMotion,
  onSelect,
}: {
  focused: NodeId | null;
  mobile: boolean;
  reducedMotion: boolean;
  onSelect: (id: NodeId) => void;
}) {
  const sceneNodes = useMemo(
    () =>
      mobile
        ? WORLD_NODES.map((node) => ({
            ...node,
            position: [node.position[0] * 0.7, node.position[1], node.position[2] * 0.7] as [number, number, number],
          }))
        : WORLD_NODES,
    [mobile],
  );
  const focusedNode = sceneNodes.find((node) => node.id === focused) ?? null;

  return (
    <>
      <color attach="background" args={["#03070a"]} />
      <fog attach="fog" args={mobile ? ["#03070a", 42, 88] : ["#03070a", 28, 56]} />
      <ambientLight intensity={0.62} />
      <directionalLight position={[6, 14, 8]} intensity={1.25} color="#cfefff" />
      <pointLight position={[0, 3.5, 0]} intensity={18} distance={16} color={CYAN} />
      <CameraRig focusedNode={focusedNode} mobile={mobile} reducedMotion={reducedMotion} />
      {!mobile && <Bloom />}

      <group>
        <gridHelper args={[44, 44, "#2d5260", "#13232c"]} position={[0, -0.03, 0]} />
        <GridDots />
        <CentralChip />
        {sceneNodes.map((node) => (
          <ConnectionPath position={node.position} key={`path-${node.id}`} />
        ))}
        {sceneNodes.map((node) => (
          <DestinationNode
            focused={focused === node.id}
            mobile={mobile}
            node={node}
            onSelect={onSelect}
            key={node.id}
          />
        ))}
        {focusedNode && !reducedMotion && <EnergyWave node={focusedNode} key={focusedNode.id} />}
      </group>
    </>
  );
}

export function InnerWorld({ onReturn }: InnerWorldProps) {
  const [focused, setFocused] = useState<NodeId | null>(null);
  const [exiting, setExiting] = useState(false);
  const mobile = useMediaQuery("(max-width: 700px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const focusedNode = WORLD_NODES.find((node) => node.id === focused) ?? null;

  function exit() {
    if (focused) {
      setFocused(null);
      return;
    }
    if (reducedMotion) {
      onReturn();
      return;
    }
    setExiting(true);
    window.setTimeout(onReturn, 320);
  }

  return (
    <main className={`inner-world${exiting ? " inner-world--exiting" : ""}`}>
      <Canvas
        camera={{ fov: mobile ? 38 : 28, near: 0.1, far: 100, position: mobile ? [30, 34, 30] : [15, 18, 15] }}
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: !mobile, powerPreference: "high-performance", stencil: true }}
      >
        <WorldScene focused={focused} mobile={mobile} reducedMotion={reducedMotion} onSelect={setFocused} />
      </Canvas>

      {focusedNode && (
        <h1 className="inner-world-title" aria-live="polite">
          {focusedNode.label}
        </h1>
      )}
      <button className="inner-world-exit" type="button" onClick={exit}>
        EXIT
      </button>

      <nav className="inner-world-accessibility-nav" aria-label="Inner world destinations">
        {WORLD_NODES.map((node) => (
          <button type="button" onClick={() => setFocused(node.id)} key={node.id}>
            {node.label}
          </button>
        ))}
      </nav>
    </main>
  );
}
