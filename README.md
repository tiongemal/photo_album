# Photo Album API

A modern, lightweight RESTful API built with **FastAPI**, **SQLAlchemy**, and **Pillow** for managing photo albums and uploading, validating, and serving image files.

## 🚀 Features

- **Album Management**: Create, view, list, and delete photo albums linked to users.
- **Photo Upload & Validation**: Securely upload photos to specific albums with automatic format validation (`JPEG`, `PNG`, `WebP`) and PIL-based image integrity checks.
- **Image Metadata Extraction**: Automatically computes and stores image dimensions (width, height), original file name, MIME type, and file size.
- **Media File Serving**: Stream and serve uploaded images directly via FastAPI file responses.
- **Storage Isolation**: Stores media files in isolated disk storage using UUIDs to prevent filename collisions.
- **SQLite Database**: Persistent relational database powered by SQLAlchemy ORM.

---

## 🛠️ Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (v0.141.1+)
- **ORM & Database**: [SQLAlchemy](https://www.sqlalchemy.org/) (v2.0+) with SQLite
- **Image Processing**: [Pillow](https://python-pillow.org/) (v12.3+)
- **Package Manager**: [uv](https://github.com/astral-sh/uv)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)

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
│   ├── services/
│   │   ├── auth.py          # Auth service layer placeholder
│   │   └── storage.py       # Storage service layer placeholder
│   ├── database.py          # SQLAlchemy engine, session maker & Base
│   └── main.py              # FastAPI application initialization & routes
├── documentation/
│   ├── api_reference.md     # Detailed API endpoint reference
│   ├── architecture.md      # Architectural overview & storage pipeline
│   ├── database_schema.md   # Database tables, relations & schema layout
│   └── setup_and_installation.md # Comprehensive setup & development guide
├── storage/
│   └── uploads/             # Directory where uploaded photo files are stored
├── tests/
│   └── create_test_user.py  # Utility script to initialize a test user
├── photo_album.db           # SQLite database file
├── pyproject.toml           # Dependency specifications & project metadata
└── uv.lock                  # Lockfile for reproducible builds
```

---

## 🚦 Quick Start Guide

### Prerequisites

- **Python**: `3.14` or higher (compatible with `3.10+`)
- **uv**: Installed (`pip install uv` or official installation script)

### Setup & Run

1. **Clone the repository and enter the directory**:
   ```bash
   cd PythonProject6
   ```

2. **Install dependencies**:
   ```bash
   uv sync
   ```

3. **Initialize Test Data (Optional)**:
   Create a default test user to own photo albums:
   ```bash
   uv run python tests/create_test_user.py
   ```

4. **Start the FastAPI Development Server**:
   ```bash
   uv run uvicorn app.main:app --reload
   ```

5. **Access Interactive API Docs**:
   Open your browser and navigate to:
   - **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root health check message |
| `GET` | `/health` | Server health status |
| `POST` | `/albums/` | Create a new photo album |
| `GET` | `/albums/` | List all albums |
| `GET` | `/albums/{album_id}` | Retrieve album details by ID |
| `DELETE` | `/albums/{album_id}` | Delete an album and its photos |
| `POST` | `/albums/{album_id}/photos` | Upload a photo file to an album |
| `GET` | `/albums/{album_id}/photos` | List all photos in an album |
| `GET` | `/photos/{photo_id}` | Stream / download photo media by ID |

---

## 📚 Documentation Index

For complete and detailed technical documentation, explore the files in the [`documentation/`](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation) folder:

- 🏗️ [**Architecture & System Design**](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation/architecture.md) — System layer breakdown, request execution flows, and storage isolation.
- 📖 [**API Reference**](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation/api_reference.md) — Detailed REST specification, HTTP status codes, request bodies, and JSON schemas.
- 🗄️ [**Database Schema**](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation/database_schema.md) — ER diagrams, column specifications, foreign key relations, and cascades.
- ⚙️ [**Setup & Installation Guide**](file:///c:/Users/user1/PycharmProjects/PythonProject6/documentation/setup_and_installation.md) — Step-by-step development setup, testing guide, and troubleshooting.
