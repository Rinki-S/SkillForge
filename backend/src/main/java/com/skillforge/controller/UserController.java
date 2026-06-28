package com.skillforge.controller;

import com.skillforge.common.Result;
import com.skillforge.entity.User;
import com.skillforge.mapper.UserMapper;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserMapper userMapper;

    public UserController(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @GetMapping("/profile")
    public Result<User> profile(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        User user = userMapper.selectById(userId);
        if (user == null) {
            return Result.error(com.skillforge.common.ErrorCode.USER_NOT_FOUND);
        }
        user.setPassword(null); // Never expose password
        return Result.success(user);
    }

    @PutMapping("/profile")
    public Result<Void> updateProfile(Authentication auth,
                                       @RequestBody Map<String, String> body) {
        Long userId = (Long) auth.getPrincipal();
        User user = userMapper.selectById(userId);
        if (user == null) {
            return Result.error(com.skillforge.common.ErrorCode.USER_NOT_FOUND);
        }
        if (body.containsKey("nickname")) {
            user.setNickname(body.get("nickname"));
        }
        if (body.containsKey("avatar")) {
            user.setAvatar(body.get("avatar"));
        }
        userMapper.updateById(user);
        return Result.success();
    }
}
