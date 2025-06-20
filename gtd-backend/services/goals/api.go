package goals

import (
	"context"
	"time"

	"encore.dev/storage/sqldb"
)

// Database instance
var db = sqldb.NewDatabase("goals", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

// Goal represents a user's big-picture objective.
type Goal struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"createdAt"`
}

// CreateGoalParams represents the parameters for creating a new goal.
type CreateGoalParams struct {
	Title string `json:"title"`
}

// ListGoalsResponse represents the response for listing goals.
type ListGoalsResponse struct {
	Goals []*Goal `json:"goals"`
}

// encore:api public method=POST path=/goals
func CreateGoal(ctx context.Context, params CreateGoalParams) (*Goal, error) {
	g := Goal{
		Title:     params.Title,
		CreatedAt: time.Now(),
	}
	if err := db.QueryRow(ctx, `
		INSERT INTO goals (title, created_at) 
		VALUES ($1, $2) 
		RETURNING id, title, created_at
	`, params.Title, g.CreatedAt).Scan(&g.ID, &g.Title, &g.CreatedAt); err != nil {
		return nil, err
	}
	return &g, nil
}

// encore:api public method=GET path=/goals
func ListGoals(ctx context.Context) (*ListGoalsResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT id, title, created_at 
		FROM goals 
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var goals []*Goal
	for rows.Next() {
		var g Goal
		if err := rows.Scan(&g.ID, &g.Title, &g.CreatedAt); err != nil {
			return nil, err
		}
		goals = append(goals, &g)
	}
	return &ListGoalsResponse{Goals: goals}, nil
}
