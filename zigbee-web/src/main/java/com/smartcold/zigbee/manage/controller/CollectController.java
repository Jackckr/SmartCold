package com.smartcold.zigbee.manage.controller;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.CollectMapper;
import com.smartcold.zigbee.manage.dto.ResultDto;
import com.smartcold.zigbee.manage.entity.CollectEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by qiangzi on 2017/7/3.
 */
@Controller
@RequestMapping(value = "/collect")
public class CollectController {
    @Autowired
    private CollectMapper collectMapper;

    @RequestMapping(value = "/addCollectRdc")
    @ResponseBody
    public ResultDto addCollectRdc(int uid,int collectId,int collectType){
        CollectEntity collectEntity = new CollectEntity();
        collectEntity.setUid(uid);
        collectEntity.setCollectType(collectType);
        collectEntity.setCollectId(collectId);
        collectMapper.insertByCollect(collectEntity);
        return new ResultDto(1,"收藏成功！");
    }

    @RequestMapping(value = "/getCollectRdc")
    @ResponseBody
    public PageInfo<CollectEntity> getCollectRdc(int uid,int pageNum,int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        Page<CollectEntity> rdcCollect = collectMapper.getRdcCollectByUid(uid);
        return new PageInfo<CollectEntity>(rdcCollect);
    }

    @RequestMapping(value = "/getCollectShared")
    @ResponseBody
    public PageInfo<CollectEntity> getCollectShared(int uid,int pageNum,int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        Page<CollectEntity> rdcCollect = collectMapper.getSharedCollectByUid(uid);
        return new PageInfo<CollectEntity>(rdcCollect);
    }

    @RequestMapping(value = "/delCollectById")
    @ResponseBody
    public ResultDto delById(int collectId){
        collectMapper.delById(collectId);
        return new ResultDto(1,"取消收藏成功！");
    }
    @RequestMapping(value = "/delByCollect")
    @ResponseBody
    public ResultDto delByCollect(int collectId,int collectType,int uid){
        CollectEntity collectEntity = new CollectEntity();
        collectEntity.setUid(uid);
        collectEntity.setCollectId(collectId);
        collectEntity.setCollectType(collectType);
        collectMapper.delByCollect(collectEntity);
        return new ResultDto(1,"取消收藏成功！");
    }
}
