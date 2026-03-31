-- Initialization script for development database
-- This runs once when the postgres container is first created

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create a generic health check table
CREATE TABLE IF NOT EXISTS _health (
    id SERIAL PRIMARY KEY,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);
