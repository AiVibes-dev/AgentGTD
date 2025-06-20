// encore:service reminders
package reminders

import (
	"context"
	"log"
	"time"

	"encore.app/services/tasks"
	"encore.dev/cron"
)

// DailyIncompleteTasksReport is a cron job that runs daily at 8:30 AM
// to list all incomplete tasks and print them to the console.
var _ = cron.NewJob("daily-incomplete-tasks-report", cron.JobConfig{
	Title:    "Daily Incomplete Tasks Report",
	Schedule: "30 8 * * *",
	Endpoint: DailyIncompleteTasksReport,
})

// DailyIncompleteTasksReport emails everyone who signed up recently.
// It's idempotent: it only sends a welcome email to each person once.
//
//encore:api private
func DailyIncompleteTasksReport(ctx context.Context) error {
	log.Println("=== Daily Incomplete Tasks Report ===")
	log.Printf("Generated at: %s\n", time.Now().Format("2006-01-02 15:04:05"))

	response, err := tasks.ListIncompleteTasks(ctx)
	if err != nil {
		log.Printf("Error fetching incomplete tasks: %v\n", err)
		return err
	}

	if len(response.Tasks) == 0 {
		log.Println("✅ No incomplete tasks found!")
	} else {
		log.Printf("📋 Found %d incomplete task(s):\n", len(response.Tasks))
		for i, task := range response.Tasks {
			log.Printf("  %d. [Goal ID: %d] %s (Created: %s)\n",
				i+1,
				task.GoalID,
				task.Title,
				task.CreatedAt.Format("2006-01-02"))
		}
	}

	log.Println("=== End Report ===")
	return nil
}
