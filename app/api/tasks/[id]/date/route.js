import { readTasksFile, writeTasksFile } from '../../../utils';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { date } = await request.json();
    
    // Validate inputs
    if (!id || !date) {
      return new Response(
        JSON.stringify({ message: "Project ID and date are required" }), 
        { status: 400 }
      );
    }

    const tasks = await readTasksFile();
    
    // Find the task
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return new Response(
        JSON.stringify({ message: "Task not found" }), 
        { status: 404 }
      );
    }

    // Remove the specific date from timeline
    if (tasks[taskIndex].timeline && tasks[taskIndex].timeline[date]) {
      delete tasks[taskIndex].timeline[date];
      tasks[taskIndex].updatedAt = new Date().toISOString();
      
      await writeTasksFile(tasks);

      return new Response(
        JSON.stringify(tasks[taskIndex]),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Date entry not found" }), 
        { status: 404 }
      );
    }

  } catch (error) {
    console.error("DELETE date error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete date entry: " + error.message }),
      { status: 500 }
    );
  }
}