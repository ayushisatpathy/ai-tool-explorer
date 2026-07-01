# AI Tool Explorer

A full-stack web application that automatically scrapes AI tools from **AIxploria**, stores them in **Supabase**, and provides a modern dashboard to search, filter, browse, and favorite AI tools.

---

## Project Overview

This project was developed as part of a Full Stack Developer assessment to demonstrate backend development, frontend development, API design, database integration, web scraping, and responsive UI development.

The application consists of:

- **Next.js** frontend
- **FastAPI** backend
- **Supabase PostgreSQL** database
- Automated web scraping using **BeautifulSoup**
- Responsive dashboard
- Admin panel for triggering scrapes
- REST API
- Realtime updates using Supabase

The scraper currently extracts AI tools from **AIxploria**, stores them in the database, and updates existing records while preventing duplicates. The implementation is modular, making it easy to extend the scraper to additional AI tool directories in the future.

---

# Features

### Tool Explorer

- Browse AI tools
- Search tools by name
- Filter by category
- Filter by pricing model
- Mark tools as favorites
- Responsive interface
- Tool detail pages

---

### Admin Dashboard

- Trigger scraper manually
- View scrape history
- Monitor scraper status
- Automatic duplicate detection
- Refresh scrape history

---

### Web Scraping

The scraper currently:

- Fetches AI tools from AIxploria
- Extracts:
  - Tool name
  - Description
  - Logo
  - Categories
  - Pricing model
  - Website URL
- Stores data in Supabase
- Updates existing records without creating duplicates
- Automatically creates missing categories
- Maintains scrape history

Although the current implementation targets a single website, the scraper architecture is reusable and can be extended to scrape multiple AI tool directories in the future.

---

# Tech Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Backend

- FastAPI
- Python
- BeautifulSoup4
- HTTPX

## Database

- Supabase
- PostgreSQL

---

# Project Structure

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
├── screenshots/
│
├── .gitignore
└── README.md
```

---

# Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/ayushisatpathy/ai-tool-explorer.git

cd ai-tool-explorer
```

---

## 2. Configure Supabase

Create a Supabase project and execute:

```
supabase/schema.sql
```

---

## Backend Environment

Create:

```
backend/.env
```

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Frontend Environment

Create:

```
frontend/.env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

# Running the Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

# Running the Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend

```
http://localhost:3000
```

---

# Running the Scraper

Using Swagger UI or the Admin Dashboard, trigger:

```
POST /api/admin/scrape
```

The scraper will:

- Scrape AI tools from AIxploria
- Insert new tools
- Update existing tools
- Create categories automatically
- Store scrape history

---

# API Endpoints

| Method | Endpoint | Description |
|----------|----------------------------|----------------------------|
| GET | /api/tools | Get all tools |
| GET | /api/tools/{slug} | Get tool details |
| GET | /api/tools/categories | Get categories |
| POST | /api/tools/{id}/favorite | Toggle favorite |
| POST | /api/admin/scrape | Trigger scraper |
| GET | /api/admin/scrape/runs | Scrape history |

---

# Database Schema

The application uses the following tables:

- tools
- categories
- tool_categories
- favorites
- scrape_runs

---

# Screenshots

## Home Page

![Home Page](screenshots/01-homepage.png)

---

## Search Functionality

![Search](screenshots/02-search.png)

---

## Category Dropdown

![Category Dropdown](screenshots/03-category-dropdown.png)

---

## Category Filter

![Category Filter](screenshots/04-category-filter.png)

---

## Favorites

![Favorites](screenshots/05-favorites.png)

---

## Admin Dashboard

![Admin Dashboard](screenshots/06-admin-panel.png)

---

## Scraper Running

![Scraper Running](screenshots/07-scraper-running.png)

---

## Scrape History

![Scrape History](screenshots/08-scrape-history.png)

---

## Tool Details

![Tool Details](screenshots/09-tool-details.png)

---

## Tool Details (Example)

![Tool Details 2](screenshots/10-tool-details-2.png)

---

## Supabase Database

![Supabase](screenshots/11-supabase.png)

---

## Figma Design

![Figma](screenshots/12-figma-design.png)

---

# Learning Outcomes

During the development of this project, I gained practical experience with:

- Building a full-stack application using Next.js and FastAPI
- Designing REST APIs
- Integrating Supabase with PostgreSQL
- Implementing automated web scraping using BeautifulSoup
- Managing relational database models
- Preventing duplicate data during scraping
- Building reusable React components
- Implementing search, filtering, favorites, and responsive layouts
- Working with asynchronous API calls
- Using Supabase Realtime for live updates
- Debugging frontend-backend integration
- Understanding deployment workflows using Render and Vercel

Working through the project helped me better understand how frontend, backend, database, and scraping components interact within a complete web application.

---

# Future Improvements

- Support scraping from multiple AI directories
- Cache tool logos using Supabase Storage
- Scheduled scraping using cron jobs
- User authentication
- Personalized favorites
- Full-text search
- Sorting options
- Docker support
- Cloud deployment
- AI-powered recommendations

---

# Known Limitation

Some tool logos are hosted directly on AIxploria and may block external image requests (HTTP 403). In such cases, the application falls back to a generated placeholder icon. A production-ready solution would cache these images in Supabase Storage during scraping.

---

# Deployment

## Frontend

Vercel

```
https://ai-tool-explorer-git-main-ayushisatpathys-projects.vercel.app/
```

## Backend

Render

```
https://ai-tool-explorer-backend.onrender.com/
```

> **Note**
>
> The backend API is successfully deployed on Render.
>
> The project functions correctly in the local development environment. During production deployment, the frontend encountered an environment/configuration issue while communicating with the deployed backend API on Vercel. Due to the assessment timeline, the project is being submitted with complete source code, setup instructions, screenshots, and deployment links.

---

# Figma Design

https://www.figma.com/make/mADom0Xy3p41io01fZbxUL/AI-Tool-Explorer-Dashboard?t=VhA4iBiXnUGhHc41-1

---

# Author

**Ayushi Satpathy**

GitHub:
https://github.com/ayushisatpathy

LinkedIn:
https://linkedin.com/in/ayushi-satpathy-0389b0305
