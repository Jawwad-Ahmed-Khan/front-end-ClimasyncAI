from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .database import engine, Base, get_db
from .models import DisasterEvent
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

# LIFESPAN MANAGER
# This runs when the app starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (Simple approach for dev)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="ClimasyncAI API", lifespan=lifespan)

# CORS (Allow frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "ClimasyncAI Geospatial Backend Running 🚀"}

@app.post("/disasters/")
async def create_disaster(
    title: str, 
    type: str, 
    lat: float, 
    lng: float, 
    severity: float, 
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new disaster event with geospatial location.
    NOTE: PostGIS uses (Longitude, Latitude) order for points.
    """
    try:
        # Create WKT (Well-Known Text) point
        wkt_point = f'POINT({lng} {lat})' 
        
        new_event = DisasterEvent(
            title=title, 
            type=type, 
            location=wkt_point, 
            severity=severity
        )
        
        db.add(new_event)
        await db.commit()
        await db.refresh(new_event)
        
        return {
            "status": "success", 
            "id": new_event.id, 
            "message": f"Disaster '{title}' created at {lat}, {lng}"
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/disasters/")
async def get_disasters(db: AsyncSession = Depends(get_db)):
    """
    Get all disasters.
    TODO: Add geospatial filtering (within radius) in proper implementation.
    """
    result = await db.execute(select(DisasterEvent))
    events = result.scalars().all()
    return events
