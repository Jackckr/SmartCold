package com.smartcold.zigbee.manage.dao;

import java.util.List;

/**
 * Created by qiangzi on 2017/9/22.
 */
public interface UserOpenIdMapper {
    List<String> selectByUserId(Integer userid);
}
