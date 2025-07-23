# 🧟‍♂️ ZombieLand

**ZombieLand** est une application web full-stack développée pour simuler la gestion d’un parc d’attractions horrifique (mais fun).  
Elle propose une expérience immersive côté visiteur et un back-office complet côté admin.

---

## 🎢 Fonctionnalités

- 🎫 Réservation d’attractions avec gestion des disponibilités
- 🔐 Authentification sécurisée via JWT + cookies HttpOnly
- 🧑‍💼 Interface administrateur avec gestion CRUD des attractions
- 🗓️ Affichage dynamique des horaires
- 💬 Carrousel de témoignages clients
- 📱 Design responsive & animations frontend

---

## ⚙️ Stack Technique

### Frontend
- Next.js + React
- TypeScript
- Context API (auth & token)
- TailwindCSS + Lucide Icons

### Backend
- Node.js + Express
- PostgreSQL avec Sequelize ORM
- JWT Auth + gestion des sessions
- API RESTful documentée

### Containerisation
- Docker & Docker Compose pour l’environnement de dev

---

## 🚀 Lancer l'application

### ✅ Avec Docker

```bash
docker-compose up --build
```

Cela va builder et lancer automatiquement le front-end et le back-end :

🌐 Front-end : http://localhost:3000

🔙 Back-end API : http://localhost:5000

🛑  Arrêter les containers
Dans le terminal où Docker tourne, fais Ctrl + C, puis :

```bash
docker-compose down
```

🪓 Commandes utiles
✅ Voir les containers actifs

```bash
docker ps
```

✅ Voir les logs

```bash
docker-compose logs -f
```

✅ Rebuild complet

```bash
docker-compose up --build
```

✅ Nettoyer les images inutiles

```bash
docker system prune -af
```

📂Structure du projet

```bash
projet-zombieland/
├── back/          # Express API
├── front/         # Next.js Frontend
├── docker-compose.yml
└── README.md
```

👩‍💻 Contributeur
Fork ce repo

Crée une branche : 
```bash
git checkout -b feature/TonFeature
```
Commit : 
```bash
git commit -m 'Ajout de ton feature'
```
Push :
```bash
 git push origin feature/TonFeature
```
Ouvre une Pull Request ☕

🪄 Roadmap

✅ Déjà en place :

Docker pour front & back

Authentification JWT

Réservations + interface admin

Authentication system

PostgreSQL integration

🔜 À venir :
Unit and integration testing

🧩 Licence
Ce projet est sous licence MIT.

🙌 Credits
Développé avec ❤️ par l’équipe ZombieLand.