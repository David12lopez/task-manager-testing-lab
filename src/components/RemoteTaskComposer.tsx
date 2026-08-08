import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface RemoteTaskComposerProps {
  disabled?: boolean;
  onSubmit: (title: string) => Promise<boolean>;
}

export function RemoteTaskComposer({ disabled = false, onSubmit }: RemoteTaskComposerProps) {
  const [title, setTitle] = useState('');

  const submit = async () => {
    const saved = await onSubmit(title);
    if (saved) setTitle('');
  };

  return (
    <View className="gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <Text className="text-base font-semibold text-slate-900">Nueva tarea remota</Text>
      <TextInput
        testID="input-tarea-remota"
        placeholder="Nombre para sincronizar"
        placeholderTextColor="#64748b"
        value={title}
        onChangeText={setTitle}
        accessibilityLabel="Nombre de la tarea remota"
        accessibilityHint="Escribe una tarea que sera enviada a la API simulada"
        className="rounded-md border border-slate-300 px-3 py-3 text-base text-slate-950"
      />
      <Pressable
        testID="boton-sincronizar-tarea"
        onPress={submit}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Sincronizar tarea remota"
        accessibilityState={{ disabled }}
        className={`rounded-md py-3 ${disabled ? 'bg-slate-400' : 'bg-cyan-700 active:bg-cyan-800'}`}
      >
        <Text className="text-center text-base font-semibold text-white">Sincronizar</Text>
      </Pressable>
    </View>
  );
}
