package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.dao.olddb.RoleUserMapper;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.entity.olddb.RoleUser;
import com.smartcold.manage.cold.entity.olddb.UserEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Date;

/**
 * Created by qiangzi on 2017/5/14.
 */
@Controller
@RequestMapping(value = "/loginStep")
public class LoginStepController {
    @Resource
    private RdcMapper rdcMapper;
    @Resource
    private RoleUserMapper roleUserMapper;
    @Resource
    private RdcUserMapper rdcUserMapper;
    @RequestMapping(value = "/getAllRdc",method = RequestMethod.POST)
    @ResponseBody
    public Object getAllRdc() {
        return rdcMapper.getRdcByDate();
    }

    @RequestMapping(value = "/attestationRdc",method = RequestMethod.POST)
    @ResponseBody
    public void attestationRdc(@RequestParam(value = "rdcId", required = false) Integer rdcId,
                                 @RequestParam(value = "roleType", required = false) Integer roleType,
                                 HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        RoleUser roleUser = new RoleUser();
        roleUser.setUserid(user.getId());
        roleUser.setRoleid(roleType);
        roleUser.setAddtime(new Date());
        roleUserMapper.insert(roleUser);
        RdcUser rdcUser = new RdcUser();
        rdcUser.setUserid(user.getId());
        rdcUser.setRdcid(rdcId);
        rdcUser.setAddtime(new Date());
        rdcUserMapper.insert(rdcUser);
    }
}
