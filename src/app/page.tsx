"use client";

import { ChatHistory } from "@/components/ChatHistory";
import { Loading } from "@/components/Loading";
import { ModelSelector } from "@/components/ModelSelector";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function Home() {
  const [init, setInit] = useState(true);
  const [disableUI, setDisableUI] = useState(false);
  const [models, setModels] = useState<Array<Model>>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => {
        setSelectedModel(data[0]);
        setModels(data);
      })
      .catch(() => {
        router.push("/500");
      })
      .finally(() => setInit(false));
  }, [router]);

  return (
    <Fragment>
      {(init || disableUI) && <Loading></Loading>}
      {!init && selectedModel && (
        <div
          className={`h-full flex flex-col items-center ${disableUI ? "opacity-50 pointer-events-none select-none" : ""}`}
        >
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          ></ModelSelector>
          <ChatHistory
            key={selectedModel.name}
            selectedModel={selectedModel}
            setDisableUI={setDisableUI}
          ></ChatHistory>
        </div>
      )}
    </Fragment>
  );
}
