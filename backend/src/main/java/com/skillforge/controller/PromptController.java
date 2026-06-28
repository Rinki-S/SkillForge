package com.skillforge.controller;

import com.skillforge.common.Result;
import com.skillforge.dto.PromptGenerateRequest;
import com.skillforge.service.PromptService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/prompt")
public class PromptController {

    private final PromptService promptService;

    public PromptController(PromptService promptService) {
        this.promptService = promptService;
    }

    @PostMapping("/generate")
    public Result<Map<String, String>> generate(@Valid @RequestBody PromptGenerateRequest request,
                                                Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        String rendered = promptService.generatePrompt(request.getSkillId(), request.getVariableValues(), userId);
        return Result.success(Map.of("renderedPrompt", rendered));
    }
}
