from pydantic import BaseModel, EmailStr
from typing import Optional
from .models import TypeUtilisateur

# Données de base communes
class UtilisateurBase(BaseModel):
    nom: str
    prenom: str
    email: str
    matricule: str
    type: TypeUtilisateur

# Pour créer un utilisateur
class UtilisateurCreate(UtilisateurBase):
    pass

# Pour mettre à jour un utilisateur
class UtilisateurUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    email: Optional[str] = None
    matricule: Optional[str] = None
    type: Optional[TypeUtilisateur] = None

# Pour lire un utilisateur
class Utilisateur(UtilisateurBase):
    id: int

    class Config:
        from_attributes = True
