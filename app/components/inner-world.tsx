/* This experience integrates Astra's tabletop world with accessible spatial navigation. */
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import {
  AnimationMixer,
  LoopOnce,
  LoopRepeat,
  MathUtils,
  Raycaster,
  Vector3,
} from "three";
import type { AnimationAction, Group, Intersection, Mesh, Object3D, OrthographicCamera } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { buildDestinationCurve, buildRadialJourney } from "../lib/inner-world-motion";
import type { QuadraticJourneySegment } from "../lib/inner-world-motion";

type InnerWorldProps = {
  onReturn: () => void;
};

type NodeId = "fitness" | "gaming" | "food" | "travel";
type JourneyPhase = "overview" | "turning" | "walking" | "arrived";

type WorldNode = {
  id: NodeId;
  label: string;
  position: readonly [number, number, number];
};

type WorldMotion = {
  position: Vector3;
  forward: Vector3;
  phase: JourneyPhase;
};

type ActiveSegment = {
  start: Vector3;
  control: Vector3;
  end: Vector3;
  length: number;
  progress: number;
};

const OVERVIEW_POSITION = new Vector3(18, 18, 24);
const PORTRAIT_OVERVIEW_POSITION = new Vector3(10.4, 28, 13.4);
const OVERVIEW_TARGET = new Vector3(0, -1, 0);
const WORLD_UP = new Vector3(0, 1, 0);
const WORLD_DOWN = new Vector3(0, -1, 0);
const WORLD_NODES: WorldNode[] = [
  { id: "fitness", label: "FITNESS", position: [-7, 0, 0] },
  { id: "gaming", label: "GAMING", position: [0, 0, -7] },
  { id: "food", label: "FOOD", position: [0, 0, 7] },
  { id: "travel", label: "TRAVEL", position: [7, 0, 0] },
];
const DIRECTION_CONTRACT = `Intent: Make the hidden world a four-way spatial portrait, not a conventional portfolio menu.
Vibe: Bright afternoon, colorful low-poly tabletop adventure, playful but calm.
Canonical source: Astra GLBs and approved composition A; seed=5a79e36b.
Layout: One compass island, avatar at center, fitness upper-left, gaming upper-right, food lower-left, travel lower-right.
Responsive: Preserve the full island, readable corner controls, touch targets, keyboard navigation, and reduced-motion direct travel.
Direction approved and ready to build.`;

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

class AssetBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}

