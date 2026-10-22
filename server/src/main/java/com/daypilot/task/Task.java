package com.daypilot.task;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "tasks")
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 180)
    private String title;
    @Column(length = 1000)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Priority priority = Priority.MEDIUM;
    @Column(nullable = false)
    private boolean completed = false;
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected Task() {}
    public Task(String title, String description, Priority priority) {
        this.title = title;
        this.description = description == null ? "" : description;
        this.priority = priority == null ? Priority.MEDIUM : priority;
        this.completed = false;
        this.createdAt = Instant.now();
    }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Priority getPriority() { return priority; }
    public boolean isCompleted() { return completed; }
    public Instant getCreatedAt() { return createdAt; }
    public void markCompleted() { this.completed = true; }
}
