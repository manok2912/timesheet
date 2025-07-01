export async function GET(request) {
  return new Response(
    JSON.stringify({ message: "Hello from Route Handler!" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
