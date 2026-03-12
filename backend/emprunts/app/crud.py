from sqlalchemy.orm import Session
from datetime import datetime
from . import models, schemas

def get_emprunts(db: Session):
    return db.query(models.Emprunt).all()

def get_emprunt(db: Session, emprunt_id: int):
    return db.query(models.Emprunt).filter(
        models.Emprunt.id == emprunt_id
    ).first()

def get_emprunts_by_utilisateur(db: Session, utilisateur_id: int):
    return db.query(models.Emprunt).filter(
        models.Emprunt.utilisateur_id == utilisateur_id
    ).all()

def get_emprunts_by_livre(db: Session, livre_id: int):
    return db.query(models.Emprunt).filter(
        models.Emprunt.livre_id == livre_id
    ).all()

def create_emprunt(db: Session, emprunt: schemas.EmpruntCreate):
    db_emprunt = models.Emprunt(**emprunt.model_dump())
    db.add(db_emprunt)
    db.commit()
    db.refresh(db_emprunt)
    return db_emprunt

def retourner_livre(db: Session, emprunt_id: int, retour: schemas.EmpruntRetour):
    db_emprunt = get_emprunt(db, emprunt_id)
    if db_emprunt:
        db_emprunt.date_retour_reelle = retour.date_retour_reelle
        date_retour = retour.date_retour_reelle.replace(tzinfo=None)
        date_prevue = db_emprunt.date_retour_prevue.replace(tzinfo=None)
        if date_retour > date_prevue:
            db_emprunt.statut = models.StatutEmprunt.en_retard
        else:
            db_emprunt.statut = models.StatutEmprunt.retourne
        db.commit()
        db.refresh(db_emprunt)
    return db_emprunt

def get_emprunts_en_retard(db: Session):
    now = datetime.now()
    emprunts = db.query(models.Emprunt).filter(
        models.Emprunt.statut == models.StatutEmprunt.en_cours,
        models.Emprunt.date_retour_prevue < now
    ).all()
    for emprunt in emprunts:
        emprunt.statut = models.StatutEmprunt.en_retard
    db.commit()
    return emprunts
