import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { FC, Fragment, useEffect, useState } from "react";

interface SystemResponseOutputProps {
  output: string;
}

export const SystemResponseOutput: FC<SystemResponseOutputProps> = ({
  output,
}) => {
  const [think, setThink] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    // Match content inside <think>, including where the closing tag is missing.
    const thinkMatch = output.match(/<think>([\s\S]*?)(?:<\/think>|$)/);
    const thinkContent = thinkMatch ? thinkMatch[1].trim() : "";
    // Captures text after </think> tag or if output does not have <think>, then take all of output
    const outsideThink = output.match(/(?:<\/think>)([\s\S]*?)(?=<think>|$)/);
    const outsideContent = outsideThink ? outsideThink[1].trim(): !output.match(/<think>/) ? output : "";

    setThink(thinkContent);
    setResponse(outsideContent);
  }, [think, response, output]);

  return (
    <Fragment>
      {think.length > 0 && (
        <div className="border-2 mb-4">
          <Disclosure defaultOpen={true}>
            <DisclosureButton className="group flex items-center gap-2 w-full bg-gray-200 p-2">
              Thinking
              <ChevronUpIcon className="w-5 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel>
              <div className="p-2">{think}</div>
            </DisclosurePanel>
          </Disclosure>
        </div>
      )}
      {response.length > 0 && <div>{response}</div>}
    </Fragment>
  );
};
