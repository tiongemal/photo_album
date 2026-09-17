# Photo Album API & React UI

A full-stack photo album and media management application built with **FastAPI**, **React 18**, **SQLAlchemy**, **Tailwind CSS**, **Pillow**, and **pwdlib**.

---

## 🚀 Features

- **React Web Dashboard**: Sleek, modern glassmorphism UI for browsing photo albums, uploading images, and viewing image metadata.
- **Album Management**: Create, view, list, and delete photo albums linked to users.
- **Drag-and-Drop Photo Upload**: Securely upload photos to specific albums with client-side preview and server-side format validation (`JPEG`, `PNG`, `WebP`).
- **Metadata Extraction**: Automatically computes and displays image dimensions (width x height), original filename, MIME type, and file size.
- **Lightbox Image Viewer**: View high-resolution photos in a fullscreen lightbox modal with technical metadata drawer.
- **Security & Password Hashing**: Secure user password hashing using Argon2 (`pwdlib`) and JWT token utilities (`PyJWT`).
- **Storage Isolation**: Stores media files in isolated disk storage using UUIDs to prevent filename collisions.
- **Live Health Monitoring**: Real-time API connectivity status indicator between React frontend and FastAPI backend.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (v0.141.1+)
- **ORM & Database**: [SQLAlchemy](https://www.sqlalchemy.org/) (v2.0+) with SQLite
- **Image Processing**: [Pillow](https://python-pillow.org/) (v12.3+)
- **Security & Password Hashing**: [pwdlib](https://github.com/hynek/pwdlib) (Argon2) & [PyJWT](https://pyjwt.readthedocs.io/)
- **Package Manager**: [uv](https://github.com/astral-sh/uv)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Repository Structure

```
.
├── app/
│   ├── api/
│   │   ├── albums.py        # Router for album CRUD endpoints
│   │   ├── auth.py          # Router placeholder for authentication
│   │   └── photos.py        # Router for photo upload & media retrieval
│   ├── models/
│   │   ├── album.py         # Album ORM database model
│   │   ├── photo.py         # Photo ORM database model
│   │   └── user.py          # User ORM database model
│   ├── schemas/
│   │   ├── album.py         # Pydantic schemas for albums
│   │   ├── photo.py         # Pydantic schemas for photos
│   │   └── user.py          # Pydantic schemas for users
│   ├── database.py          # SQLAlchemy engine & session maker
│   ├── security.py          # Password hashing (Argon2 via pwdlib) & verification
│   └── main.py              # FastAPI app initialization, CORS & endpoints
├── documentation/
│   ├── api_reference.md     # Detailed API endpoint reference
│   ├── architecture.md      # Architectural overview & storage pipeline
│   ├── database_schema.md   # Database tables, relations & schema layout
│   ├── frontend_ui.md       # React frontend architecture & user flows
│   └── setup_and_installation.md # Comprehensive setup & development guide
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, AlbumList, AlbumDetail, Modals, Toast
│   │   ├── services/api.js  # FastAPI HTTP client wrapper
│   │   ├── App.jsx          # Top-level view routing & state management
│   │   ├── index.css        # Tailwind CSS directives & custom styles
│   │   └── main.jsx         # React application entrypoint
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── storage/
│   └── uploads/             # Directory where uploaded photo files are stored
├── tests/
│   ├── create_test_user.py  # Utility script to initialize a test user
│   └── pswd_hash.py         # Test script for Argon2 password hashing & verification
├── photo_album.db           # SQLite database file
└── pyproject.toml           # Python dependency specifications
```

---

## 🚦 Quick Start Guide

### 1. Start the FastAPI Backend

1. **Install Python dependencies**:
   ```bash
   uv sync
   ```

2. **Initialize Test User**:
   ```bash
   uv run python tests/create_test_user.py
   ```

3. **Run Uvicorn Server**:
   ```bash
   uv run uvicorn app.main:app --reload --port 8000
   ```
   - API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 2. Start the React Frontend

1. **Navigate to `frontend/` directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start Vite Dev Server**:
   ```bash
   npm run dev
   ```
   - React UI: [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation Index

Check the [`documentation/`](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation) folder for full guides:

- 💻 [**React UI Guide**](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation/frontend_ui.md) — Frontend component structure, state management, and user flows.
- 🏗️ [**Architecture & System Design**](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation/architecture.md) — System layer breakdown, request execution flows, and storage isolation.
- 📖 [**API Reference**](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation/api_reference.md) — Detailed REST specification, HTTP status codes, request bodies, and JSON schemas.
- 🗄️ [**Database Schema**](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation/database_schema.md) — ER diagrams, column specifications, foreign key relations, and cascades.
- ⚙️ [**Setup & Installation Guide**](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation/setup_and_installation.md) — Step-by-step development setup, testing guide, and troubleshooting.
