from fastapi import FastAPI

from app.database import Base, engine
from app.models import User, Album,Photo
from app.api.albums import router as albums_router
from app.api.photos import album_photo_router, photo_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title='Photo Album Api',
    version="1.0.0"
)

# for albums endpoints
app.include_router(albums_router)


# for photo endpoints
app.include_router(photo_router)
app.include_router(album_photo_router)


@app.get('/')
def root():
    return {
        'msg':'Photo Album API is running'
    }

@app.get('/health')
def health():
    return {
        'status': 'ok'
    }

