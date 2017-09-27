package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.WxUserMapper;
import com.smartcold.bgzigbee.manage.entity.WxUserEntity;
import com.smartcold.bgzigbee.manage.util.TableData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by qiangzi on 2017/9/27.
 */
@Controller
@RequestMapping(value = "/wxUser")
public class WxUserController {
    @Autowired
    private WxUserMapper wxUserMapper;


    @RequestMapping(value = "/getUserByFilter", method = RequestMethod.POST)
    @ResponseBody
    public TableData<WxUserEntity> getUserByFilter(String keyword, int page, int rows) {
        PageHelper.startPage(page, rows);
        Page<WxUserEntity> userList = wxUserMapper.findByFilter(keyword);
        return TableData.newSuccess(new PageInfo<WxUserEntity>(userList));
    }

}
