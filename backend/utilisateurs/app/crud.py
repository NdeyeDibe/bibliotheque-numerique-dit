from sqlalchemy.orm import Session
from . import models, schemas

# Récupérer tous les utilisateurs
def get_utilisateurs(db: Session):
    return db.query(models.Utilisateur).all()

# Récupérer un utilisateur par son ID
def get_utilisateur(db: Session, utilisateur_id: int):
    return db.query(models.Utilisateur).filter(
        models.Utilisateur.id == utilisateur_id
    ).first()

# Récupérer un utilisateur par son email
def get_utilisateur_by_email(db: Session, email: str):
    return db.query(models.Utilisateur).filter(
        models.Utilisateur.email == email
    ).first()

# Récupérer un utilisateur par son matricule
def get_utilisateur_by_matricule(db: Session, matricule: str):
    return db.query(models.Utilisateur).filter(
        models.Utilisateur.matricule == matricule
    ).first()

# Créer un nouvel utilisateur
def create_utilisateur(db: Session, utilisateur: schemas.UtilisateurCreate):
    db_utilisateur = models.Utilisateur(**utilisateur.model_dump())
    db.add(db_utilisateur)
    db.commit()
    db.refresh(db_utilisateur)
    return db_utilisateur

# Mettre à jour un utilisateur
def update_utilisateur(db: Session, utilisateur_id: int, utilisateur: schemas.UtilisateurUpdate):
    db_utilisateur = get_utilisateur(db, utilisateur_id)
    if db_utilisateur:
        for key, value in utilisateur.model_dump(exclude_unset=True).items():
            setattr(db_utilisateur, key, value)
        db.commit()
        db.refresh(db_utilisateur)
    return db_utilisateur

# Supprimer un utilisateur
def delete_utilisateur(db: Session, utilisateur_id: int):
    db_utilisateur = get_utilisateur(db, utilisateur_id)
    if db_utilisateur:
        db.delete(db_utilisateur)
        db.commit()
    return db_utilisateur