function configureShadows(scene: Object3D) {
  scene.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (mesh.name === "WalkableSurface" || materials.some((material) => material.name === "Collider")) {
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      return;
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
}

function StaticModel({ url }: { url: string }) {
  const { scene } = useLoader(GLTFLoader, url);

  useEffect(() => configureShadows(scene), [scene]);
  return <primitive object={scene} dispose={null} />;
}

function ModelAsset({ url }: { url: string }) {
  return (
    <AssetBoundary>
      <Suspense fallback={null}>
        <StaticModel url={url} />
      </Suspense>
    </AssetBoundary>
  );
}

function WorldModel({ colliderRef }: { colliderRef: RefObject<Object3D | null> }) {
  const { scene } = useLoader(GLTFLoader, "/portfolio/inner-world/world.glb");

  useEffect(() => {
    configureShadows(scene);
    const surface = scene.getObjectByName("WalkableSurface") ?? null;
    if (surface) {
      surface.castShadow = false;
      surface.receiveShadow = false;
      surface.updateWorldMatrix(true, false);
      surface.visible = false;
    }
    colliderRef.current = surface;
    return () => {
      if (colliderRef.current === surface) colliderRef.current = null;
    };
  }, [colliderRef, scene]);

  return <primitive object={scene} dispose={null} />;
}

function WorldAsset({ colliderRef }: { colliderRef: RefObject<Object3D | null> }) {
  return (
    <AssetBoundary>
      <Suspense fallback={null}>
        <WorldModel colliderRef={colliderRef} />
      </Suspense>
    </AssetBoundary>
  );
}

function AvatarModel({ motion }: { motion: RefObject<WorldMotion> }) {
  const { animations, scene } = useLoader(GLTFLoader, "/portfolio/inner-world/avatar.glb");
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const actions = useMemo(
    () => new Map(animations.map((clip) => [clip.name, mixer.clipAction(clip)])),
    [animations, mixer],
  );
  const currentAction = useRef<AnimationAction>(null);
  const currentPhase = useRef<JourneyPhase>("overview");
  const arrivalFinished = useRef(false);

  useEffect(() => {
    configureShadows(scene);
    const finishArrival = ({ action }: { action: AnimationAction }) => {
      if (action === actions.get("Arrive")) arrivalFinished.current = true;
    };
    mixer.addEventListener("finished", finishArrival);
    return () => {
      mixer.removeEventListener("finished", finishArrival);
      mixer.stopAllAction();
    };
  }, [actions, mixer, scene]);

  useFrame((_, delta) => {
    mixer.update(delta);
    const phase = motion.current?.phase ?? "overview";
    if (phase !== currentPhase.current) {
      currentPhase.current = phase;
      arrivalFinished.current = false;
    }

    const clipName = phase === "walking"
      ? "Walk"
      : phase === "arrived" && !arrivalFinished.current
        ? "Arrive"
        : "Idle";
    const nextAction = actions.get(clipName);
    if (!nextAction || currentAction.current === nextAction) return;

    currentAction.current?.fadeOut(0.15);
    nextAction.reset().fadeIn(0.15);
    nextAction.clampWhenFinished = clipName === "Arrive";
    nextAction.setLoop(clipName === "Arrive" ? LoopOnce : LoopRepeat, clipName === "Arrive" ? 1 : Infinity);
    nextAction.play();
    currentAction.current = nextAction;
  });

  return <primitive object={scene} dispose={null} />;
}

function segmentLength(segment: ActiveSegment) {
  const point = new Vector3().copy(segment.start);
  const next = new Vector3();
  let length = 0;
  for (let step = 1; step <= 12; step += 1) {
    const t = step / 12;
    const inverse = 1 - t;
    next.set(
      inverse * inverse * segment.start.x + 2 * inverse * t * segment.control.x + t * t * segment.end.x,
      0,
      inverse * inverse * segment.start.z + 2 * inverse * t * segment.control.z + t * t * segment.end.z,
    );
    length += point.distanceTo(next);
    point.copy(next);
  }
  return length;
}

function activateSegment(segment: QuadraticJourneySegment): ActiveSegment {
  const active = {
    start: new Vector3(segment.start[0], 0, segment.start[1]),
    control: new Vector3(segment.control[0], 0, segment.control[1]),
    end: new Vector3(segment.end[0], 0, segment.end[1]),
    length: 0,
    progress: 0,
  };
  active.length = segmentLength(active);
  return active;
}

function AvatarNavigator({
  colliderRef,
  focusedNode,
  reducedMotion,
}: {
  colliderRef: RefObject<Object3D | null>;
  focusedNode: WorldNode | null;
  reducedMotion: boolean;
}) {
  const avatar = useRef<Group>(null);
  const motion = useRef<WorldMotion>({
    position: new Vector3(),
    forward: new Vector3(0, 0, 1),
    phase: "overview",
  });
  const route = useRef<ActiveSegment[]>([]);
  const routeEndPhase = useRef<"arrived" | "overview">("overview");
  const yaw = useRef(0);
  const nextPosition = useMemo(() => new Vector3(), []);
  const tangent = useMemo(() => new Vector3(), []);
  const rayOrigin = useMemo(() => new Vector3(), []);
  const raycaster = useMemo(() => new Raycaster(), []);
  const groundHits = useRef<Intersection<Object3D>[]>([]);

  useEffect(() => {
    const state = motion.current;
    const destination: readonly [number, number] = focusedNode
      ? [focusedNode.position[0], focusedNode.position[2]]
      : [0, 0];
    routeEndPhase.current = focusedNode ? "arrived" : "overview";

    if (reducedMotion) {
      const end = focusedNode ? buildDestinationCurve(destination).end : destination;
      route.current = [];
      state.position.set(end[0], state.position.y, end[1]);
      state.forward.set(focusedNode?.position[0] ?? 0, 0, focusedNode?.position[2] ?? 1).normalize();
      yaw.current = Math.atan2(state.forward.x, state.forward.z);
      state.phase = routeEndPhase.current;
      return;
    }

    route.current = buildRadialJourney(
      [state.position.x, state.position.z],
      destination,
    ).map(activateSegment);
    state.phase = route.current.length ? "turning" : routeEndPhase.current;
  }, [focusedNode, reducedMotion]);

  useFrame((_, delta) => {
    const state = motion.current;
    const group = avatar.current;
    if (!group) return;

    const segment = route.current[0];
    if (segment) {
      const t = segment.progress;
      tangent.copy(segment.control).sub(segment.start).multiplyScalar(2 * (1 - t));
      tangent.addScaledVector(nextPosition.copy(segment.end).sub(segment.control), 2 * t).normalize();
      const desiredYaw = Math.atan2(tangent.x, tangent.z);
      const yawDelta = Math.atan2(Math.sin(desiredYaw - yaw.current), Math.cos(desiredYaw - yaw.current));
      yaw.current += Math.min(Math.abs(yawDelta), delta * 6.5) * Math.sign(yawDelta);
      state.forward.set(Math.sin(yaw.current), 0, Math.cos(yaw.current));

      if (Math.abs(yawDelta) > 0.12) {
        state.phase = "turning";
      } else {
        state.phase = "walking";
        segment.progress = Math.min(1, segment.progress + delta * 3.15 / segment.length);
        const inverse = 1 - segment.progress;
        state.position.set(
          inverse * inverse * segment.start.x + 2 * inverse * segment.progress * segment.control.x + segment.progress * segment.progress * segment.end.x,
          state.position.y,
          inverse * inverse * segment.start.z + 2 * inverse * segment.progress * segment.control.z + segment.progress * segment.progress * segment.end.z,
        );
        if (segment.progress === 1) {
          route.current.shift();
          state.phase = route.current.length ? "turning" : routeEndPhase.current;
        }
      }
    }

    const surface = colliderRef.current;
    if (surface) {
      groundHits.current.length = 0;
      raycaster.set(rayOrigin.set(state.position.x, 10, state.position.z), WORLD_DOWN);
      raycaster.intersectObject(surface, false, groundHits.current);
      const groundY = groundHits.current[0]?.point.y;
      if (groundY !== undefined && Number.isFinite(groundY)) state.position.y = groundY;
    }

    group.position.copy(state.position);
    group.rotation.y = yaw.current;
  });

  return (
    <>
      <group ref={avatar}>
        <AssetBoundary>
          <Suspense fallback={null}>
            <AvatarModel motion={motion} />
          </Suspense>
        </AssetBoundary>
      </group>
      <CameraRig focusedNode={focusedNode} motion={motion} reducedMotion={reducedMotion} />
    </>
  );
}

function CameraRig({
  focusedNode,
  motion,
  reducedMotion,
}: {
  focusedNode: WorldNode | null;
  motion: RefObject<WorldMotion>;
  reducedMotion: boolean;
}) {
  const position = useRef(OVERVIEW_POSITION.clone());
  const target = useRef(OVERVIEW_TARGET.clone());
  const desiredPosition = useMemo(() => new Vector3(), []);
  const desiredTarget = useMemo(() => new Vector3(), []);
  const nodePosition = useMemo(() => new Vector3(), []);
  const inward = useMemo(() => new Vector3(), []);
  const right = useMemo(() => new Vector3(), []);
  const zoom = useRef(1);
  const initialized = useRef(false);

  useFrame(({ camera, size }, delta) => {
    const orthographicCamera = camera as OrthographicCamera;
    const state = motion.current;
    const usePortraitOverview = size.width <= 520;
    let targetZoom = usePortraitOverview ? size.width / 22 : size.height / 28;

    if (!focusedNode || !state || state.phase === "turning") {
      desiredPosition.copy(usePortraitOverview ? PORTRAIT_OVERVIEW_POSITION : OVERVIEW_POSITION);
      desiredTarget.copy(OVERVIEW_TARGET);
    } else if (state.phase === "arrived") {
      nodePosition.set(...focusedNode.position);
      inward.set(-nodePosition.x, 0, -nodePosition.z).normalize().applyAxisAngle(WORLD_UP, Math.PI * 25 / 180);
      desiredPosition.copy(nodePosition).addScaledVector(inward, 6).setY(state.position.y + 5.6);
      desiredTarget.copy(nodePosition).setY(state.position.y + 1.75);
      targetZoom = Math.max(size.width / 9.2, size.height / 10.5);
    } else {
      right.set(state.forward.z, 0, -state.forward.x);
      desiredPosition.copy(state.position)
        .addScaledVector(state.forward, -6)
        .addScaledVector(right, 2.2)
        .setY(state.position.y + 5.8);
      desiredTarget.copy(state.position).addScaledVector(state.forward, 1.5).setY(state.position.y + 1.7);
      targetZoom = size.width / 12;
    }

    if (!initialized.current) {
      position.current.copy(desiredPosition);
      target.current.copy(desiredTarget);
      zoom.current = targetZoom;
      initialized.current = true;
    }

    const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * (state?.phase === "arrived" ? 3.2 : 2.4));
    position.current.lerp(desiredPosition, blend);
    target.current.lerp(desiredTarget, blend);
    zoom.current = MathUtils.lerp(zoom.current, targetZoom, blend);
    orthographicCamera.position.copy(position.current);
    orthographicCamera.zoom = zoom.current;
    orthographicCamera.updateProjectionMatrix();
    orthographicCamera.lookAt(target.current);
  });

  return null;
}

