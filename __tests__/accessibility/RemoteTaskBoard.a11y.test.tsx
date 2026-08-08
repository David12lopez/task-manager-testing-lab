import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { RemoteTaskComposer } from '../../src/components/RemoteTaskComposer';
import { RemoteTaskFeed } from '../../src/components/RemoteTaskFeed';

describe('Accesibilidad del tablero remoto', () => {
  it('expone nombre accesible en el campo y boton principal', async () => {
    const view = await render(<RemoteTaskComposer onSubmit={jest.fn().mockResolvedValue(false)} />);

    expect(view.getByLabelText('Nombre de la tarea remota')).toBeTruthy();
    expect(view.getByLabelText('Sincronizar tarea remota')).toHaveAccessibilityState({
      disabled: false,
    });
    expect(view.getByRole('button', { name: 'Sincronizar tarea remota' })).toBeTruthy();
  });

  it('marca el boton como deshabilitado mientras la pantalla esta ocupada', async () => {
    const submit = jest.fn().mockResolvedValue(false);
    const view = await render(<RemoteTaskComposer disabled onSubmit={submit} />);

    const button = view.getByLabelText('Sincronizar tarea remota');
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibilityState({ disabled: true });

    fireEvent.press(button);
    expect(submit).not.toHaveBeenCalled();
  });

  it('entrega etiquetas legibles para las tarjetas recibidas de la API', async () => {
    const view = await render(
      <RemoteTaskFeed
        tasks={[{ id: 'api-7', title: 'Validar contraste del tablero', status: 'completed' }]}
      />
    );

    expect(view.getByLabelText('Listado de tareas remotas')).toBeTruthy();
    expect(view.getByLabelText('Tarea remota Validar contraste del tablero')).toBeTruthy();
  });
});
