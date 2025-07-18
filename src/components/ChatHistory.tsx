"use client";
import {
  ArrowRightCircleIcon,
  ComputerDesktopIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { FC, Fragment, useState } from "react";
import { ChatResponse } from "./ChatResponse";
import { queryModel } from "@/app/lib/api";
import { StreamGenerator } from "@/app/lib/StreamGenerator";
import { SystemResponseOutput } from "./SystemResponseOutput";

interface ChatHistoryProps {
  selectedModel: Model;
  setDisableUI: (val: boolean) => void;
}

interface ChatHistoryResponse {
  type: "user" | "system";
  timestamp: Date;
  output: string;
}

export const ChatHistory: FC<ChatHistoryProps> = ({
  selectedModel,
  setDisableUI,
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<ChatHistoryResponse>>(
    [],
  );
  const [timeToFirstToken, setTimeToFirstToken] = useState<number | null>(null);
  const [tokensPerSecond, setTokensPerSecond] = useState<number | null>(null);

  const onSubmit = async () => {
    try {
      // Add users input to chat history.
      setChatHistory((chatHistory) => [
        ...chatHistory,
        { type: "user", timestamp: new Date(), output: prompt },
      ]);
      // Set state for before querying.
      setDisableUI(true);
      setTimeToFirstToken(null);
      setTokensPerSecond(null);
      const start = performance.now();

      // Query model.
      const reader = await queryModel(selectedModel.name, prompt);
      setDisableUI(false);

      // Initialize an empty chat response from the system.
      setChatHistory((chatHistory) => [
        ...chatHistory,
        { type: "system", timestamp: new Date(), output: "" },
      ]);
      let index = 0;
      for await (const { deltaContent, completionTokens } of StreamGenerator(
        reader,
      )) {
        // Set time to first token.
        if (index === 0) {
          setTimeToFirstToken(performance.now() - start);
        }
        // Set tokens per second.
        if (completionTokens) {
          setTokensPerSecond(
            Math.floor(completionTokens / ((performance.now() - start) / 1000)),
          );
        }
        // Update the chat response from the system.
        if (deltaContent) {
          setChatHistory((chatHistory) => {
            const last = chatHistory[chatHistory.length - 1];
            const updated = {
              ...last,
              output: last.output.concat(deltaContent),
            };
            return [...chatHistory.slice(0, -1), updated];
          });
        }
        index++;
      }
    } catch (error) {
      setChatHistory((chatHistory) => [
        ...chatHistory,
        {
          type: "system",
          timestamp: new Date(),
          output: `Oops! It looks like something went wrong: ${error}`,
        },
      ]);
    } finally {
      setDisableUI(false);
      setPrompt("");
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-5">
      <div className="flex-grow-1">
        {chatHistory.map((e, i) => {
          return (
            <Fragment key={i}>
              {e.type === "user" && (
                <ChatResponse
                  className="flex-row-reverse text-right"
                  icon={<UserIcon></UserIcon>}
                  timestamp={e.timestamp}
                >
                  <div>{e.output}</div>
                </ChatResponse>
              )}
              {e.type === "system" && (
                <ChatResponse
                  icon={<ComputerDesktopIcon></ComputerDesktopIcon>}
                  timestamp={e.timestamp}
                >
                  <SystemResponseOutput
                    output={e.output}
                  ></SystemResponseOutput>
                </ChatResponse>
              )}
            </Fragment>
          );
        })}
      </div>
      <form className="flex flex-col sticky bottom-[0.5rem] bg-white">
        <div className="ml-auto">
          {tokensPerSecond !== null && (
            <span className="text-sm">{tokensPerSecond} tokens/s,&nbsp;</span>
          )}
          {timeToFirstToken !== null && (
            <span className="text-sm">
              {timeToFirstToken.toFixed(2)}ms ttft
            </span>
          )}
        </div>
        <div className="relative w-full">
          <textarea
            id="message"
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && prompt.trim().length > 0) {
                event.preventDefault();
                onSubmit();
              }
            }}
            className="pr-16 block p-2.5 w-full resize-none text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
          <button
            type="button"
            disabled={prompt.trim().length === 0}
            className={`absolute right-4 top-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full w-[30px] h-[30px] ${prompt.trim().length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              onSubmit();
            }}
          >
            <ArrowRightCircleIcon className="w-[30px] h-[30px]" />
          </button>
        </div>
      </form>
    </div>
  );
};
