const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return res.json();
}

export const authApi = {
  login: (data: any) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/api/auth/me'),
};

export async function fetchLessons() {
  return apiFetch('/api/lessons');
}

export async function fetchLessonById(id: string) {
  return apiFetch(`/api/lessons/${id}`);
}

export async function fetchLessonsByLevel(level: string) {
  return apiFetch(`/api/lessons/level/${level}`);
}

export async function fetchVocabulary() {
  return apiFetch('/api/vocabulary');
}

export async function fetchQuizzes() {
  return apiFetch('/api/quizzes');
}

export async function updateProgress(data: { lessonId: string; completed: boolean; score?: number }) {
  return apiFetch('/api/progress', { method: 'POST', body: JSON.stringify(data) });
}

export async function createLesson(data: any) {
  return apiFetch('/api/lessons', { method: 'POST', body: JSON.stringify(data) });
}

export async function createVocabulary(data: any) {
  return apiFetch('/api/vocabulary', { method: 'POST', body: JSON.stringify(data) });
}
