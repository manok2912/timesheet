import path from 'path';
import fs from 'fs/promises';

const filePath = path.join(process.cwd(), 'data', 'tasks.json');

export async function readTasksFile() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return [];
  }
}

export async function writeTasksFile(tasks) {
  try {
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks file:', error);
    throw error;
  }
}