import React from 'react';
import { Text, View } from 'react-native';
import { Task } from '../types';

interface RemoteTaskFeedProps {
  tasks: Task[];
  empty?: boolean;
}

export function RemoteTaskFeed({ tasks, empty = false }: RemoteTaskFeedProps) {
  if (empty) {
    return (
      <Text accessibilityRole="text" className="rounded-lg bg-amber-50 p-4 text-center text-amber-800">
        La API respondió sin tareas
      </Text>
    );
  }

  return (
    <View accessibilityLabel="Listado de tareas remotas" className="gap-2">
      <Text className="text-sm font-medium text-slate-600">
        {tasks.length === 1 ? '1 tarea remota' : `${tasks.length} tareas remotas`}
      </Text>
      {tasks.map((task) => (
        <View
          key={task.id}
          testID={`tarea-remota-${task.id}`}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`Tarea remota ${task.title}`}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <Text className="text-base font-semibold text-slate-900">{task.title}</Text>
          <Text className="mt-1 text-sm text-slate-500">
            Estado: {task.status === 'completed' ? 'completada' : 'pendiente'}
          </Text>
        </View>
      ))}
    </View>
  );
}
