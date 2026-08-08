import { Task } from '../types';

export const REMOTE_TASKS_URL = 'https://api.taskmanager.com/remote-tasks';

let offlineRemoteTasks: Task[] = [
  { id: 'offline-1', title: 'Revisar backlog de calidad', status: 'pending' },
];

async function fetchWithTimeout(url: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1200);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchRemoteTasks(): Promise<Task[]> {
  let response: Response;

  try {
    response = await fetchWithTimeout(REMOTE_TASKS_URL);
  } catch {
    return offlineRemoteTasks;
  }

  if (!response.ok) {
    throw new Error('No se pudo consultar el tablero remoto');
  }

  return response.json();
}

export async function saveRemoteTask(title: string): Promise<Task> {
  let response: Response;

  try {
    response = await fetchWithTimeout(REMOTE_TASKS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  } catch {
    const fallbackTask: Task = {
      id: `offline-${offlineRemoteTasks.length + 1}`,
      title,
      status: 'pending',
    };
    offlineRemoteTasks = [...offlineRemoteTasks, fallbackTask];
    return fallbackTask;
  }

  if (!response.ok) {
    throw new Error('No se pudo guardar la tarea remota');
  }

  return response.json();
}
