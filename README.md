# AI Tool Explorer

A full-stack web application that automatically scrapes AI tools from AIxploria, stores them in Supabase, and provides a searchable interface to browse, filter, and favorite tools.

## Features

- Search AI tools by name
- Filter by category
- Filter by pricing model (Free, Freemium, Paid, Trial)
- Mark tools as favorites
- View detailed information for each tool
- Automated web scraping
- Supabase database integration
- FastAPI REST API
- Next.js frontend
- Real-time updates using Supabase Realtime

---

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Python
- BeautifulSoup4
- HTTPX

### Database

- Supabase
- PostgreSQL

---

## Project Structure

```
project/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── supabase/
│   └── schema.sql
│
├── .gitignore
└── README.md
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-tool-explorer.git
cd ai-tool-explorer
```

### 2. Configure Supabase

Create a Supabase project and execute the SQL script located in:

```
supabase/schema.sql
```

Create the following environment files.

**Backend (`backend/.env`)**

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend (`frontend/.env.local`)**

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Running the Backend

```bash
cd backend

python -m pip install -r requirements.txt

python -m uvicorn app.main:app --reload
```

Backend URL:

```
http://localhost:8000
```

API Documentation:

```
http://localhost:8000/docs
```

---

## Running the Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```
http://localhost:3000
```

---

## Running the Scraper

Use the Swagger documentation to trigger:

```
POST /api/admin/scrape
```

The scraper will:

- Fetch AI tools from AIxploria
- Store new tools in Supabase
- Update existing tools
- Create categories automatically

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/tools` | Retrieve all tools |
| GET | `/api/tools/{slug}` | Retrieve a tool by slug |
| GET | `/api/tools/categories` | Retrieve all categories |
| POST | `/api/tools/{id}/favorite` | Toggle favorite status |
| POST | `/api/admin/scrape` | Trigger the scraper |
| GET | `/api/admin/scrape/runs` | Retrieve scrape history |

---

## Database Schema

The application uses five primary tables:

- `tools`
- `categories`
- `tool_categories`
- `favorites`
- `scrape_runs`

---

## Future Improvements

- User authentication
- User-specific favorites
- AI-powered recommendations
- Advanced search and filtering
- Scheduled scraping
- Docker support
- Cloud deployment

---

## Author

**Ayushi Satpathy**

- GitHub: https://github.com/ayushisatpathy
- LinkedIn: https://linkedin.com/in/ayushi-satpathy-0389b0305

---

## License

This project is licensed under the MIT License.
