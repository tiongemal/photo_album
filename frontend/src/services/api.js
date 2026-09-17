const API_BASE_URL = 'http://127.0.0.1:8000';

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

export async function fetchAlbums() {
  const res = await fetch(`${API_BASE_URL}/albums/`);
  if (!res.ok) {
    throw new Error('Failed to fetch albums');
  }
  return res.json();
}

export async function createAlbum(name, ownerId = 1) {
  const res = await fetch(`${API_BASE_URL}/albums/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      owner_id: parseInt(ownerId, 10),
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
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to delete album');
  }
  return res.json();
}

export async function fetchAlbumPhotos(albumId) {
  const res = await fetch(`${API_BASE_URL}/albums/${albumId}/photos`);
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
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to upload photo');
  }
  return res.json();
}

export function getPhotoUrl(photoId) {
  return `${API_BASE_URL}/photos/${photoId}`;
}
