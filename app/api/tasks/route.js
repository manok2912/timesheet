import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "tasks.json");

export async function GET() {
  const data = await fs.readFile(filePath, "utf8");
  return new Response(data, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Missing id in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const fileData = await fs.readFile(filePath, "utf8");
    const tasks = JSON.parse(fileData);

    const index = tasks.findIndex((task) => task.id === id);

    if (index !== -1) {
      // Update existing
      tasks[index] = body;
    } else {
      // Add new
      tasks.push(body);
    }

    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));

    return new Response(JSON.stringify(tasks), {
      status: index !== -1 ? 200 : 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error("Update error:", err);

    return new Response(JSON.stringify({ error: "Failed to update task" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request) {
  const body = await request.json();
  const data = await fs.readFile(filePath, "utf8");
  const tasks = JSON.parse(data);

  await fs.writeFile(filePath, JSON.stringify(body, null, 2));
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const data = await fs.readFile(filePath, "utf8");
  const tasks = JSON.parse(data);
  const filtered = tasks.filter((t) => t.id !== id);
  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));

  return new Response(null, { status: 204 });
}
