package com.skillforge.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.skillforge.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
