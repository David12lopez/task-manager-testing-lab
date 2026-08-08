import { useCallback, useEffect, useState } from 'react';
import { fetchRemoteTasks, saveRemoteTask } from '../services/remoteTaskService';
import { Task } from '../types';

type RemoteBoardStatus = 'loading' | 'ready' | 'empty' | 'saving' | 'success' | 'error';

export function useRemoteTaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<RemoteBoardStatus>('loading');
  const [message, setMessage] = useState('');

  const loadTasks = useCallback(async () => {
    setStatus('loading');
    setMessage('');

    try {
      const remoteTasks = await fetchRemoteTasks();
      setTasks(remoteTasks);
      setStatus(remoteTasks.length === 0 ? 'empty' : 'ready');
    } catch (error) {
      setTasks([]);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Error inesperado al consultar tareas');
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (title: string) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return false;

    setStatus('saving');
    setMessage('');

    try {
      const created = await saveRemoteTask(cleanTitle);
      setTasks((current) => [...current, created]);
      setStatus('success');
      setMessage('Tarea sincronizada con la API');
      return true;
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la tarea');
      return false;
    }
  };

  return {
    tasks,
    status,
    message,
    isBusy: status === 'loading' || status === 'saving',
    loadTasks,
    addTask,
  };
}
