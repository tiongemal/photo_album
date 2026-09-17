from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.album import Album
from app.schemas.album import AlbumCreate, AlbumResponse


router = APIRouter(
    prefix='/albums',
    tags=['Albums']
)

@router.post('/', response_model=AlbumResponse)
def create_album(
        album: AlbumCreate,
        db: Session = Depends(get_db)):
    new_album = Album(
        name=album.name,
        owner_id = album.owner_id
    )

    db.add(new_album)
    db.commit()
    db.refresh(new_album)

    return new_album

@router.get('/', response_model=list[AlbumResponse])
def get_albums(db: Session = Depends(get_db)):
    albums = db.query(Album).all()

    return albums


@router.get('/{album_id}', response_model=list[AlbumResponse])
def get_album(album_id:int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.id == album_id).first()

    if album in None:
        raise  HTTPException(
            status_code=404,
            detail='Album not found'
        )

    return album

@router.delete('/{album_id')
def delete_album(
        album_id: int,
        db: Session = Depends(get_db)
):
    album = db.query(Album).filter(Album.id == album_id).first()

    if album is None:
        raise HTTPException(
            status_code=404,
            detail='Album not found'
        )

    db.delete(album)
    db.commit()

    return {
        'message': 'Album deleted successfully'
    }