package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.RdcShareInfoMapper;
import com.smartcold.bgzigbee.manage.entity.RdcSharedInfoEntity;
import com.smartcold.bgzigbee.manage.util.StringUtil;
import com.smartcold.bgzigbee.manage.util.TableData;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
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
    public TableData getObjByType(
            Integer dataType,
            Integer stype,
            Integer province,
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
        startTime="2017-01-01 00:00:00";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date parse =null;
        try {
            parse = simpleDateFormat.parse(startTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        PageHelper.startPage(page, rows);
        List<RdcSharedInfoEntity> shareInfo = rdcShareInfoMapper.findShareInfo(parse);
        PageInfo pageInfo=new PageInfo(shareInfo);
        return TableData.newSuccess(pageInfo);
    }
}
