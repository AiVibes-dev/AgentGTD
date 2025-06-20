// encore:service tasks
package tasks

import (
	"context"
	"time"

	"encore.dev/storage/sqldb"
)

// Database reference - connects to the "goals" service's database
var db = sqldb.Named("goals")

// Task is a single actionable step under a Goal.
type Task struct {
	ID        int       `json:"id"`
	GoalID    int       `json:"goal_id"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"createdAt"`
}

// CreateTaskParams represents the parameters for creating a new task.
type CreateTaskParams struct {
	GoalID int    `json:"goal_id"`
	Title  string `json:"title"`
}

// ListTasksParams represents the parameters for listing tasks.
type ListTasksParams struct {
	GoalID int `json:"goal_id"`
}

// ListTasksResponse represents the response for listing tasks.
type ListTasksResponse struct {
	Tasks []*Task `json:"tasks"`
}

// UpdateTaskParams represents the parameters for updating a task.
type UpdateTaskParams struct {
	TaskID    int  `json:"taskId"`
	Completed bool `json:"completed"`
}

// CreateTask creates a new Task under a specific Goal.
//
// encore:api public method=POST path=/tasks
func CreateTask(ctx context.Context, params CreateTaskParams) (*Task, error) {
	t := Task{
		GoalID:    params.GoalID,
		Title:     params.Title,
		Completed: false,
		CreatedAt: time.Now(),
	}
	if err := db.QueryRow(ctx, `
		INSERT INTO tasks (goal_id, title, completed, created_at) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id, goal_id, title, completed, created_at
	`, params.GoalID, params.Title, t.Completed, t.CreatedAt).Scan(&t.ID, &t.GoalID, &t.Title, &t.Completed, &t.CreatedAt); err != nil {
		return nil, err
	}
	return &t, nil
}

// ListTasks returns all Tasks for a given Goal.
//
// encore:api public method=GET path=/tasks
func ListTasks(ctx context.Context, params ListTasksParams) (*ListTasksResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT id, goal_id, title, completed, created_at 
		FROM tasks 
		WHERE goal_id = $1
		ORDER BY created_at DESC
	`, params.GoalID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []*Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.GoalID, &t.Title, &t.Completed, &t.CreatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, &t)
	}

	// Always return an empty slice instead of nil
	if tasks == nil {
		tasks = []*Task{}
	}

	return &ListTasksResponse{Tasks: tasks}, nil
}

// UpdateTask allows marking a Task complete/incomplete.
//
// encore:api public method=PATCH path=/tasks/update
func UpdateTask(ctx context.Context, params UpdateTaskParams) (*Task, error) {
	var t Task
	if err := db.QueryRow(ctx, `
		UPDATE tasks 
		SET completed = $1 
		WHERE id = $2 
		RETURNING id, goal_id, title, completed, created_at
	`, params.Completed, params.TaskID).Scan(&t.ID, &t.GoalID, &t.Title, &t.Completed, &t.CreatedAt); err != nil {
		return nil, err
	}
	return &t, nil
}

// ListAllTasks returns all Tasks (for debugging).
//
// encore:api public method=GET path=/tasks/all
func ListAllTasks(ctx context.Context) (*ListTasksResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT id, goal_id, title, completed, created_at 
		FROM tasks 
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []*Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.GoalID, &t.Title, &t.Completed, &t.CreatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, &t)
	}

	// Always return an empty slice instead of nil
	if tasks == nil {
		tasks = []*Task{}
	}

	return &ListTasksResponse{Tasks: tasks}, nil
}

// ListIncompleteTasks returns all incomplete Tasks across all Goals.
//
// encore:api public method=GET path=/tasks/incomplete
func ListIncompleteTasks(ctx context.Context) (*ListTasksResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT id, goal_id, title, completed, created_at 
		FROM tasks 
		WHERE completed = false
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []*Task
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.GoalID, &t.Title, &t.Completed, &t.CreatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, &t)
	}

	// Always return an empty slice instead of nil
	if tasks == nil {
		tasks = []*Task{}
	}

	return &ListTasksResponse{Tasks: tasks}, nil
}
