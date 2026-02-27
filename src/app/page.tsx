import { BackgroundScene } from "@/components/home/background-scene";
import { Contact } from "./Contact";
import { CV } from "./CV";
import Posts from "./Posts";
import Projects from "./Projects";

export default function Home() {
  return (
    <>
      <BackgroundScene />

      <div className="w-full absolute bottom-0 h-10 bg-linear-to-b from-background/0 to-background z-10" />

      <main className="relative z-10 flex w-full flex-col items-center px-2 pb-24 sm:px-6 lg:px-10">
        <CV />

        <Contact />

        <Projects />

        <Posts />
      </main>
    </>
  );
}
