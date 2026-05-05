# Lyrics Video Local App

Stack now includes:

- `frontend/`: Next.js App Router
- Frontend libs: `zustand`, `zod`, `@tanstack/react-query`
- UI: latest `Tailwind CSS v4` + `shadcn/ui` structure
- Auth + DB API routes inside Next.js
- Database: `PostgreSQL + Prisma`
- `backend/`: FastAPI render engine (FFmpeg upload/render/download)

## Architecture

1. User logs in/registers through Next.js route handlers.
2. JWT cookie (`httpOnly`) is set by Next.js.
3. Upload goes to FastAPI render engine (`/projects/upload`).
4. Project metadata is saved in PostgreSQL via Prisma.
5. Frontend reads user projects from DB and can trigger render/refresh/download.

## 1) Configure Frontend Env

```bash
cd frontend
copy .env.example .env.local
```

Update values in `.env.local` if needed.

## 2) Prisma Setup (PostgreSQL)

```bash
cd frontend
npm install
npx prisma generate
npx prisma migrate dev --name init_auth_projects
```

## 3.1) (Optional) Sync with shadcn CLI

If you want to add more official shadcn components directly:

```bash
cd frontend
npx shadcn@latest init
npx shadcn@latest add button card input textarea label
```

## 3) Run Frontend

```bash
cd frontend
npm run dev
```

Frontend: `http://127.0.0.1:3000`

## 4) Run Backend Render Engine

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend: `http://127.0.0.1:8000`

## API Notes

### Next.js Auth/DB

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `PATCH /api/projects/:id`

### FastAPI Render Engine

- `POST /projects/upload`
- `POST /projects/{id}/render`
- `GET /projects/{id}`
- `GET /projects/{id}/download`

## Important

- FFmpeg must be installed and available in system PATH.
- This starter keeps render files local under `backend/data/`.
- DB currently stores project metadata and ownership; media files remain local files.
- Tailwind v4 is configured via `postcss.config.mjs` and `app/globals.css`.
