package com.daypilot.task;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;
    public TaskController(TaskService service) { this.service = service; }

    @GetMapping public List<Task> list() { return service.list(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task create(@Valid @RequestBody CreateTaskRequest request) {
        return service.create(request.title(), request.description(), request.priority());
    }

    @PostMapping("/{id}/complete")
    public Task complete(@PathVariable long id) { return service.complete(id); }

    public record CreateTaskRequest(@NotBlank @Size(max=180) String title,
                                    @Size(max=1000) String description,
                                    Priority priority) {}
}
