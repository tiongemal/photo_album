# React UI Documentation

This document describes the design, component structure, state management, and running instructions for the **Photo Vault** React UI frontend.

---

## 🎨 Overview & Technology Stack

The React frontend provides a responsive single-page web interface for managing photo albums and uploading/viewing images stored in the FastAPI backend.

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with Glassmorphic UI utilities
- **Icons**: [Lucide React](https://lucide.dev/) (`lucide-react`)
- **State Management**: React Hooks (`useState`, `useEffect`, `useRef`)
- **HTTP Client**: Native `fetch` API wrapper (`src/services/api.js`)

---

## 📂 Component Architecture

```
frontend/src/
├── components/
│   ├── Navbar.jsx          # Header with branding, user owner ID selector, & API health status badge
│   ├── AlbumList.jsx       # Grid view of photo albums, album creation modal, & delete action
│   ├── AlbumDetail.jsx     # Album view displaying photo thumbnail grid & metadata badges
│   ├── PhotoUploadModal.jsx # Drag-and-drop image uploader with live preview & format validation
│   ├── PhotoViewerModal.jsx # Fullscreen image lightbox & technical metadata sidebar
│   └── Toast.jsx           # Notification popups for successes and API error alerts
├── services/
│   └── api.js              # Centralized backend HTTP API client
├── App.jsx                 # Top-level view routing, state orchestration, and health polling
├── index.css               # Tailwind CSS directives & custom styling
└── main.jsx                # React application entrypoint
```

---

## ⚡ Key Capabilities & User Flows

### 1. Backend Connectivity & Health Check
- Automatically polls `GET /health` on startup and every 15 seconds.
- Displays real-time connection status in the header navbar (`API Connected` / `API Disconnected`).
- Warns users if the FastAPI Uvicorn server is offline with a quick retry button.

### 2. Album Management
- **View Albums**: Displays all albums fetched via `GET /albums/`.
- **Create Album**: Modal allowing input of album title and user owner ID (`POST /albums/`).
- **Delete Album**: Delete confirmation popup that triggers `DELETE /albums/{album_id}`.

### 3. Drag-and-Drop Photo Upload
- Dropzone supporting drag-and-drop or file system selection.
- Validates file extensions (`JPEG`, `PNG`, `WebP`).
- Client-side image preview before committing upload.
- Uploads file using `multipart/form-data` to `POST /albums/{album_id}/photos`.

### 4. Photo Gallery & Lightbox Viewer
- Displays responsive image thumbnail grid for each album.
- Click any photo to open a fullscreen lightbox modal.
- Displays metadata: Photo ID, Resolution (W x H), File Size (formatted in KB/MB), MIME Type, and unique UUID filename on disk.
- Direct download button for full-resolution images.

---

## ⚙️ Running the Frontend

### Prerequisites
- **Node.js**: `v18+` or higher
- **FastAPI Server**: Running on `http://127.0.0.1:8000`

### Commands

1. **Navigate to the `frontend/` directory**:
   ```bash
   cd frontend
   ```

2. **Install node dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser to `http://localhost:3000`.

5. **Build for production**:
   ```bash
   npm run build
   ```
