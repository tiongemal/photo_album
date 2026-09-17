# Architecture & System Design

This document details the architectural principles, component structure, data flow, and file storage strategies implemented in the **Photo Album API**.

---

## 🏛️ System Overview

The Photo Album API is built as a multi-tier, modular web application following modern RESTful API principles and clean code separation.

```mermaid
graph TD
    Client["Client / Browser / Mobile"] -->|HTTP REST Requests| FastAPI["FastAPI Application (app.main)"]
    
    subgraph API Layer
        FastAPI --> AlbumRouter["Albums Router (app.api.albums)"]
        FastAPI --> PhotoRouter["Photos Router (app.api.photos)"]
    end
    
    subgraph Data Validation
        AlbumRouter --> AlbumSchemas["Album Pydantic Schemas"]
        PhotoRouter --> PhotoSchemas["Photo Pydantic Schemas"]
    end
    
    subgraph Core Processing & Services
        PhotoRouter --> PIL["Pillow Image Processing (Validation & Dimensions)"]
    end
    
    subgraph Persistence Layer
        AlbumRouter --> SQLAlchemy["SQLAlchemy ORM (SessionLocal)"]
        PhotoRouter --> SQLAlchemy
        SQLAlchemy --> SQLite["SQLite Database (photo_album.db)"]
        PhotoRouter --> DiskStorage["Local Disk Storage (storage/uploads/)"]
    end
```

---

## 🧩 Architectural Layers

### 1. Presentation & Routing Layer (`app/main.py`, `app/api/`)
- **FastAPI Core**: Handles routing, dependency injection (`Depends(get_db)`), HTTP exception formatting, and OpenAPI schema generation.
- **Albums Router (`app/api/albums.py`)**: Handles album creation, listing, retrieval, and deletion.
- **Photos Router (`app/api/photos.py`)**: Includes `album_photo_router` (album-scoped photo uploads and list) and `photo_router` (photo media download/streaming).

### 2. Schema Validation Layer (`app/schemas/`)
- Uses **Pydantic** models to validate incoming HTTP request payloads and structure outgoing JSON responses.
- Enforces data types and `from_attributes = True` compatibility for SQLAlchemy ORM conversion.

### 3. Business & Processing Layer
- **Pillow (`PIL.Image`) Integration**: Validates image binary contents to prevent corrupted uploads or file spoofing. Reads image dimensions (`width` and `height`) dynamically.
- **UUID File Generator**: Generates cryptographically secure, unique filenames using Python `uuid4` to prevent file collisions and directory traversal attacks.

### 4. Persistence Layer (`app/models/`, `app/database.py`)
- **SQLAlchemy ORM (v2.0)**: Manages database sessions with unit-of-work transaction management (`commit`, `rollback`, `refresh`).
- **SQLite Engine**: Stores relational records locally in `photo_album.db`. Configured with `connect_args={"check_same_thread": False}` to support concurrent thread access via FastAPI.

### 5. File System Storage (`storage/uploads/`)
- Dedicated local directory for binary image storage.
- Disconnected from raw database IDs to enhance security.

---

## 🔄 Photo Upload Lifecycle & Workflow

The upload process follows a strict transaction safety pattern to ensure data consistency between disk storage and database records:

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant API as Photos API Router
    participant DB as SQLite DB
    participant FS as File System
    participant PIL as Pillow Engine

    Client->>API: POST /albums/{album_id}/photos (Multipart Form File)
    API->>DB: Query Album by album_id
    alt Album Not Found
        DB-->>API: None
        API-->>Client: 404 Not Found ('Album not found')
    end
    
    API->>API: Check MIME type in {'image/jpeg', 'image/png', 'image/webp'}
    alt MIME invalid
        API-->>Client: 400 Bad Request ('Only JPEG, PNG and WebP images are allowed')
    end

    API->>FS: Save binary bytes to storage/uploads/{uuid}.ext
    API->>PIL: Open file and extract width & height
    alt Invalid/Corrupted Image
        PIL-->>API: Exception
        API->>FS: Delete stored file (unlink)
        API-->>Client: 400 Bad Request ('Uploaded file is not a valid image')
    end

    API->>DB: Create & commit Photo record with metadata
    DB-->>API: Photo ORM Instance
    API-->>Client: 200 OK (PhotoResponse JSON)
```

---

## 🔒 Security & Reliability Measures

1. **UUID Naming Isolation**: Files saved on disk use random UUID strings (e.g., `c4ae0cbd-a146-4301-a2f1-57a797007a41.jpg`). Original filenames are preserved only in database metadata.
2. **Double Validation (MIME & Binary)**: Content headers are verified first, followed by strict binary header verification via `Image.open()`.
3. **Orphan File Cleanup**: If image verification fails after writing to disk, the temporary file is unlinked immediately to prevent storage leaks.
4. **Relational Cascades**: Deleting an `Album` automatically deletes linked `Photo` database records (`cascade="all, delete"`).
