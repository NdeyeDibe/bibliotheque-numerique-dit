from sqlalchemy.orm import Session
from . import models, schemas

# Récupérer tous les livres
def get_livres(db: Session):
    return db.query(models.Livre).all()

# Récupérer un livre par son ID
def get_livre(db: Session, livre_id: int):
    return db.query(models.Livre).filter(models.Livre.id == livre_id).first()

# Récupérer un livre par son ISBN
def get_livre_by_isbn(db: Session, isbn: str):
    return db.query(models.Livre).filter(models.Livre.isbn == isbn).first()

# Rechercher des livres par titre, auteur ou ISBN
def search_livres(db: Session, terme: str):
    return db.query(models.Livre).filter(
        models.Livre.titre.ilike(f"%{terme}%") |
        models.Livre.auteur.ilike(f"%{terme}%") |
        models.Livre.isbn.ilike(f"%{terme}%")
    ).all()

# Créer un nouveau livre
def create_livre(db: Session, livre: schemas.LivreCreate):
    db_livre = models.Livre(**livre.model_dump())
    db.add(db_livre)
    db.commit()
    db.refresh(db_livre)
    return db_livre

# Mettre à jour un livre
def update_livre(db: Session, livre_id: int, livre: schemas.LivreUpdate):
    db_livre = get_livre(db, livre_id)
    if db_livre:
        for key, value in livre.model_dump(exclude_unset=True).items():
            setattr(db_livre, key, value)
        db.commit()
        db.refresh(db_livre)
    return db_livre

# Supprimer un livre
def delete_livre(db: Session, livre_id: int):
    db_livre = get_livre(db, livre_id)
    if db_livre:
        db.delete(db_livre)
        db.commit()
    return db_livre
