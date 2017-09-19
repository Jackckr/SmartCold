package com.smartcold.bgzigbee.manage.controller.store360;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.store360.StoreMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.store360.StoreEntity;
import com.smartcold.bgzigbee.manage.util.TableData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by qiangzi on 2017/9/15.
 */
@Controller
@RequestMapping(value = "/store")
public class StoreController {
    @Autowired
    private StoreMapper storeMapper;

    @RequestMapping(value = "/findByFilter")
    @ResponseBody
    public Object findByFilter(String keyword,int page,int rows){
        PageHelper.startPage(page,rows);
        Page<StoreEntity> listByFilter = storeMapper.findListByFilter(keyword);
        return TableData.newSuccess(new PageInfo<StoreEntity>(listByFilter));
    }

    @RequestMapping(value = "/checkStoreName")
    @ResponseBody
    public Boolean checkoreName(String name){
        return storeMapper.findByName(name)==null ? true:false;
    }

    @RequestMapping(value = "/addUpdateStore")
    @ResponseBody
    public Object addUpdateStore(StoreEntity storeEntity){
        if (storeEntity.getId()==0){
            storeMapper.insertStore(storeEntity);
        }else {
            storeMapper.updateStore(storeEntity);
        }
        return new ResultDto(1,"保存成功！");
    }

    @RequestMapping(value = "/findStoreById")
    @ResponseBody
    public Object findStoreById(int storeId){
        return storeMapper.selectById(storeId);
    }

    @RequestMapping(value = "/delById")
    @ResponseBody
    public Object delById(int storeId){
        storeMapper.delStoreById(storeId);
        return new ResultDto(1,"删除成功！");
    }

    @RequestMapping(value = "/delByIds")
    @ResponseBody
    public Object delByIds(int[] storeIds){
        for(int storeId:storeIds){
            storeMapper.delStoreById(storeId);
        }
        return new ResultDto(1,"删除成功！");
    }
}
