from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.album import Album
from app.models.user import User

from app.schemas.album import AlbumCreate, AlbumResponse
from app.security import get_current_user


router = APIRouter(
    prefix='/albums',
    tags=['Albums']
)

@router.post('/', response_model=AlbumResponse)
def create_album(
        album: AlbumCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)):
    new_album = Album(
        name=album.name,
        owner_id = current_user.id
    )

    db.add(new_album)
    db.commit()
    db.refresh(new_album)

    return new_album

@router.get('/', response_model=list[AlbumResponse])
def get_albums(db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    albums = db.query(Album).filter(Album.owner_id == current_user.id).all()
    print('User_id: '+str(current_user.id))
    return albums


@router.get('/{album_id}', response_model=AlbumResponse)
def get_album(album_id:int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.id == album_id).first()

    if album is None:
        raise  HTTPException(
            status_code=404,
            detail='Album not found'
        )

    return album

@router.delete('/{album_id}')
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