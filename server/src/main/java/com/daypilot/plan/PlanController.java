package com.daypilot.plan;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plans")
public class PlanController {
    @PostMapping
    public Map<String, Object> create(@RequestBody PlanRequest request) {
        String goal = request.goal() == null || request.goal().isBlank()
                ? "Complete the next important task" : request.goal().trim();
        List<String> steps = List.of(
                "Define the outcome you want from: " + goal,
                "Gather the notes, documents, and information you need",
                "Complete the highest-impact preparation task first",
                "Review your progress and identify anything still missing"
        );
        return Map.of("goal", goal, "steps", steps,
                "note", "Starter checklist generated from a template; no external AI service is called.");
    }
    public record PlanRequest(String goal) {}
}
