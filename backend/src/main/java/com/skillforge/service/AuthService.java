package com.skillforge.service;

import com.skillforge.dto.LoginRequest;
import com.skillforge.dto.LoginResponse;
import com.skillforge.dto.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
