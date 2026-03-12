# 📖 Bibliothèque Numérique DIT

Projet DevOps — Master 1 Intelligence Artificielle
Dakar Institute of Technology

## 📋 Description

Plateforme web moderne de gestion de bibliothèque académique basée sur une architecture microservices.

## 🏗️ Architecture
```
Frontend React (port 3000)
        │
        ├── Microservice Livres (port 8001)
        │       └── PostgreSQL db_livres
        │
        ├── Microservice Utilisateurs (port 8002)
        │       └── PostgreSQL db_utilisateurs
        │
        └── Microservice Emprunts (port 8003)
                └── PostgreSQL db_emprunts
```

## 🛠️ Technologies

- **Frontend** : React.js
- **Backend** : FastAPI (Python)
- **Base de données** : PostgreSQL
- **Conteneurisation** : Docker & Docker Compose
- **CI/CD** : Jenkins
- **Versioning** : Git & GitHub

## 🚀 Installation et lancement

### Prérequis
- Docker Desktop installé et démarré
- Git installé

### Cloner le projet
```bash
git clone git@github.com:NdeyeDibe/bibliotheque-numerique-dit.git
cd bibliotheque-numerique-dit
```

### Lancer avec Docker Compose
```bash
docker compose up -d --build
```

### Accès aux services
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API Livres | http://localhost:8001/docs |
| API Utilisateurs | http://localhost:8002/docs |
| API Emprunts | http://localhost:8003/docs |

### Arrêter les services
```bash
docker compose down
```

## 📁 Structure du projet
```
bibliotheque-numerique-dit/
├── backend/
│   ├── livres/
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── crud.py
│   │   │   └── database.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── utilisateurs/
│   │   └── ... (même structure)
│   └── emprunts/
│       └── ... (même structure)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

## 🔄 Pipeline CI/CD Jenkins

Le pipeline Jenkins effectue automatiquement les étapes suivantes à chaque push sur GitHub :

1. Récupération du code depuis GitHub
2. Vérification de l'environnement Docker
3. Build des images Docker
4. Arrêt des anciens conteneurs
5. Déploiement avec Docker Compose
6. Vérification des conteneurs

## 📡 Endpoints API

### Livres
| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/livres/ | Lister tous les livres |
| GET | /api/livres/{id} | Récupérer un livre |
| GET | /api/livres/search/?terme= | Rechercher des livres |
| POST | /api/livres/ | Créer un livre |
| PUT | /api/livres/{id} | Modifier un livre |
| DELETE | /api/livres/{id} | Supprimer un livre |

### Utilisateurs
| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/utilisateurs/ | Lister tous les utilisateurs |
| GET | /api/utilisateurs/{id} | Récupérer un utilisateur |
| GET | /api/utilisateurs/{id}/profil | Consulter le profil |
| POST | /api/utilisateurs/ | Créer un utilisateur |
| PUT | /api/utilisateurs/{id} | Modifier un utilisateur |
| DELETE | /api/utilisateurs/{id} | Supprimer un utilisateur |

### Emprunts
| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/emprunts/ | Lister tous les emprunts |
| GET | /api/emprunts/{id} | Récupérer un emprunt |
| GET | /api/emprunts/utilisateur/{id} | Historique utilisateur |
| GET | /api/emprunts/livre/{id} | Historique livre |
| GET | /api/emprunts/retards/ | Emprunts en retard |
| POST | /api/emprunts/ | Créer un emprunt |
| PUT | /api/emprunts/{id}/retour | Retourner un livre |

## 👩‍💻 Auteur

**Ndeye Dibe Faye**
Master 1 Intelligence Artificielle — DIT
