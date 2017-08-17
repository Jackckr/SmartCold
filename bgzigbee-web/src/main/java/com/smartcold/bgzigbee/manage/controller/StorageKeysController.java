package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.enums.SetTables;
import com.smartcold.bgzigbee.manage.sc360.dao.StorageKeysMapper;
import com.smartcold.bgzigbee.manage.sc360.entity.StorageKeysEntity;

import java.util.HashMap;

/**
 * Created by corly on 16-8-10.
 */
@Controller
@ResponseBody
@RequestMapping("/storageKeys")
public class StorageKeysController {

    @Autowired
    private StorageKeysMapper storageKeysDao;

    @RequestMapping("/getAllKeys")
    public Object getAllKeys(){
        return storageKeysDao.findAll();
    }

    @RequestMapping("/getKeys")
    public Object getKeys(String words,String issis,String type){
        HashMap<String, Object> param = new HashMap<String, Object>();
        param.put("words",words);
        param.put("issis",issis);
        param.put("type",type);
        return storageKeysDao.findByMap(param);
    }

    @RequestMapping("/getStorageType")
    public Object getStorageType(){
        JsonArray jsonArray = new JsonArray();
        for (SetTables sy: SetTables.values()){
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("type", sy.getType());
            jsonObject.addProperty("desc", sy.getDesc());
            jsonObject.addProperty("table", sy.getTable());
            jsonArray.add(jsonObject);
        }
        return jsonArray;
    }

    @RequestMapping(value="/saveStorageKeys", method = RequestMethod.POST)
    public Object saveStorageKeys(StorageKeysEntity storageKeysEntity) {
        try {
            boolean res = storageKeysDao.save(storageKeysEntity);
            if (res){
                //return storageKeysEntity.getId();
                return new ResultDto(storageKeysEntity.getId(),"添加成功");
            }else {
                return new ResultDto(-1, "添加失败");
            }
        }catch (Exception e){
            return new ResultDto(-1, "key重复");
        }
    }

    @RequestMapping(value="/updateStorageKeys", method = RequestMethod.POST)
    public Object updateStorageKeys(StorageKeysEntity storageKeysEntity) {
        try {
            boolean res = storageKeysDao.update(storageKeysEntity);
            if (res){
                //return storageKeysEntity.getId();
                return new ResultDto(storageKeysEntity.getId(),"修改成功");
            }else {
                return new ResultDto(-1, "修改失败");
            }
        }catch (Exception e){
            return new ResultDto(-1, "key重复");
        }
    }

    @RequestMapping(value = "/checkKey")
    public Boolean checkKey(String key){
        StorageKeysEntity byKey = storageKeysDao.findByKey(key);
        return byKey==null? true: false;
    }

    @RequestMapping(value = "/findById")
    public Object findById(int id){
        return storageKeysDao.findById(id);
    }


    @RequestMapping(value = "/delStorageKey")
    public Object delStorageKey(int id){
        return storageKeysDao.deleteById(id);
    }

    @RequestMapping(value = "/delStorageKeys")
    public void delStorageKeys(Integer[] ids){
        for (Integer id:ids){
            storageKeysDao.deleteById(id);
        }
    }
}
