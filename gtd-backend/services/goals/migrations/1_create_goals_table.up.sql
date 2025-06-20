-- Create goals table
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on created_at for efficient ordering
CREATE INDEX idx_goals_created_at ON goals(created_at DESC); 