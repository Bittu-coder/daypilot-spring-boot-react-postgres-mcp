package com.daypilot.task;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repository;
    public TaskService(TaskRepository repository) { this.repository = repository; }

    public List<Task> list() { return repository.findAllByOrderByCompletedAscIdDesc(); }

    @Transactional
    public Task create(String title, String description, Priority priority) {
        if (title == null || title.isBlank()) throw new IllegalArgumentException("Task title is required");
        return repository.save(new Task(title.trim(), description, priority));
    }

    @Transactional
    public Task complete(long id) {
        Task task = repository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        task.markCompleted();
        return repository.save(task);
    }

    public static class TaskNotFoundException extends RuntimeException {
        public TaskNotFoundException(long id) { super("Task " + id + " was not found"); }
    }
}
