package com.daypilot.config;

import com.daypilot.mcp.DayPilotTools;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class McpToolConfig {
    @Bean
    ToolCallbackProvider dayPilotToolCallbacks(DayPilotTools dayPilotTools) {
        return MethodToolCallbackProvider.builder().toolObjects(dayPilotTools).build();
    }
}
