from pydantic import BaseModel
from typing import Optional

# Données de base communes
class LivreBase(BaseModel):
    titre: str
    auteur: str
    isbn: str
    quantite: int = 1
    disponible: bool = True

# Pour créer un livre (ce que le frontend envoie)
class LivreCreate(LivreBase):
    pass

# Pour mettre à jour un livre (tous les champs optionnels)
class LivreUpdate(BaseModel):
    titre: Optional[str] = None
    auteur: Optional[str] = None
    isbn: Optional[str] = None
    quantite: Optional[int] = None
    disponible: Optional[bool] = None

# Pour lire un livre (ce que l'API renvoie)
class Livre(LivreBase):
    id: int

    class Config:
        from_attributes = True