function DestinationAsset({ node, onSelect }: { node: WorldNode; onSelect: (id: NodeId) => void }) {
  return (
    <group position={node.position}>
      <ModelAsset url={`/portfolio/inner-world/${node.id}.glb`} />
      <mesh
        position={[0, 1.4, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
      >
        <boxGeometry args={[3.8, 3, 3.8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function WorldScene({
  focused,
  reducedMotion,
  onSelect,
}: {
  focused: NodeId | null;
  reducedMotion: boolean;
  onSelect: (id: NodeId) => void;
}) {
  const focusedNode = WORLD_NODES.find((node) => node.id === focused) ?? null;
  const colliderRef = useRef<Object3D | null>(null);

  return (
    <>
      <color attach="background" args={["#35afe6"]} />
      <fog attach="fog" args={["#35afe6", 48, 86]} />
      <hemisphereLight args={["#f7fbff", "#6f814d", 2.4]} />
      <directionalLight
        castShadow
        color="#fff0d3"
        intensity={3.2}
        position={[-5, 17, 9]}
        shadow-camera-bottom={-32}
        shadow-camera-far={80}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={32}
        shadow-mapSize={[4096, 4096]}
        shadow-normalBias={0.04}
      />
      <WorldAsset colliderRef={colliderRef} />
      {WORLD_NODES.map((node) => (
        <DestinationAsset node={node} onSelect={onSelect} key={node.id} />
      ))}
      <AvatarNavigator colliderRef={colliderRef} focusedNode={focusedNode} reducedMotion={reducedMotion} />
    </>
  );
}

export function InnerWorld({ onReturn }: InnerWorldProps) {
  const [focused, setFocused] = useState<NodeId | null>(null);
  const [exiting, setExiting] = useState(false);
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
      <template dangerouslySetInnerHTML={{ __html: `<!--\n${DIRECTION_CONTRACT}\n-->` }} />
      <Canvas
        flat
        orthographic
        shadows="percentage"
        camera={{ near: 0.1, far: 100, position: OVERVIEW_POSITION }}
        dpr={[1.5, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <WorldScene focused={focused} reducedMotion={reducedMotion} onSelect={setFocused} />
      </Canvas>

      <p className="sr-only" aria-live="polite">
        {focusedNode ? `${focusedNode.label} selected` : "Inner world overview"}
      </p>
      <button
        aria-label={focused ? "Return to overview" : "Exit inner world"}
        className="inner-world-exit"
        type="button"
        onClick={exit}
      >
        <img
          alt=""
          draggable={false}
          src="/portfolio/inner-world/ui/exit-sign.png"
        />
      </button>

      <nav className="inner-world-accessibility-nav" aria-label="Inner world destinations">
        {WORLD_NODES.map((node) => (
          <button
            aria-label={node.label}
            aria-pressed={focused === node.id}
            className={`inner-world-node-label inner-world-node-label--${node.id}`}
            type="button"
            onClick={() => setFocused(node.id)}
            key={node.id}
          />
        ))}
      </nav>
    </main>
  );
}
