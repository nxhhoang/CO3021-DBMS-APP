import { http, HttpResponse } from 'msw';

interface LoginBody {
  username: string;
  // các field khác nếu có...
}

export const handlers = [
  // Giả lập một yêu cầu GET
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Gemini', role: 'AI Assistant' },
      { id: 2, name: 'Frontend Dev', role: 'Human' },
    ]);
  }),

  // Giả lập một yêu cầu POST với xử lý logic
  http.post('/api/login', async ({ request }) => {
    const info = (await request.json()) as LoginBody;
    if (info.username === 'admin') {
      return HttpResponse.json({ token: 'mock-token-123' });
    }
    return new HttpResponse(null, { status: 401 });
  }),
];
