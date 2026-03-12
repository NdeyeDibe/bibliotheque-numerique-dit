from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .database import engine, SessionLocal, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microservice Livres")

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

# Lister tous les livres
@app.get("/api/livres/", response_model=list[schemas.Livre])
def read_livres(db: Session = Depends(get_db)):
    return crud.get_livres(db)

# Rechercher des livres
@app.get("/api/livres/search/", response_model=list[schemas.Livre])
def search_livres(terme: str, db: Session = Depends(get_db)):
    return crud.search_livres(db, terme)


# Récupérer un livre par ID
@app.get("/api/livres/{livre_id}", response_model=schemas.Livre)
def read_livre(livre_id: int, db: Session = Depends(get_db)):
    db_livre = crud.get_livre(db, livre_id)
    if db_livre is None:
        raise HTTPException(status_code=404, detail="Livre introuvable")
    return db_livre

# Créer un livre
@app.post("/api/livres/", response_model=schemas.Livre)
def create_livre(livre: schemas.LivreCreate, db: Session = Depends(get_db)):
    existing = crud.get_livre_by_isbn(db, livre.isbn)
    if existing:
        raise HTTPException(status_code=400, detail=f"ISBN '{livre.isbn}' déjà utilisé")
    return crud.create_livre(db, livre)

# Modifier un livre
@app.put("/api/livres/{livre_id}", response_model=schemas.Livre)
def update_livre(livre_id: int, livre: schemas.LivreUpdate, db: Session = Depends(get_db)):
    db_livre = crud.update_livre(db, livre_id, livre)
    if db_livre is None:
        raise HTTPException(status_code=404, detail="Livre introuvable")
    return db_livre

# Supprimer un livre
@app.delete("/api/livres/{livre_id}")
def delete_livre(livre_id: int, db: Session = Depends(get_db)):
    db_livre = crud.delete_livre(db, livre_id)
    if db_livre is None:
        raise HTTPException(status_code=404, detail="Livre introuvable")
    return {"message": "Livre supprimé avec succès"}
