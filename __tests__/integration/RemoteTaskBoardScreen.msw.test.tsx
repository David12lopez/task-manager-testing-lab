import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { REMOTE_TASKS_URL } from '../../src/services/remoteTaskService';
import { RemoteTaskBoardScreen } from '../../src/screens/RemoteTaskBoardScreen';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <RemoteTaskBoardScreen />
    </SafeAreaProvider>
  );

describe('RemoteTaskBoardScreen - integración con MSW', () => {
  it('carga tareas de la API y agrega una nueva con respuesta exitosa', async () => {
    server.use(
      http.get(REMOTE_TASKS_URL, () =>
        HttpResponse.json([{ id: 'api-1', title: 'Revisar riesgos moviles', status: 'pending' }])
      ),
      http.post(REMOTE_TASKS_URL, async ({ request }) => {
        const body = (await request.json()) as { title: string };
        return HttpResponse.json({ id: 'api-2', title: body.title, status: 'pending' }, { status: 201 });
      })
    );

    const view = await renderScreen();

    expect(await view.findByText('Revisar riesgos moviles')).toBeTruthy();

    await fireEvent.changeText(view.getByTestId('input-tarea-remota'), 'Auditar permisos de la app');
    await fireEvent.press(view.getByTestId('boton-sincronizar-tarea'));

    await waitFor(() => {
      expect(view.getByText('Tarea sincronizada con la API')).toBeTruthy();
      expect(view.getByText('Auditar permisos de la app')).toBeTruthy();
      expect(view.getByText('2 tareas remotas')).toBeTruthy();
    });
  });

  it('muestra error cuando la API rechaza el guardado', async () => {
    server.use(
      http.get(REMOTE_TASKS_URL, () => HttpResponse.json([])),
      http.post(REMOTE_TASKS_URL, () =>
        HttpResponse.json({ message: 'servicio no disponible' }, { status: 503 })
      )
    );

    const view = await renderScreen();

    expect(await view.findByText('La API respondió sin tareas')).toBeTruthy();

    await fireEvent.changeText(view.getByTestId('input-tarea-remota'), 'Caso con API caida');
    await fireEvent.press(view.getByTestId('boton-sincronizar-tarea'));

    await waitFor(() => {
      expect(view.getByRole('alert')).toHaveTextContent('No se pudo guardar la tarea remota');
      expect(view.queryByText('Caso con API caida')).toBeNull();
    });
  });

  it('presenta estado vacio cuando la consulta inicial no trae datos', async () => {
    server.use(http.get(REMOTE_TASKS_URL, () => HttpResponse.json([])));

    const view = await renderScreen();

    await waitFor(() => {
      expect(view.getByText('La API respondió sin tareas')).toBeTruthy();
      expect(view.queryByText('1 tarea remota')).toBeNull();
    });
  });
});
