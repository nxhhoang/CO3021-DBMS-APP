export async function apiFetch(url: string, options: RequestInit = {}) {
  let accessToken = localStorage.getItem('accessToken');

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });

  // Nếu accessToken hết hạn
  if (res.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const refreshRes = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      throw new Error('Refresh token failed');
    }

    const refreshData = await refreshRes.json();

    localStorage.setItem('accessToken', refreshData.data.accessToken);
    localStorage.setItem('refreshToken', refreshData.data.refreshToken);

    // Retry request
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: `Bearer ${refreshData.data.accessToken}`,
      },
    });
  }

  return res;
}
