from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from .database import Base
import enum

class StatutEmprunt(str, enum.Enum):
    en_cours = "en_cours"
    retourne = "retourne"
    en_retard = "en_retard"

class Emprunt(Base):
    __tablename__ = "emprunts"

    id              = Column(Integer, primary_key=True, index=True)
    livre_id        = Column(Integer, nullable=False)
    utilisateur_id  = Column(Integer, nullable=False)
    date_emprunt    = Column(DateTime, server_default=func.now())
    date_retour_prevue = Column(DateTime, nullable=False)
    date_retour_reelle = Column(DateTime, nullable=True)
    statut          = Column(Enum(StatutEmprunt), default=StatutEmprunt.en_cours)
