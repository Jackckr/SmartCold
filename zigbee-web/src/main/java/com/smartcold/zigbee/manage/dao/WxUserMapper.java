package com.smartcold.zigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.HashMap;

/**
 * Created by qiangzi on 2017/9/28.
 */
public interface WxUserMapper {
    int insertByMap(HashMap map);

    HashMap<String,Object> findByOpenId(@Param("openid") String openid);

    int updateNickname(@Param("openid")String openid, @Param("nickname")String nickname, @Param("addtime")Date date);
}
