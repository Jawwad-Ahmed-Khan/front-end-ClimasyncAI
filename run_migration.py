import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv('f:\\ClimasyncAI_backend\\.env')
load_dotenv('f:\\ClimasyncAI_backend\\.env.local')

engine = create_async_engine(
    os.getenv('DATABASE_URL').replace('postgresql://', 'postgresql+asyncpg://'),
    connect_args={
        "statement_cache_size": 0,
        "prepared_statement_cache_size": 0,
    }
)

async def run():
    async with engine.begin() as conn:
        sql = open('f:\\ClimasyncAI_backend\\scripts\\migrations\\add_messaging_tables.sql').read()
        statements = [s.strip() for s in sql.split(';') if s.strip()]
        for stmt in statements:
            await conn.execute(text(stmt))
        print('Migration applied!')

asyncio.run(run())
