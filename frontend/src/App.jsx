import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AlbumList from './components/AlbumList';
import AlbumDetail from './components/AlbumDetail';
import PhotoUploadModal from './components/PhotoUploadModal';
import PhotoViewerModal from './components/PhotoViewerModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import {
  checkHealth,
  fetchAlbums,
  createAlbum,
  deleteAlbum,
  uploadPhoto,
  deletePhoto,
  getStoredUsername,
  removeToken,
} from './services/api';

export default function App() {
  const [isOnline, setIsOnline] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUsername() || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const checkServerHealth = async () => {
    const status = await checkHealth();
    setIsOnline(status);
    return status;
  };

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const data = await fetchAlbums();
      // Handle single album object vs list returned by API
      setAlbums(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      if (currentUser) {
        showToast(err.message || 'Could not fetch albums', 'error');
      }
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServerHealth();
    if (currentUser) {
      loadAlbums();
    } else {
      setLoading(false);
    }

    const interval = setInterval(checkServerHealth, 15000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleAuthSuccess = (username, message) => {
    setCurrentUser(username);
    showToast(message, 'success');
  };

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setAlbums([]);
    setSelectedAlbum(null);
    showToast('Signed out successfully', 'success');
  };

  const handleCreateAlbum = async (name) => {
    try {
      const newAlbum = await createAlbum(name);
      setAlbums((prev) => [...prev, newAlbum]);
      showToast(`Album "${newAlbum.name}" created successfully!`);
    } catch (err) {
      showToast(err.message || 'Failed to create album', 'error');
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    try {
      await deleteAlbum(albumId);
      setAlbums((prev) => prev.filter((a) => a.id !== albumId));
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum(null);
      }
      showToast('Album deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete album', 'error');
    }
  };

  const handleUploadSuccess = async (albumId, file) => {
    try {
      await uploadPhoto(albumId, file);
      showToast(`Photo "${file.name}" uploaded successfully!`);
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum({ ...selectedAlbum });
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload photo', 'error');
      throw err;
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await deletePhoto(photoId);
      showToast('Photo deleted successfully');
      if (selectedAlbum) {
        setSelectedAlbum({ ...selectedAlbum });
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete photo', 'error');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        isOnline={isOnline}
        checkServerHealth={checkServerHealth}
        selectedAlbum={selectedAlbum}
        setSelectedAlbum={setSelectedAlbum}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isOnline && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
            <div>
              <p className="font-semibold">⚠️ Cannot connect to backend server</p>
              <p className="text-xs text-rose-400/80 mt-0.5">
                Make sure Uvicorn is running on <code className="bg-rose-950 px-1.5 py-0.5 rounded">http://127.0.0.1:8000</code>.
              </p>
            </div>
            <button
              onClick={() => {
                checkServerHealth();
                if (currentUser) loadAlbums();
              }}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-semibold transition"
            >
              Retry Connection
            </button>
          </div>
        )}

        {selectedAlbum ? (
          <AlbumDetail
            album={selectedAlbum}
            onBack={() => setSelectedAlbum(null)}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onSelectPhoto={(photo) => setSelectedPhoto(photo)}
          />
        ) : (
          <AlbumList
            albums={albums}
            onSelectAlbum={(album) => setSelectedAlbum(album)}
            onCreateAlbum={handleCreateAlbum}
            onDeleteAlbum={handleDeleteAlbum}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            loading={loading}
          />
        )}
      </main>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && selectedAlbum && (
        <PhotoUploadModal
          album={selectedAlbum}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* Lightbox / Viewer Modal */}
      {selectedPhoto && (
        <PhotoViewerModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDeletePhoto={handleDeletePhoto}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
