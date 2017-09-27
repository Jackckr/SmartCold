package com.smartcold.bgzigbee.manage.controller;


import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.UserMapper;
import com.smartcold.bgzigbee.manage.dao.UserOpenIdMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.UserEntity;
import com.smartcold.bgzigbee.manage.entity.UserOpenIdEntity;
import com.smartcold.bgzigbee.manage.util.TableData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by qiangzi on 2017/9/26.
 */
@Controller
@RequestMapping(value = "/useropenid")
public class UserOpenIdController {
    @Autowired
    private UserOpenIdMapper userOpenIdMapper;
    @Autowired
    private UserMapper userMapper;

    @RequestMapping(value = "/getUserByFilter", method = RequestMethod.POST)
    @ResponseBody
    public TableData<UserOpenIdEntity> getUserByFilter(Integer userid,Integer wxuserid,int page,int rows) {
        PageHelper.startPage(page, rows);
        Page<UserOpenIdEntity> userList = userOpenIdMapper.findByFilter(userid,wxuserid);
        return TableData.newSuccess(new PageInfo<UserOpenIdEntity>(userList) );
    }

    @RequestMapping(value = "/addConfig")
    @ResponseBody
    public ResultDto addConfig(UserOpenIdEntity userOpenIdEntity){
        UserOpenIdEntity byUser = userOpenIdMapper.findByUser(userOpenIdEntity);
        ResultDto resultDto=null;
        if(byUser==null){
            int i = userOpenIdMapper.insertByEntity(userOpenIdEntity);
            resultDto=i>0?new ResultDto(1,"绑定成功！"):new ResultDto(0,"绑定失败,请重试！");
        }else {
            resultDto=new ResultDto(0,"该绑定关系已存在，无法绑定！");
        }
        return resultDto;
    }

    @RequestMapping(value = "/delConfig")
    @ResponseBody
    public ResultDto delConfig(UserOpenIdEntity userOpenIdEntity){
        ResultDto resultDto=null;
        int i = userOpenIdMapper.delByUser(userOpenIdEntity);
        resultDto=i>0?new ResultDto(1,"解绑成功！"):new ResultDto(0,"解绑失败,请重试！");
        return resultDto;
    }
}
