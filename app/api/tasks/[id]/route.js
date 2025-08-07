import { readTasksFile, writeTasksFile } from '../../utils';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updatedTask = await request.json();
    
    // Validate the request body
    if (!updatedTask || !updatedTask.project) {
      return new Response(
        JSON.stringify({ message: "Invalid request body" }), 
        { status: 400 }
      );
    }

    const tasks = await readTasksFile();
    
    // Find task by project name (case insensitive)
    const taskIndex = tasks.findIndex(task => 
      task.project.toLowerCase() === updatedTask.project.toLowerCase()
    );
    
    if (taskIndex === -1) {
      return new Response(
        JSON.stringify({ message: "Task not found" }), 
        { status: 404 }
      );
    }

    // Merge timelines instead of replacing
    const mergedTimeline = {
      ...tasks[taskIndex].timeline,
      ...updatedTask.timeline
    };

    // Update the task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      timeline: mergedTimeline,
      updatedAt: new Date().toISOString()
    };

    await writeTasksFile(tasks);

    return new Response(
      JSON.stringify(tasks[taskIndex]),
      { status: 200 }
    );

  } catch (error) {
    console.error("PUT error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update task: " + error.message }),
      { status: 500 }
    );
  }
}