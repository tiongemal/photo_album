from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter, Depends, File,
    HTTPException, UploadFile
)

from fastapi.responses import FileResponse

from PIL import Image
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.album import Album
from app.models.photo import Photo
from app.schemas.photo import PhotoResponse

album_photo_router = APIRouter(
    prefix='/albums',
    tags=['Photos']
)

photo_router = APIRouter(
    prefix='/photos',
    tags=['Photos']
)

UPLOAD_DIR = Path('storage/uploads')
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@album_photo_router.post(
    '/{album_id}/photos', response_model=PhotoResponse
)
async def upload_photot(
        album_id: int, file: UploadFile=File(...), db: Session = Depends(get_db)
):
    album =db.query(Album).filter(Album.id==album_id).first()

    if album is None:
        raise HTTPException(
            status_code=404,
            detail='Album not found'
        )

    allowed_types = {
        'image/jpeg', 'image/png', 'image/webp'
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail='Only JPEG, PNG and WebP images are allowed'
        )

    extension = Path(file.filename).suffix.lower()

    stored_filename = f'{uuid4()}{extension}'

    file_path = UPLOAD_DIR / stored_filename

    contents = await file.read()

    file_path.write_bytes(contents)

    try:
        image = Image.open(file_path)

        width, height = image.size

    except Exception:
        file_path.unlink(missing_ok=True)

        raise  HTTPException(
            status_code=400,
            detail='Uploaded file is not a valid image'
        )

    photo = Photo(
        album_id=album_id, original_filename=file.filename,
        stored_filename=stored_filename, mime_type = file.content_type,
        file_size=len(contents), width=width, height=height


    )


    db.add(photo)
    db.commit()
    db.refresh(photo)

    return photo

@album_photo_router.get('/{album_id}/photos', response_model=list[PhotoResponse])
def get_album_photos(album_id: int,
                     db: Session = Depends(get_db)):
    album= db.query(Album).filter(Album.id == album_id).first()

    if album is None:
        raise HTTPException(
            status_code=404,
            detail='Album not found'
        )

    photos = db.query(Photo).filter(
        Photo.album_id == album_id
    ).all()

    return photos

@photo_router.get('/{photo_id}')
def get_photo(
        photo_id: int, db: Session = Depends(get_db)
):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()

    if photo is None:
        raise HTTPException(
            status_code=404,
            detail='Photo not found'
        )

    file_path = UPLOAD_DIR / photo.stored_filename


    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail='Photo file not found'
        )

    return FileResponse(
        path=file_path, media_type=photo.mime_type,
        filename=photo.original_filename
    )

@photo_router.delete('/{photo_id}')
def delete_photo(
        photo_id: int,
        db: Session = Depends(get_db)
):
    photo = db.query(Photo).filter(
        Photo.id == photo_id
    ).first()

    if photo is None:
        raise HTTPException(
            status_code=404,
            detail='photo not found'
        )

    file_path = UPLOAD_DIR/ photo.stored_filename

    if file_path.exists():
        file_path.unlink()

    db.delete(photo)
    db.commit()

    return {
        'message': 'Photo deleted successfully'
    }

