package com.daypilot.mcp;

import com.daypilot.plan.PlanController;
import com.daypilot.task.Priority;
import com.daypilot.task.Task;
import com.daypilot.task.TaskService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;

@Component
public class DayPilotTools {
    private final TaskService tasks;
    public DayPilotTools(TaskService tasks) { this.tasks = tasks; }

    @Tool(name = "list_tasks", description = "List the user's DayPilot tasks and their completion status.")
    public List<TaskView> listTasks() {
        return tasks.list().stream().map(t -> new TaskView(t.getId(), t.getTitle(),
                t.getDescription(), t.getPriority().name(), t.isCompleted())).toList();
    }

    @Tool(name = "create_prep_plan", description = "Create a practical checklist for preparing for a meeting or goal.")
    public Map<String, Object> createPrepPlan(
            @ToolParam(description = "Meeting, goal, or task to prepare for") String goal) {
        String cleanGoal = goal == null || goal.isBlank() ? "the next important task" : goal.trim();
        return Map.of("goal", cleanGoal, "steps", List.of(
                "Define the desired outcome for " + cleanGoal,
                "Gather the required notes and materials",
                "Complete the highest-impact preparation task",
                "Review what remains before the deadline"
        ), "note", "Template-based plan; no external AI service is called.");
    }

    @Tool(name = "complete_task", description = "Mark a DayPilot task as completed using its numeric task ID.")
    public TaskView completeTask(@ToolParam(description = "Numeric ID of the task to complete") long taskId) {
        Task t = tasks.complete(taskId);
        return new TaskView(t.getId(), t.getTitle(), t.getDescription(), t.getPriority().name(), t.isCompleted());
    }

    public record TaskView(Long id, String title, String description, String priority, boolean completed) {}
}
