package com.skillforge.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.skillforge.entity.Skill;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SkillMapper extends BaseMapper<Skill> {
}
