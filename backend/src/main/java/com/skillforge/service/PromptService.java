package com.skillforge.service;

import java.util.Map;

public interface PromptService {
    String generatePrompt(Long skillId, Map<String, String> variableValues, Long userId);
}
