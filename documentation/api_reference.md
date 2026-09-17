# API Reference Manual

Complete REST API specification for the **Photo Album API**.

---

## 🟢 Base URLs & Interactive Documentation

- **Base Server URL**: `http://127.0.0.1:8000`
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## ⚙️ System Endpoints

### 1. Root Endpoint

Check API availability.

- **Method**: `GET`
- **Path**: `/`
- **Response** (`200 OK`):
  ```json
  {
    "msg": "Photo Album API is running"
  }
  ```

---

### 2. Health Check

Check server health status.

- **Method**: `GET`
- **Path**: `/health`
- **Response** (`200 OK`):
  ```json
  {
    "status": "ok"
  }
  ```

---

## 📁 Album Endpoints (`/albums`)

### 3. Create Album

Create a new album linked to a user.

- **Method**: `POST`
- **Path**: `/albums/`
- **Request Body**: `application/json`
  ```json
  {
    "name": "Vacation 2026",
    "owner_id": 1
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "id": 1,
    "name": "Vacation 2026",
    "owner_id": 1
  }
  ```

---

### 4. List Albums

Retrieve a list of all existing albums.

- **Method**: `GET`
- **Path**: `/albums/`
- **Response** (`200 OK`):
  ```json
  [
    {
      "id": 1,
      "name": "Vacation 2026",
      "owner_id": 1
    }
  ]
  ```

---

### 5. Get Album Details

Retrieve details of a specific album by ID.

- **Method**: `GET`
- **Path**: `/albums/{album_id}`
- **Path Parameters**:
  - `album_id` (*integer*, required): The unique ID of the album.
- **Response** (`200 OK`):
  ```json
  {
    "id": 1,
    "name": "Vacation 2026",
    "owner_id": 1
  }
  ```
- **Error Responses**:
  - `404 Not Found`:
    ```json
    {
      "detail": "Album not found"
    }
    ```

---

### 6. Delete Album

Delete an album and cascadingly remove associated database photo records.

- **Method**: `DELETE`
- **Path**: `/albums/{album_id}`
- **Path Parameters**:
  - `album_id` (*integer*, required): The ID of the album to delete.
- **Response** (`200 OK`):
  ```json
  {
    "message": "Album deleted successfully"
  }
  ```
- **Error Responses**:
  - `404 Not Found`:
    ```json
    {
      "detail": "Album not found"
    }
    ```

---

## 🖼️ Photo Endpoints (`/albums/{id}/photos` & `/photos`)

### 7. Upload Photo to Album

Upload an image file (`JPEG`, `PNG`, or `WebP`) to an existing album.

- **Method**: `POST`
- **Path**: `/albums/{album_id}/photos`
- **Path Parameters**:
  - `album_id` (*integer*, required): The ID of the album.
- **Request Format**: `multipart/form-data`
  - `file` (*UploadFile*, required): Binary image file.
- **Response** (`200 OK`):
  ```json
  {
    "id": 1,
    "album_id": 1,
    "original_filename": "beach.jpg",
    "stored_filename": "c4ae0cbd-a146-4301-a2f1-57a797007a41.jpg",
    "mime_type": "image/jpeg",
    "file_size": 245890,
    "width": 1920,
    "height": 1080
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Album does not exist.
    ```json
    {
      "detail": "Album not found"
    }
    ```
  - `400 Bad Request`: Invalid file type.
    ```json
    {
      "detail": "Only JPEG, PNG and WebP images are allowed"
    }
    ```
  - `400 Bad Request`: Corrupted image content.
    ```json
    {
      "detail": "Uploaded file is not a valid image"
    }
    ```

---

### 8. List Photos in Album

Retrieve metadata for all photos belonging to a specific album.

- **Method**: `GET`
- **Path**: `/albums/{album_id}/photos`
- **Path Parameters**:
  - `album_id` (*integer*, required): The target album ID.
- **Response** (`200 OK`):
  ```json
  [
    {
      "id": 1,
      "album_id": 1,
      "original_filename": "beach.jpg",
      "stored_filename": "c4ae0cbd-a146-4301-a2f1-57a797007a41.jpg",
      "mime_type": "image/jpeg",
      "file_size": 245890,
      "width": 1920,
      "height": 1080
    }
  ]
  ```
- **Error Responses**:
  - `404 Not Found`: Album does not exist.

---

### 9. Get / Stream Photo File

Download or view the raw binary image stream for a photo by ID.

- **Method**: `GET`
- **Path**: `/photos/{photo_id}`
- **Path Parameters**:
  - `photo_id` (*integer*, required): The ID of the photo.
- **Response** (`200 OK`):
  - Binary stream (`FileResponse`) with appropriate `media_type` header (e.g., `image/jpeg`).
- **Error Responses**:
  - `404 Not Found`: Photo record or file on disk not found.
    ```json
    {
      "detail": "Photo not found"
    }
    ```
