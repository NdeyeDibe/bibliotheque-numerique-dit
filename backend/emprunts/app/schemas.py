from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .models import StatutEmprunt

# Données de base communes
class EmpruntBase(BaseModel):
    livre_id: int
    utilisateur_id: int
    date_retour_prevue: datetime

# Pour créer un emprunt
class EmpruntCreate(EmpruntBase):
    pass

# Pour retourner un livre
class EmpruntRetour(BaseModel):
    date_retour_reelle: datetime

# Pour lire un emprunt
class Emprunt(EmpruntBase):
    id: int
    date_emprunt: datetime
    date_retour_reelle: Optional[datetime] = None
    statut: StatutEmprunt

    class Config:
        from_attributes = True
