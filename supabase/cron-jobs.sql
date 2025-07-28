-- Enable the pg_cron extension (requires superuser privileges)
-- This should be run by Supabase administrators or via the Supabase dashboard

-- Daily data update job - runs every day at 2 AM UTC
SELECT cron.schedule(
    'daily-opportunities-update',
    '0 2 * * *',
    $$ 
    SELECT net.http_post(
        url := 'https://your-project-id.supabase.co/functions/v1/daily-data-update',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.supabase_service_role_key') || '"}'::jsonb
    );
    $$
);

-- Weekly cleanup job - runs every Sunday at 3 AM UTC  
SELECT cron.schedule(
    'weekly-cleanup',
    '0 3 * * 0',
    'SELECT cleanup_old_opportunities();'
);

-- Alternative approach using webhooks if pg_cron is not available
-- This creates a webhook that can be called by external cron services like GitHub Actions or Vercel Cron

CREATE OR REPLACE FUNCTION webhook_daily_update(webhook_secret TEXT DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
    result JSON;
    expected_secret TEXT := current_setting('app.webhook_secret', true);
BEGIN
    -- Verify webhook secret if configured
    IF expected_secret IS NOT NULL AND (webhook_secret IS NULL OR webhook_secret != expected_secret) THEN
        RETURN '{"error": "Unauthorized", "status": 401}'::JSON;
    END IF;

    -- Log the webhook call
    INSERT INTO update_logs (id, action, status, details)
    VALUES (
        'webhook_' || extract(epoch from now()),
        'webhook_daily_update',
        'started',
        '{"triggered_by": "webhook", "timestamp": "' || NOW() || '"}'::JSONB
    );

    -- Return success response
    result := '{"success": true, "message": "Daily update webhook triggered", "timestamp": "' || NOW() || '"}'::JSON;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for monitoring cron job status
CREATE OR REPLACE VIEW cron_job_status AS
SELECT 
    action,
    COUNT(*) as total_runs,
    MAX(timestamp) as last_run,
    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_runs,
    SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as failed_runs,
    AVG(opportunities_updated) as avg_opportunities_updated
FROM update_logs 
WHERE action IN ('daily_update', 'webhook_daily_update', 'cleanup_old_opportunities')
GROUP BY action
ORDER BY last_run DESC;