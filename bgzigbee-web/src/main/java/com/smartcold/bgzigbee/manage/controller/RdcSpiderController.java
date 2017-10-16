package com.smartcold.bgzigbee.manage.controller;

import com.smartcold.bgzigbee.manage.dao.RdcSpiderMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.RdcSpider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;

/**
 * Created by qiangzi on 2017/10/16.
 */
@Controller
@RequestMapping(value = "/rdcSpider")
public class RdcSpiderController {
    @Autowired
    private RdcSpiderMapper rdcSpiderMapper;

    @RequestMapping(value = "/addOrUpdateSpider")
    @ResponseBody
    public Object addOrUpdateSpider(Integer rdcId,String mapping){
        RdcSpider rdcSpider = rdcSpiderMapper.selectByRdcId(rdcId);
        RdcSpider rdcSpiderEntity = new RdcSpider();
        rdcSpiderEntity.setMapping(mapping);
        rdcSpiderEntity.setRdcid(rdcId);
        rdcSpiderEntity.setAddtime(new Date());
        if (rdcSpider==null){
            rdcSpiderMapper.addSpider(rdcSpiderEntity);
        }else {
            rdcSpiderMapper.updateSpider(rdcSpiderEntity);
        }
        return new ResultDto(1,"保存成功！");
    }

    @RequestMapping(value = "/getSpiderMapping")
    @ResponseBody
    public Object getSpiderMapping(Integer rdcId){
        RdcSpider rdcSpider = rdcSpiderMapper.selectByRdcId(rdcId);
        if (rdcSpider!=null){
            return rdcSpider.getMapping();
        }
        return null;
    }
}
