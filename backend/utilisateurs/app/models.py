from sqlalchemy import Column, Integer, String, Enum
from .database import Base
import enum

class TypeUtilisateur(str, enum.Enum):
    etudiant = "etudiant"
    professeur = "professeur"
    personnel = "personnel"

class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id       = Column(Integer, primary_key=True, index=True)
    nom      = Column(String, nullable=False)
    prenom   = Column(String, nullable=False)
    email    = Column(String, unique=True, nullable=False)
    matricule = Column(String, unique=True, nullable=False)
    type     = Column(Enum(TypeUtilisateur), nullable=False)
