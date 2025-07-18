## General Overview
Select a list of AI models to interact with using [Fireworks AI Chat Completions API](https://docs.fireworks.ai/api-reference/post-chatcompletions)!

Technologies Used: React, Tailwind, Next.js

Live URL: https://fireworks-playground-87he.vercel.app/

## Running Locally
- Clone this repository (https://github.com/davidv408/fireworks-playground)
- In the local version, add a .env.local file with the key/value: ```FIREWORKS_API_KEY=<FIREWORKS_API_KEY>```
- Run: ```npm run dev```

## Technical Overview
<img width="1098" height="658" alt="Screenshot 2025-07-17 at 4 29 40 PM" src="https://github.com/user-attachments/assets/1583f43d-cd8b-4467-801a-6cfca829b49b" />

## Technical Details

Upon initialization, the application fetches a list of AI models available for user interaction. The first model in the list is selected by default. Selecting a different model starts a new chat session, effectively resetting the chat history for that context.

Users can type prompts and submit them either by clicking the Submit button to the right of the input field or by pressing the ```Enter``` key.

Submitted prompts and responses from the AI model are streamed in real-time and will be displayed in the [ChatHistory component](https://github.com/davidv408/fireworks-playground/blob/main/src/components/ChatHistory.tsx).

The [ChatHistory component](https://github.com/davidv408/fireworks-playground/blob/main/src/components/ChatHistory.tsx) will parse the AI model's response using a [generator function](https://github.com/davidv408/fireworks-playground/blob/main/src/app/lib/StreamGenerator.ts). The parsed tokens are passed incrementally to the SystemResponseOutput component, providing users with a live, token-by-token view of the model's response.

The [SystemResponseOutput](https://github.com/davidv408/fireworks-playground/blob/main/src/components/SystemResponseOutput.tsx) component is designed to handle special formatting used in AI responses. For example, if the model includes reasoning enclosed within <think>...</think> tags, this component separates and styles that content accordingly. The reasoning is displayed in a distinct container, while the rest of the response appears beneath it.

### Timing Metrics 
Two performance metrics are displayed directly above the input field:

- **Time to First Token (TTFT)** — displayed as ```... ttft``` — measures the latency between when a request is sent and when the first token is received. It is calculated using performance.now() at the moment the request is made and compared against the timestamp of the -first token received.
- **Tokens Per Second (TPS)** — shown to the left of TTFT — is calculated by dividing the total number of tokens received (from completion_tokens in the API response) by the total duration of the response stream.

## Potential Improvements
- Implement session tracking for each model switch, allowing users to return to previous conversations — similar to how browser tabs work.
- Provide UI controls for advanced parameters offered by Fireworks AI, such as max_tokens, temperature, and others, enabling more customizable model behavior.
