import { Canvas } from "@/components/canvas";
import { Scene } from "@/components/gaussian-splat/Scene";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="min-h-screen w-full">
        <header className="bg-blue-900 h-screen">
          <Canvas gl={{ antialias: false }}>
            <Scene />
          </Canvas>

          <h1 className="absolute top-10 left-10 text-7xl text-orange-600">
            Abel de Bruijn
          </h1>

          <div className="absolute right-10 bottom-10 text-orange-600 text-xl">
            {/* <GyroscopeDebug /> */}
          </div>
        </header>
      </main>
    </div>
  );
}
