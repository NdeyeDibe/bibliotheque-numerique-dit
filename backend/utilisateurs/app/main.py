from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .database import engine, SessionLocal, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microservice Utilisateurs")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dépendance session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Lister tous les utilisateurs
@app.get("/api/utilisateurs/", response_model=list[schemas.Utilisateur])
def read_utilisateurs(db: Session = Depends(get_db)):
    return crud.get_utilisateurs(db)

# Récupérer un utilisateur par ID
@app.get("/api/utilisateurs/{utilisateur_id}", response_model=schemas.Utilisateur)
def read_utilisateur(utilisateur_id: int, db: Session = Depends(get_db)):
    db_utilisateur = crud.get_utilisateur(db, utilisateur_id)
    if db_utilisateur is None:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return db_utilisateur

# Consulter le profil d'un utilisateur
@app.get("/api/utilisateurs/{utilisateur_id}/profil", response_model=schemas.Utilisateur)
def get_profil(utilisateur_id: int, db: Session = Depends(get_db)):
    db_utilisateur = crud.get_utilisateur(db, utilisateur_id)
    if db_utilisateur is None:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return db_utilisateur


# Créer un utilisateur
@app.post("/api/utilisateurs/", response_model=schemas.Utilisateur)
def create_utilisateur(utilisateur: schemas.UtilisateurCreate, db: Session = Depends(get_db)):
    if crud.get_utilisateur_by_email(db, utilisateur.email):
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    if crud.get_utilisateur_by_matricule(db, utilisateur.matricule):
        raise HTTPException(status_code=400, detail="Matricule déjà utilisé")
    return crud.create_utilisateur(db, utilisateur)

# Modifier un utilisateur
@app.put("/api/utilisateurs/{utilisateur_id}", response_model=schemas.Utilisateur)
def update_utilisateur(utilisateur_id: int, utilisateur: schemas.UtilisateurUpdate, db: Session = Depends(get_db)):
    db_utilisateur = crud.update_utilisateur(db, utilisateur_id, utilisateur)
    if db_utilisateur is None:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return db_utilisateur

# Supprimer un utilisateur
@app.delete("/api/utilisateurs/{utilisateur_id}")
def delete_utilisateur(utilisateur_id: int, db: Session = Depends(get_db)):
    db_utilisateur = crud.delete_utilisateur(db, utilisateur_id)
    if db_utilisateur is None:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return {"message": "Utilisateur supprimé avec succès"}
