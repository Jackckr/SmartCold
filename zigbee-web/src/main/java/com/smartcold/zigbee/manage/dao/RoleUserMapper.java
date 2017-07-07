package com.smartcold.zigbee.manage.dao;

import java.util.HashMap;
import java.util.List;

/**
 * Created by qiangzi on 2017/7/7.
 */
public interface RoleUserMapper {
    List<HashMap<String,Object>> selByUserId(int userId);
}
