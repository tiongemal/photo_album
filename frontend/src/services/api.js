const API_BASE_URL = 'http://127.0.0.1:8000';

export function getToken() {
  return localStorage.getItem('access_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
}

export function removeToken() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('current_username');
}

export function getStoredUsername() {
  return localStorage.getItem('current_username');
}

export function setStoredUsername(username) {
  if (username) {
    localStorage.setItem('current_username', username);
  } else {
    localStorage.removeItem('current_username');
  }
}

function getAuthHeaders(customHeaders = {}) {
  const token = getToken();
  const headers = { ...customHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch (err) {
    return false;
  }
}

export async function registerUser(username, email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Registration failed');
  }
  return res.json();
}

export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Invalid username or password');
  }
  const data = await res.json();
  if (data.access_token) {
    setToken(data.access_token);
    setStoredUsername(username);
  }
  return data;
}

export async function fetchAlbums() {
  const res = await fetch(`${API_BASE_URL}/albums/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch albums');
  }
  return res.json();
}

export async function createAlbum(name) {
  const res = await fetch(`${API_BASE_URL}/albums/`, {
    method: 'POST',
    headers: getAuthHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      name,
      owner_id: 1, // Satisfies Pydantic schema validation while backend overrides with current_user.id
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to create album');
  }
  return res.json();
}

export async function deleteAlbum(albumId) {
  const res = await fetch(`${API_BASE_URL}/albums/${albumId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to delete album');
  }
  return res.json();
}

export async function fetchAlbumPhotos(albumId) {
  const res = await fetch(`${API_BASE_URL}/albums/${albumId}/photos`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to fetch photos');
  }
  return res.json();
}

export async function uploadPhoto(albumId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/albums/${albumId}/photos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to upload photo');
  }
  return res.json();
}

export async function deletePhoto(photoId) {
  const res = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to delete photo');
  }
  return res.json();
}

export function getPhotoUrl(photoId) {
  return `${API_BASE_URL}/photos/${photoId}`;
}
