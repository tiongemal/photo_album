import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AlbumList from './components/AlbumList';
import AlbumDetail from './components/AlbumDetail';
import PhotoUploadModal from './components/PhotoUploadModal';
import PhotoViewerModal from './components/PhotoViewerModal';
import Toast from './components/Toast';
import {
  checkHealth,
  fetchAlbums,
  createAlbum,
  deleteAlbum,
  uploadPhoto,
} from './services/api';

export default function App() {
  const [isOnline, setIsOnline] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [ownerId, setOwnerId] = useState(1);
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
      setAlbums(data);
    } catch (err) {
      showToast('Could not connect to FastAPI server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServerHealth();
    loadAlbums();

    const interval = setInterval(checkServerHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateAlbum = async (name, ownerId) => {
    try {
      const newAlbum = await createAlbum(name, ownerId);
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
      // Trigger refresh if viewing current album
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum({ ...selectedAlbum });
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload photo', 'error');
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
        ownerId={ownerId}
        setOwnerId={setOwnerId}
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
                loadAlbums();
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
            ownerId={ownerId}
            loading={loading}
          />
        )}
      </main>

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
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
