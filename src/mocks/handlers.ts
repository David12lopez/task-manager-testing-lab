import { http, HttpResponse } from 'msw';
import { Task } from '../types';

const API_URL = 'https://api.taskmanager.com';

// ponytail: la "API falsa" es un array en memoria; resetTasks lo limpia entre tests
let tasks: Task[] = [];
let remoteTasks: Task[] = [
  { id: 'remote-1', title: 'Revisar backlog de calidad', status: 'pending' },
];

export const resetTasks = () => {
  tasks = [];
  remoteTasks = [{ id: 'remote-1', title: 'Revisar backlog de calidad', status: 'pending' }];
};

export const handlers = [
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const { title } = (await request.json()) as { title: string };
    const task: Task = { id: String(tasks.length + 1), title, status: 'pending' };
    tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.get(`${API_URL}/tasks`, () => HttpResponse.json(tasks)),

  http.get(`${API_URL}/remote-tasks`, () => HttpResponse.json(remoteTasks)),

  http.post(`${API_URL}/remote-tasks`, async ({ request }) => {
    const { title } = (await request.json()) as { title: string };
    const task: Task = { id: `remote-${remoteTasks.length + 1}`, title, status: 'pending' };
    remoteTasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),
];

// https://api.taskmanager.com/tasks - POST
/**
{
  {
    id: "234234",
    title: "Tarea 1",
    status: 'pending'
  },
  { status: 201 }
}
*/

// https://api.taskmanager.com/tasks - GET
/**
[
  {
    id: "234234",
    title: "Tarea 1",
    status: 'pending'
  }
]
*/
