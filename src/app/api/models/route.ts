export async function GET() {
  const res = await fetch(
    "https://app.fireworks.ai/api/models/mini-playground",
  );
  const data: Array<ApiResponeModel> = await res.json();
  const transformed = data
    .filter((e) => e.serverless)
    .map((e) => ({
      title: e.title,
      name: e.name,
    }));

  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.text();

  const res = await fetch(
    "https://api.fireworks.ai/inference/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body,
    },
  );

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
    },
  });
}
