from pydantic import BaseModel

class AlbumCreate(BaseModel):
    name: str
    owner_id: int

class AlbumResponse(BaseModel):
    id: int
    name: str
    owner_id: int

    class Config:
        from_attributes = True