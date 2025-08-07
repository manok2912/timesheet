import { readTasksFile, writeTasksFile } from '../../../utils';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { dates, start, end } = await request.json();
    
    if (!id || !dates || !dates.length) {
      return new Response(
        JSON.stringify({ message: "Project ID and dates are required" }), 
        { status: 400 }
      );
    }

    const tasks = await readTasksFile();
    const taskIndex = tasks.findIndex(task => 
      task.id.toLowerCase() === id.toLowerCase()
    );
    
    if (taskIndex === -1) {
      return new Response(
        JSON.stringify({ message: "Task not found" }), 
        { status: 404 }
      );
    }

    // Remove only the specified dates from timeline
    dates.forEach(date => {
      delete tasks[taskIndex].timeline[date];
    });

    tasks[taskIndex].updatedAt = new Date().toISOString();
    
    await writeTasksFile(tasks);

    return new Response(
      JSON.stringify({
        message: `Successfully deleted entries for week ${start} to ${end}`,
        task: tasks[taskIndex]
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE week error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete week entries: " + error.message }),
      { status: 500 }
    );
  }
}