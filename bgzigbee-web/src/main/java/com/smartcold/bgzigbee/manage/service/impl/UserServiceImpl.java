package com.smartcold.bgzigbee.manage.service.impl;

import com.smartcold.bgzigbee.manage.dao.*;
import com.smartcold.bgzigbee.manage.entity.RdcUser;
import com.smartcold.bgzigbee.manage.entity.RoleUser;
import com.smartcold.bgzigbee.manage.sc360.dao.CompanyUserMapper;
import com.smartcold.bgzigbee.manage.sc360.entity.CompanyUser;
import com.smartcold.bgzigbee.manage.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

/**
 * Created by qiangzi on 2017/6/19.
 */
@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ACLMapper aclMapper;
    @Autowired
    private RdcUserMapper rdcUserMapper;
    @Autowired
    private RoleUserMapper roleUserMapper;
    @Autowired
    private CompanyUserMapper companyUserMapper;
    @Autowired
    private FileDataMapper fileDataMapper;

    @Override
    public boolean deleteUserById(Integer userId) {
        userMapper.deleteUser(userId);
        RoleUser roleUser = roleUserMapper.getRoleUserByUserId(userId);
        if(roleUser!=null){
            roleUserMapper.deleteByPrimaryKey(roleUser.getId());
        }
        List<HashMap<String, Object>> aclUsers = aclMapper.getNACLByID("acl_user", "uid", userId);
        for (HashMap<String, Object> aclUser:aclUsers) {
            aclMapper.delACLById("acl_user",Integer.parseInt(aclUser.get("id").toString()));
        }
        List<RdcUser> rdcUsers = rdcUserMapper.getByRUID(userId);
        for (RdcUser rdcUser:rdcUsers){
            rdcUserMapper.deleteByPrimaryKey(rdcUser.getId());
        }
        List<CompanyUser> companyUsers = companyUserMapper.selectByUid(userId);
        for (CompanyUser companyUser : companyUsers) {
            companyUserMapper.deleteByPrimaryKey(companyUser.getId());
        }
        fileDataMapper.deleteByBelongIdAndCategory(userId,FileDataMapper.CATEGORY_AVATAR_PIC);
        return true;
    }
}
