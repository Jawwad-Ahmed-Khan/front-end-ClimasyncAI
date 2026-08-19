from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# UPDATE THIS WITH YOUR PASSWORD
# Format: postgresql+asyncpg://user:password@host:port/dbname
DATABASE_URL = "postgresql+asyncpg://postgres:admin@localhost/climasync_db"

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
