package com.skillforge.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.skillforge.common.BusinessException;
import com.skillforge.common.ErrorCode;
import com.skillforge.dto.LoginRequest;
import com.skillforge.dto.LoginResponse;
import com.skillforge.dto.RegisterRequest;
import com.skillforge.entity.User;
import com.skillforge.mapper.UserMapper;
import com.skillforge.security.JwtUtil;
import com.skillforge.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void register(RegisterRequest request) {
        // Check duplicate username
        QueryWrapper<User> query = new QueryWrapper<>();
        query.eq("username", request.getUsername());
        if (userMapper.selectCount(query) > 0) {
            throw new BusinessException(ErrorCode.DUPLICATE_USERNAME);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        if (request.getNickname() != null && !request.getNickname().isBlank()) {
            user.setNickname(request.getNickname());
        } else {
            user.setNickname(request.getUsername());
        }
        userMapper.insert(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        QueryWrapper<User> query = new QueryWrapper<>();
        query.eq("username", request.getUsername());
        User user = userMapper.selectOne(query);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "用户名或密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return new LoginResponse(token, user.getId(), user.getUsername(), user.getRole(), user.getNickname());
    }
}
