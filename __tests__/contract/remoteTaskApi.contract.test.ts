import { RemoteTaskListSchema, RemoteTaskSchema } from '../../src/schemas/remoteTaskSchema';

describe('Contrato API - tablero remoto', () => {
  it('acepta la respuesta válida de GET /remote-tasks', () => {
    const response = [
      {
        id: 'remote-1',
        title: 'Revisar backlog de calidad',
        status: 'pending',
        createdAt: '2026-08-19T12:00:00.000Z',
      },
      {
        id: 'remote-2',
        title: 'Preparar evidencia E2E',
        status: 'completed',
      },
    ];

    const result = RemoteTaskListSchema.safeParse(response);

    expect(result.success).toBe(true);
    expect(result.data?.[0].title).toBe('Revisar backlog de calidad');
    expect(result.data?.[1].status).toBe('completed');
  });

  it('rechaza una tarea remota con campos incompletos o tipos inesperados', () => {
    const response = {
      id: 25,
      title: '',
      status: 'archived',
    };

    const result = RemoteTaskSchema.safeParse(response);

    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(Object.keys(fields)).toEqual(expect.arrayContaining(['id', 'title', 'status']));
    }
  });
});
