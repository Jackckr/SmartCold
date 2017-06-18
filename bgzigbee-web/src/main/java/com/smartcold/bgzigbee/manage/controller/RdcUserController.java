package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.RdcUserMapper;
import com.smartcold.bgzigbee.manage.dao.RoleUserMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.RdcUser;
import com.smartcold.bgzigbee.manage.entity.RoleUser;
import com.smartcold.bgzigbee.manage.util.TableData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

/**
 * Created by qiangzi on 2017/6/13.
 */
@Controller
@RequestMapping(value = "/rdcUser")
public class RdcUserController {
    @Autowired
    private RdcUserMapper rdcUserMapper;
    @Autowired
    private RoleUserMapper roleUserMapper;

    @RequestMapping(value = "/getRdcUserByUserId", method = RequestMethod.POST)
    @ResponseBody
    public Object getRdcUserByUserId(int userId, int page, int rows) {
        PageHelper.startPage(page, rows);
        List<RdcUser> rdcUserList = rdcUserMapper.getByRUID(userId);
        return TableData.newSuccess(new PageInfo<RdcUser>(rdcUserList));
    }

    @RequestMapping(value = "/getRdcUserByRdcId", method = RequestMethod.POST)
    @ResponseBody
    public Object getRdcUserByRdcId(int rdcId, int page, int rows) {
        PageHelper.startPage(page, rows);
        List<RdcUser> rdcUserList = rdcUserMapper.getByRdcID(rdcId);
        return TableData.newSuccess(new PageInfo<RdcUser>(rdcUserList));
    }

    @RequestMapping(value = "/insertRdcUser", method = RequestMethod.POST)
    @ResponseBody
    public Object insertRdcUser(int rdcId, int userId) {
        RoleUser roleUser= roleUserMapper.getRoleUserByUserId(userId);
        RdcUser byRUID = rdcUserMapper.findByRUID(userId, rdcId);
        //RdcUser byUserId = rdcUserMapper.findByUserId(userId);
        if(roleUser!=null && roleUser.getRoleid()==2){
            return new ResultDto(0,"绑定失败，改用为集团用户不得关联冷库！");
        }
        if (byRUID == null) {
            if(roleUser==null){
                RoleUser doAddRoleUser = new RoleUser();
                doAddRoleUser.setUserid(userId);
                doAddRoleUser.setRoleid(1); // 普通账号
                doAddRoleUser.setAddtime(new Date());
                roleUserMapper.insertSelective(doAddRoleUser);
            }
            RdcUser rdcUser = new RdcUser();
            /*if(byUserId!=null){
                rdcUser.setRdcid(rdcId);
                rdcUser.setId(byUserId.getId());
                rdcUserMapper.updateByPrimaryKeySelective(rdcUser);
            }else {*/
                rdcUser.setRdcid(rdcId);
                rdcUser.setUserid(userId);
                rdcUser.setAddtime(new Date());
                rdcUserMapper.insertSelective(rdcUser);
            //}
            return new ResultDto(1,"绑定成功！");
        }
        return new ResultDto(0,"绑定失败，该用户已和该冷库成立绑定关系!");
    }

    @RequestMapping(value = "/delRdcUser", method = RequestMethod.POST)
    @ResponseBody
    public Object delRdcUser(int rdcId, int userId) {
        rdcUserMapper.deleteByURId(userId,rdcId);
        return new BaseDto(1);
    }

}
