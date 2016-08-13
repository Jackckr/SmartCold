package com.smartcold.manage.cold.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.smartcold.manage.cold.dao.newdb.StorageKeysMapper;
import com.smartcold.manage.cold.entity.newdb.StorageKeysEntity;
import com.smartcold.manage.cold.enums.StorageType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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

    @RequestMapping("/getStorageType")
    public Object getStorageType(){
        JsonArray jsonArray = new JsonArray();
        for (StorageType sy: StorageType.values()){
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("type", sy.getType());
            jsonObject.addProperty("desc", sy.getDesc());
            jsonObject.addProperty("table", sy.getTable());
            jsonArray.add(jsonObject);
        }
        return jsonArray;
    }

    @RequestMapping(value="/saveStorageKeys", method = RequestMethod.POST)
    public Object saveStorageKeys(StorageKeysEntity storageKeysEntity){
        boolean res = storageKeysDao.save(storageKeysEntity);
        if (res){
            return storageKeysEntity.getId();
        }else
            return "failed to save";
    }

    @RequestMapping(value = "/delStorageKey", method = RequestMethod.POST)
    public Object delStorageKey(int id){
        return storageKeysDao.deleteById(id);
    }
}
