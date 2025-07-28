-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subcategories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Opportunities table  
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  salary_range TEXT,
  type TEXT,
  url TEXT,
  location TEXT,
  skills TEXT[],
  experience TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Update logs table for tracking cron job runs
CREATE TABLE IF NOT EXISTS update_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  opportunities_updated INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  details JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_company ON opportunities(company);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_active ON opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_skills ON opportunities USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities(created_at);
CREATE INDEX IF NOT EXISTS idx_update_logs_timestamp ON update_logs(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY IF NOT EXISTS "Public read access for categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read access for opportunities" ON opportunities
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "Public read access for update_logs" ON update_logs
  FOR SELECT USING (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update the updated_at column
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at 
    BEFORE UPDATE ON opportunities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up old opportunities (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_opportunities()
RETURNS void AS $$
BEGIN
    UPDATE opportunities 
    SET is_active = false 
    WHERE created_at < NOW() - INTERVAL '30 days' 
    AND is_active = true;
    
    INSERT INTO update_logs (id, action, opportunities_updated, status)
    VALUES (
        'cleanup_' || extract(epoch from now()),
        'cleanup_old_opportunities',
        (SELECT COUNT(*) FROM opportunities WHERE is_active = false AND created_at < NOW() - INTERVAL '30 days'),
        'success'
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to call the daily update edge function
CREATE OR REPLACE FUNCTION trigger_daily_update()
RETURNS void AS $$
DECLARE
    response TEXT;
BEGIN
    -- This will be called by the cron job
    -- The actual API call will be made by the cron service
    INSERT INTO update_logs (id, action, status)
    VALUES (
        'trigger_' || extract(epoch from now()),
        'trigger_daily_update',
        'initiated'
    );
END;
$$ LANGUAGE plpgsql;