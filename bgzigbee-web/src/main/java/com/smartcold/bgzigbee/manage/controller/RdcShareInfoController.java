package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.RdcShareInfoMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.entity.RdcSharedInfoEntity;
import com.smartcold.bgzigbee.manage.util.StringUtil;
import com.smartcold.bgzigbee.manage.util.TableData;
import com.smartcold.bgzigbee.manage.util.TimeUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * Created by qiangzi on 2017/5/24.
 */
@Controller
@RequestMapping(value = "/rdcShareInfo")
public class RdcShareInfoController {
    @Resource
    private RdcShareInfoMapper rdcShareInfoMapper;


    @RequestMapping(value = "/getRdcShareInfo", method = RequestMethod.POST)
    @ResponseBody
    public TableData getRdcShareInfo(
            String startTime,
            String endTime,
            String  keyword,
            String type,
            int     page,
            int     rows) {
        if(StringUtil.isnotNull(keyword)){
            keyword = "%" + keyword + "%";
        }else{
            keyword=null;
        }
        Date sTime=null;
        Date eTime=null;
        if (StringUtil.isnotNull(startTime)){
            sTime= TimeUtil.parseYMD(startTime);
        }
        if (StringUtil.isnotNull(endTime)){
            eTime= TimeUtil.parseYMD(endTime);
        }
        PageHelper.startPage(page, rows);
        List<RdcSharedInfoEntity> shareInfo = rdcShareInfoMapper.findShareInfo(type,keyword,sTime,eTime);
        PageInfo pageInfo=new PageInfo(shareInfo);
        return TableData.newSuccess(pageInfo);
    }

    @RequestMapping(value = "/getRdcShareInfoById", method = RequestMethod.POST)
    @ResponseBody
    public Object getRdcShareInfoById(Integer id){
        RdcSharedInfoEntity shareInfoById = rdcShareInfoMapper.findShareInfoById(id);
        return shareInfoById;
    }

    @RequestMapping(value = "/delRdcShareInfoById", method = RequestMethod.POST)
    @ResponseBody
    public void delRdcShareInfoById(Integer id){
        rdcShareInfoMapper.delShareInfoById(id);
    }

    @RequestMapping(value = "/delRdcShareInfoByIds", method = RequestMethod.POST)
    @ResponseBody
    public Object delRdcShareInfoByIds(int[] rdcShares){
        for (int rdcShare:rdcShares){
            rdcShareInfoMapper.delShareInfoById(rdcShare);
        }
        return new BaseDto(0);
    }
}
