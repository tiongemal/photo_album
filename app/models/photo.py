from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Photo(Base):
    __tablename__ = 'photos'

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    album_id = Column(
        Integer,
        ForeignKey('albums.id'),
        nullable=False
    )

    original_filename = Column(
        String,
        nullable=False
    )

    stored_filename = Column(
        String,
        nullable=False,
        unique=True
    )

    mime_type = Column(
        String,
        nullable=False
    )

    file_size = Column(
        Integer,
        nullable=False

    )

    width = Column(
        Integer,
        nullable=True
    )

    height = Column(
        Integer,
        nullable=True
    )

    album = relationship(
        'Album',
        back_populates='photos'
                         )
