from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Album(Base):
    __tablename__ ="albums"

    id= Column(
        Integer, primary_key=True,
        index=True
    )
    name = Column(
        String,
        nullable=False
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    owner = relationship(
        "User",
        back_populates="albums"
    )

    photos = relationship(
        "Photo", back_populates="album",
        cascade="all, delete"
    )
