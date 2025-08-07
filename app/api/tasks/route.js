import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "tasks.json");

// Helper function to safely read and parse JSON
async function readTasksFile() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tasks file:", error);
    // Return empty array if file doesn't exist or is corrupted
    return [];
  }
}

// Helper function to safely write JSON with backup
async function writeTasksFile(tasks) {
  try {
    // Create backup before writing
    const backupPath = filePath + '.backup';
    try {
      const currentData = await fs.readFile(filePath, "utf8");
      await fs.writeFile(backupPath, currentData);
    } catch (backupError) {
      console.warn("Could not create backup:", backupError);
    }

    // Write new data with proper formatting
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing tasks file:", error);
    return false;
  }
}

// Helper function to validate task data
function validateTask(task) {
  const errors = [];
  
  if (!task.id || typeof task.id !== 'string') {
    errors.push("Task ID is required and must be a string");
  }
  
  if (!task.project || typeof task.project !== 'string') {
    errors.push("Project name is required and must be a string");
  }
  
  if (task.timeline && typeof task.timeline !== 'object') {
    errors.push("Timeline must be an object");
  }
  
  // Validate timeline entries
  if (task.timeline) {
    for (const [date, hours] of Object.entries(task.timeline)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
      }
      if (typeof hours !== 'number' || hours < 0 || hours > 24) {
        errors.push(`Invalid hours for ${date}: ${hours}. Must be a number between 0 and 24`);
      }
    }
  }
  
  return errors;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const tasks = await readTasksFile();
    
    if (start && end) {
      // Filter tasks that have entries within the date range
      const filteredTasks = tasks.filter(task => {
        if (!task.timeline) return false;
        
        // Check if task has any entries between start and end dates
        return Object.keys(task.timeline).some(date => 
          date >= start && date <= end
        );
      });
      
      return new Response(JSON.stringify(filteredTasks), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If no date range specified, return all tasks
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch tasks" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request) {
  try {
    const newTask = await request.json();
    
    // Validate required fields
    if (!newTask.project) {
      return new Response(
        JSON.stringify({ message: "Project name is required" }), 
        { status: 400 }
      );
    }

    const tasks = await readTasksFile();
    
    // Check if project already exists
    const existingTaskIndex = tasks.findIndex(
      task => task.project.toLowerCase() === newTask.project.toLowerCase()
    );

    if (existingTaskIndex !== -1) {
      // Merge with existing project
      const existingTask = tasks[existingTaskIndex];
      tasks[existingTaskIndex] = {
        ...existingTask,
        timeline: {
          ...existingTask.timeline,
          ...newTask.timeline
        },
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new project
      tasks.push({
        id: newTask.project.toLowerCase(),
        project: newTask.project,
        timeline: newTask.timeline,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    await writeTasksFile(tasks);

    return new Response(
      JSON.stringify(tasks.find(t => t.project.toLowerCase() === newTask.project.toLowerCase())),
      { 
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({ message: error.message || "Failed to create task" }),
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    
    if (!Array.isArray(body)) {
      return new Response(
        JSON.stringify({ error: "Request body must be an array of tasks" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate all tasks
    const allErrors = [];
    body.forEach((task, index) => {
      const errors = validateTask(task);
      if (errors.length > 0) {
        allErrors.push(`Task ${index}: ${errors.join(", ")}`);
      }
    });

    if (allErrors.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: "Validation failed", 
          details: allErrors 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Add timestamps to all tasks
    const tasksWithTimestamps = body.map(task => ({
      ...task,
      updatedAt: new Date().toISOString(),
      createdAt: task.createdAt || new Date().toISOString(),
    }));

    const writeSuccess = await writeTasksFile(tasksWithTimestamps);
    if (!writeSuccess) {
      throw new Error("Failed to save data");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: tasksWithTimestamps.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to update tasks",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Task ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const tasks = await readTasksFile();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter((task) => task.id !== id);

    if (filteredTasks.length === initialLength) {
      return new Response(
        JSON.stringify({ error: "Task not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const writeSuccess = await writeTasksFile(filteredTasks);
    if (!writeSuccess) {
      throw new Error("Failed to save data");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        deletedId: id,
        remainingCount: filteredTasks.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to delete task",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
