package com.smartcold.bgzigbee.manage.dao;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.UserOpenIdEntity;
import org.apache.ibatis.annotations.Param;


/**
 * Created by qiangzi on 2017/9/26.
 */
public interface UserOpenIdMapper {
    Page<UserOpenIdEntity> findByFilter(@Param("userid") Integer userid,@Param("wxuserid") Integer wxuserid);

    int updateByEntity(UserOpenIdEntity userOpenIdEntity);

    int insertByEntity(UserOpenIdEntity userOpenIdEntity);

    UserOpenIdEntity findByUser(UserOpenIdEntity userOpenIdEntity);

    int delByUser(UserOpenIdEntity userOpenIdEntity);
}
