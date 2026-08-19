# ClimasyncAI Backend

This is the FastAPI backend for the ClimasyncAI project.

## Setup Instructions

1. **Install PostgreSQL & PostGIS**: Follow the guide in `backend_setup_guide.md`.
2. **Create Database**: Create a database named `climasync_db` in pgAdmin.

## Running Locally

1. Open a terminal in this directory.
2. Create and activate virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```powershell
   pip install fastapi uvicorn sqlalchemy geoalchemy2 asyncpg alembic psycopg2-binary
   ```
4. Update `database.py` with your PostgreSQL password.
5. Run the server:
   ```powershell
   uvicorn main:app --reload
   ```
6. Visit `http://127.0.0.1:8000/docs` to test the API.
