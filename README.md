# TIER LIST

Az oldal Vite környezetben, React pluginnal készült frontenddel és Node JS backenddel rendelkezik. Ez egy anime témára specializálódott Tier List weboldala.

## Környezeti változók (.env)

A backend telepítése és futtatása előtt szükséges beállítani a .env fájl tartalmát. Ez a fájl alapértelmezetten megtalálható a repository-ban, de amennyiben törölné a Github, akkor a .env.example átnevezésével is ugyanazt az eredményt érjük el.

### .env tartalma

```dotenv
# Backend portja
PORT=<port>

# Adatbázis adatok
DB_HOST=<database_host>
DB_USER=<database_username>
DB_PASS=<database_password>
DB_NAME=<database_name>

# JWT Token
ACCESS_SECRET=<access_token_secret>

# Resend Kulcs
RESEND_KEY=<resend_api_key>
```

## Telepítés

### Repository letöltése

Amennyiben még nincsenek meg a fájlok, akkor klónozzuk le a repositoryt vagy töltsük le a kódot.

```bash
git clone https://github.com/keitajs/tier-list.git
```

### Package letöltés

A frontend és backend Node alapú. Én ``bun``-t használtam, de ``npm``-el is működik.

#### Frontend

```bash
cd ./frontend
bun install

# Production
bun run build
bun serve

# Development
bun dev
```

#### Backend

```bash
cd ./backend
bun install

# Production
bun start

# Development
bun dev
```

### Docker

A Dockerhez szükséges konfigurációk megtalálhatóak a fájlok között. A parancs lefuttatásához a repository főkönyvtárában kell lennünk.

```bash
docker compose up --build -d
```
