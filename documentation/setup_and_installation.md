# Setup & Installation Guide

Step-by-step instructions for installing, configuring, running, and testing the **Photo Album API**.

---

## 📋 System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Python Version**: `3.14+` (Compatible with Python `3.10+`)
- **Package Manager**: [`uv`](https://github.com/astral-sh/uv) (Recommended) or standard `pip` + `venv`

---

## 🛠️ Step 1: Environment Setup

### Option A: Using `uv` (Recommended)

1. **Install `uv`** (if not already installed):
   - Windows (PowerShell):
     ```powershell
     powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
     ```
   - macOS / Linux:
     ```bash
     curl -LsSf https://astral.sh/uv/install.sh | sh
     ```

2. **Navigate to project directory**:
   ```bash
   cd PythonProject6
   ```

3. **Install dependencies into isolated environment**:
   ```bash
   uv sync
   ```

---

### Option B: Using Standard Python Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pillow python-multipart httpx pytest
```

---

## 🚀 Step 2: Database & Storage Initialization

1. **Storage Directory**:
   The upload directory `storage/uploads/` is automatically created by `app/api/photos.py` when the server starts. You can also create it manually:
   ```bash
   mkdir -p storage/uploads
   ```

2. **Initialize Database & Seed Test User**:
   Run the utility script to populate the SQLite database (`photo_album.db`) with an initial test user:
   ```bash
   uv run python tests/create_test_user.py
   ```
   *Expected Output:*
   ```text
   Created user with ID: 1
   ```

---

## 🏃 Step 3: Running the Application

Start the Uvicorn development server with live reloads:

```bash
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Server URL: `http://127.0.0.1:8000`
- Interactive API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`

---

## 🧪 Step 4: Running Automated Tests

Run the test suite using `pytest`:

```bash
uv run pytest
```

---

## ❓ Troubleshooting

### 1. `400 Bad Request: Only JPEG, PNG and WebP images are allowed`
- Ensure the uploaded file has a valid MIME type in `Content-Type` header (`image/jpeg`, `image/png`, or `image/webp`).

### 2. `400 Bad Request: Uploaded file is not a valid image`
- Pillow failed to decode the file binary. Verify the image file is not corrupt.

### 3. `404 Not Found: Album not found`
- Ensure you created an album first using `POST /albums/` and use a valid `album_id` when uploading photos.

### 4. Database Locking Issues
- SQLite may lock if multiple write operations occur simultaneously in separate external database tools. Close external SQLite viewers if lock errors arise.
