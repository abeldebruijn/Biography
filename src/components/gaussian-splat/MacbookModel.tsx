"use client";

import { Html, useGLTF, useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

type MacbookModelProps = {
  url?: string;
};

export function MacbookLoader() {
  const { progress } = useProgress();
  return <Html center>{Math.round(progress)}%</Html>;
}

function LoadedModel({ url }: { url: string }) {
  const gltf = useGLTF(url) as any;
  return <primitive object={gltf.scene} />;
}

export function MacbookModel({
  url = "/assets/macbookpro.glb",
}: MacbookModelProps) {
  const [status, setStatus] = useState<"checking" | "ok" | "missing">(
    "checking",
  );
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    // If the URL points to a binary GLB, skip the JSON preflight check
    if (url.toLowerCase().endsWith(".glb")) {
      setStatus("ok");
      return () => {
        mounted = false;
      };
    }

    async function checkAssets() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("failed to fetch glTF");
        const json = await res.json();
        const uris: string[] = [];
        if (Array.isArray(json.buffers)) {
          for (const b of json.buffers) if (b && b.uri) uris.push(b.uri);
        }
        if (Array.isArray(json.images)) {
          for (const i of json.images) if (i && i.uri) uris.push(i.uri);
        }

        const missingFiles: string[] = [];
        for (const rel of uris) {
          try {
            const abs = new URL(rel, window.location.origin + url).toString();
            const head = await fetch(abs, { method: "HEAD" });
            if (!head.ok) missingFiles.push(rel);
          } catch (e) {
            missingFiles.push(rel);
          }
        }

        if (!mounted) return;
        if (missingFiles.length) {
          setMissing(missingFiles);
          setStatus("missing");
        } else {
          setStatus("ok");
        }
      } catch (e) {
        if (!mounted) return;
        setMissing(["Failed to fetch or parse glTF"]);
        setStatus("missing");
      }
    }
    checkAssets();
    return () => {
      mounted = false;
    };
  }, [url]);

  if (status === "checking") return <Html center>Checking assets…</Html>;
  if (status === "missing")
    return (
      <Html center>
        <div style={{ textAlign: "center", maxWidth: 300 }}>
          <strong>Model missing resources</strong>
          <div>
            The glTF references external files that were not found:
            <ul>
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            Put the referenced files next to <code>{url}</code> or convert to a
            single GLB.
          </div>
        </div>
      </Html>
    );

  return <LoadedModel url={url} />;
}

// Start preloading the macbook model so it's fetched earlier when possible
useGLTF.preload("/assets/macbookpro.glb");

export default MacbookModel;
