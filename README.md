🧟‍♂️ Zombieland
Zombieland is a full-stack application with a Next.js front-end and an Express API back-end, containerized using Docker for a clean and consistent development environment.

🚀 Features
✅ Next.js front-end
✅ Express API back-end
✅ Docker & Docker Compose for easy setup
✅ Hot reload during development
✅ Clean project structure for scalability

🛠️ Tech Stack
Front-end: Next.js, React, TypeScript

Back-end: Node.js, Express

Containerization: Docker, Docker Compose

⚙️ Prerequisites
Docker Desktop installed and running

Basic knowledge of Docker and Git

Terminal access

🚀 Running with Docker
Open your terminal, navigate to the root of the project, and run:

```bash
docker-compose up --build
```

This will build and launch both the front-end and back-end automatically:

Front-end: http://localhost:3000

Back-end API: http://localhost:5000

🛑 Stopping Containers
To stop the containers gracefully, press Ctrl + C in your terminal where Docker is running, then:

```bash
docker-compose down
```

🪓 Useful Commands
✅ View running containers:

```bash
docker ps
```

✅ View logs:

```bash
docker-compose logs -f
```

✅ Rebuild after changes in Docker configuration:

```bash
docker-compose up --build
```

✅ Remove unused images and free space:

```bash
docker system prune -af
```

📂 Project Structure

```bash
projet-zombieland/
├── back/          # Express API
├── front/         # Next.js Frontend
├── docker-compose.yml
└── README.md
```

👩‍💻 Contributing
Fork this repository

Create a new branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m 'Add your feature')

Push to the branch (git push origin feature/YourFeature)

Open a Pull Request

🪄 Roadmap
✅ Docker integration for front and back
✅ Development environment setup

🛠️ Upcoming features:

Authentication system

PostgreSQL integration

Unit and integration testing

🧩 License
This project is licensed under the MIT License.

🙌 Credits
Developed with ❤️ by [ZombieLand]