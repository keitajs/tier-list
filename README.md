# TIER LIST

Az oldal Vite környezetben, React pluginnal készült frontenddel és Node JS backenddel rendelkezik. Ez egy anime témára specializálódott Tier List weboldala.

## Környezeti változók (.env)

A backend telepítése és futtatása előtt szükséges beállítani a .env fájl tartalmát. Ez a fájl alapértelmezetten megtalálható a repository-ban, de amennyiben törölné a Github, akkor a .env.example átnevezésével is ugyanazt az eredményt érjük el.

### .env tartalma

```dotenv
# Backend portja
PORT=2000

# Adatbázis adatok
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=tier-list

# JWT Token
ACCESS_SECRET=xdAKLSDmcalscemA4cmJMCum4c5jskCM

# Resend Kulcs
RESEND_KEY=re_4DRKtUsP_Hma4jULpQXoCay5kwRjy8NMm
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
bun run dev
```

#### Backend

```bash
cd ./backend
bun install

# Production
bun run start

# Development
bun run dev
```

### Docker

A Dockerhez szükséges konfigurációk megtalálhatóak a fájlok között. A parancs lefuttatásához a repository főkönyvtárában kell lennünk.

```bash
docker compose up --build -d
```
