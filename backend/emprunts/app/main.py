from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .database import engine, SessionLocal, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microservice Emprunts")

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

# Lister tous les emprunts
@app.get("/api/emprunts/", response_model=list[schemas.Emprunt])
def read_emprunts(db: Session = Depends(get_db)):
    return crud.get_emprunts(db)

# Récupérer un emprunt par ID
@app.get("/api/emprunts/{emprunt_id}", response_model=schemas.Emprunt)
def read_emprunt(emprunt_id: int, db: Session = Depends(get_db)):
    db_emprunt = crud.get_emprunt(db, emprunt_id)
    if db_emprunt is None:
        raise HTTPException(status_code=404, detail="Emprunt introuvable")
    return db_emprunt

# Historique des emprunts d'un utilisateur
@app.get("/api/emprunts/utilisateur/{utilisateur_id}", response_model=list[schemas.Emprunt])
def read_emprunts_utilisateur(utilisateur_id: int, db: Session = Depends(get_db)):
    return crud.get_emprunts_by_utilisateur(db, utilisateur_id)

# Historique des emprunts d'un livre
@app.get("/api/emprunts/livre/{livre_id}", response_model=list[schemas.Emprunt])
def read_emprunts_livre(livre_id: int, db: Session = Depends(get_db)):
    return crud.get_emprunts_by_livre(db, livre_id)

# Emprunts en retard
@app.get("/api/emprunts/retards/", response_model=list[schemas.Emprunt])
def read_emprunts_en_retard(db: Session = Depends(get_db)):
    return crud.get_emprunts_en_retard(db)

# Créer un emprunt
@app.post("/api/emprunts/", response_model=schemas.Emprunt)
def create_emprunt(emprunt: schemas.EmpruntCreate, db: Session = Depends(get_db)):
    return crud.create_emprunt(db, emprunt)

# Retourner un livre
@app.put("/api/emprunts/{emprunt_id}/retour", response_model=schemas.Emprunt)
def retourner_livre(emprunt_id: int, retour: schemas.EmpruntRetour, db: Session = Depends(get_db)):
    db_emprunt = crud.retourner_livre(db, emprunt_id, retour)
    if db_emprunt is None:
        raise HTTPException(status_code=404, detail="Emprunt introuvable")
    return db_emprunt
