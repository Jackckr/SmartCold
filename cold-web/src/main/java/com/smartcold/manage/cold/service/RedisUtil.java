package com.smartcold.manage.cold.service;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.BoundListOperations;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisUtil {
    @Resource
	private RedisTemplate<String,Object> template;
	
    
    public void cleraChace(String key){
    	template.delete(key);
    }
    
    public List<Object> getCacheList(String key){
    	BoundListOperations<String, Object> bound=template.boundListOps(key);
    	return bound.range(0, bound.size());
    }
    
    public void updateCaheList(String key,List<Object> dataList){
    	template.delete(key);
    	BoundListOperations<String, Object> bound=template.boundListOps(key);
    	bound.rightPushAll(dataList);//dataList.toArray()
    }
    
    @SuppressWarnings({ "rawtypes", "unchecked" })
	public Map<String,Object> getCacheMap(String key){
    	BoundHashOperations  bound=  template.boundHashOps(key);
    	return bound.entries();
    }
    
    public Object getDataToCacheMap(String key,Object key1,Object value){
    	BoundHashOperations<String, Object, Object> bound = template.boundHashOps(key);
    	return bound.get(key1);
    }
    
    public void putDataToCache(String key,Object key1,Object value){
    	BoundHashOperations<String, Object, Object> boundHashOps = template.boundHashOps(key);
    	boundHashOps.put(key1, value);
    }
    
    public void putDataTocache(String key,Object value){
    	BoundValueOperations<String, Object> boundHashOps=template.boundValueOps(key);
    	boundHashOps.set(value);
    }
  
    public Object getDataFromCache(String key){
    	BoundValueOperations<String, Object> boundValueOps = template.boundValueOps(key);
    	return boundValueOps.get();
    }
	
	
}
