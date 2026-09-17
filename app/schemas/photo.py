from datetime import datetime

from pydantic import BaseModel


class PhotoResponse(BaseModel):
    id: int
    album_id: int
    original_filename: str
    stored_filename: str
    mime_type: str
    file_size: int
    width: int | None
    height: int | None

    class Config:
        from_attributes = True