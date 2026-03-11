from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

class Livre(Base):
    __tablename__ = "livres"

    id       = Column(Integer, primary_key=True, index=True)
    titre    = Column(String, nullable=False)
    auteur   = Column(String, nullable=False)
    isbn     = Column(String, unique=True, nullable=False)
    quantite = Column(Integer, default=1)
    disponible = Column(Boolean, default=True)
