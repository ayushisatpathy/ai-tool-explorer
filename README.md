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

# AI Tool Explorer

A full-stack web application that automatically scrapes AI tools from **AIxploria**, stores them in **Supabase**, and provides a searchable interface to browse, filter, and favorite AI tools.

---

#  Live Demo

## Frontend (Vercel)

🔗 **https://ai-tool-explorer-git-main-ayushisatpathys-projects.vercel.app/**

## Backend API (Render)

🔗 **https://ai-tool-explorer-backend.onrender.com/**

### API Documentation (Swagger)

🔗 **https://ai-tool-explorer-backend.onrender.com/docs**

### Figma Design

🔗 **https://www.figma.com/make/mADom0Xy3p41io01fZbxUL/AI-Tool-Explorer-Dashboard?t=VhA4iBiXnUGhHc41-1**

---

# Screenshots

## Home Page

![Home Page](screenshots/01-homepage.png)
<img width="1918" height="903" alt="Screenshot 2026-07-01 152556" src="https://github.com/user-attachments/assets/e3ed4bb8-7998-4673-aed7-06391ee52984" />


---

## Search Functionality

![Search](screenshots/02-search.png)
<img width="1912" height="863" alt="Screenshot 2026-07-01 152647" src="https://github.com/user-attachments/assets/991c5c13-6807-4559-bcf0-6c92ab6c561e" />


---

## Category Dropdown

![Category Dropdown](screenshots/03-category-dropdown.png)
<img width="1915" height="910" alt="Screenshot 2026-07-01 152722" src="https://github.com/user-attachments/assets/4329630b-325a-4603-b4c6-fa81b0316616" />


---

## Category Filter

![Category Filter](screenshots/04-category-filter.png)
<img width="1918" height="903" alt="Screenshot 2026-07-01 152745" src="https://github.com/user-attachments/assets/1b92e7eb-473e-48ab-9d3f-1198da00b59f" />


---

## Favorites

![Favorites](screenshots/05-favorites.png)
<img width="1918" height="897" alt="Screenshot 2026-07-01 152810" src="https://github.com/user-attachments/assets/ee7e22e3-54f5-434a-88d9-ebd9a705c94b" />


---

## Admin Dashboard

![Admin Dashboard](screenshots/06-admin-panel.png)
<img width="1917" height="907" alt="Screenshot 2026-07-01 152844" src="https://github.com/user-attachments/assets/1d1a2570-ee4d-44f6-aba3-fb54395aa9b8" />


---

## Scraper Running

![Scraper Running](screenshots/07-scraper-running.png)
<img width="1898" height="843" alt="Screenshot 2026-07-01 152920" src="https://github.com/user-attachments/assets/53c5bf94-8062-41d4-b78d-4a4089c87ded" />


---

## Scrape History

![Scrape History](screenshots/08-scrape-history.png)
<img width="1895" height="902" alt="Screenshot 2026-07-01 153017" src="https://github.com/user-attachments/assets/c489c086-f54c-49ab-9114-a876d63ab53b" />



---


## Tool Details (Example)

![Tool Details 2](screenshots/10-tool-details-2.png)
<img width="1918" height="897" alt="Screenshot 2026-07-01 153116" src="https://github.com/user-attachments/assets/a63f52d5-bf03-4454-a939-eb6c68e731ae" />


---

## Supabase Database

![Supabase](screenshots/11-supabase.png)
<img width="1893" height="802" alt="Screenshot 2026-07-01 153451" src="https://github.com/user-attachments/assets/8efad363-de5b-4fd5-b696-419d983f48e7" />


---

## Figma Design

![Figma](screenshots/12-figma-design.png)
<img width="1896" height="863" alt="Screenshot 2026-07-01 153536" src="https://github.com/user-attachments/assets/1a2fae7d-51ee-4a67-82d9-e52c6b164fee" />


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


# Author

**Ayushi Satpathy**

GitHub:
https://github.com/ayushisatpathy

LinkedIn:
https://linkedin.com/in/ayushi-satpathy-0389b0305
