services:
  front:
    build: ./front
    container_name: zombieland-front
    ports:      
      - "3000:3000"
    volumes:
      - ./front:/app
      - /app/node_modules
    depends_on:
      - back
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/

  back:
    build: ./back
    container_name: zombieland-back
    ports:
      - "5000:5000"
    volumes:
      - ./back:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - db
    environment:
      NODE_ENV: development
      DB_PORT: 5432
      DB_NAME: zombieland
      DB_USER: zombieland
      DB_PASSWORD: zombieland

  db:
      image: postgres:15
      container_name: zombieland-db
      environment:
        POSTGRES_DB: zombieland
        POSTGRES_USER: zombieland
        POSTGRES_PASSWORD: zombieland
      volumes:
        - db-data:/var/lib/postgresql/data
      ports:
        - "5432:5432"

volumes:
  db-data:


