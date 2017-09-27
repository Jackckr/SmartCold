package com.smartcold.bgzigbee.manage.dao;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.WxUserEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created by qiangzi on 2017/9/27.
 */
public interface WxUserMapper {
    Page<WxUserEntity> findByFilter(@Param("keyword") String keyword);
}
