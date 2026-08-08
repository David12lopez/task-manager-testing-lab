import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RemoteTaskComposer } from '../components/RemoteTaskComposer';
import { RemoteTaskFeed } from '../components/RemoteTaskFeed';
import { useRemoteTaskBoard } from '../hooks/useRemoteTaskBoard';

export function RemoteTaskBoardScreen() {
  const insets = useSafeAreaInsets();
  const { tasks, status, message, isBusy, addTask } = useRemoteTaskBoard();

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="gap-4 p-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-2xl font-bold text-slate-950">Tablero remoto</Text>
      <Text className="text-sm text-slate-600">
        Flujo con API simulada para validar integracion, errores y datos vacios.
      </Text>

      <RemoteTaskComposer disabled={isBusy} onSubmit={addTask} />

      {status === 'loading' && <Text className="text-center text-slate-500">Consultando API...</Text>}
      {status === 'saving' && <Text className="text-center text-slate-500">Enviando tarea...</Text>}
      {status === 'success' && (
        <Text className="rounded-lg bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-800">
          {message}
        </Text>
      )}
      {status === 'error' && (
        <Text accessibilityRole="alert" className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          {message}
        </Text>
      )}

      <RemoteTaskFeed tasks={tasks} empty={status === 'empty'} />
    </ScrollView>
  );
}
