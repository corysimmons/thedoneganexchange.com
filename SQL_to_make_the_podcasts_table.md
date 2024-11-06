Run this on neon.tech if your database is not already created.

```sql
-- Only create the helper function if it doesn't exist
DO $do$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_timestamp_column') THEN
    CREATE OR REPLACE FUNCTION update_timestamp_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
  END IF;
END $do$;

-- Create the podcasts table if it doesn't exist
CREATE TABLE IF NOT EXISTS podcasts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  notes TEXT, -- Allows NULL for Markdown content
  audio_url TEXT, -- Allows NULL
  video_url TEXT, -- Allows NULL
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create the trigger only if it doesn't exist
DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_timestamp'
  ) THEN
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE ON podcasts
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();
  END IF;
END $do$;
```
