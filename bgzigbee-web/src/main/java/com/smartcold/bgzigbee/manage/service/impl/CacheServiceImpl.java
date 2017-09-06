package com.smartcold.bgzigbee.manage.service.impl;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.smartcold.bgzigbee.manage.dao.CookieMapper;
import com.smartcold.bgzigbee.manage.dao.UserMapper;
import com.smartcold.bgzigbee.manage.service.CacheService;
import com.smartcold.bgzigbee.manage.util.StringUtil;
import com.smartcold.zigbee.manage.entity.UserEntity;

/**
 * Created by maqiang34 on 2017/6/19.
 */
@Service
public class CacheServiceImpl implements CacheService{

   
   @Autowired
   private UserMapper userMapper;
   
   @Autowired
	private CookieMapper cookieDao;
   
   @Resource
   private RedisTemplate<String,Object> template;
   
   
	
	public void cleraChace(String key){
    	template.delete(key);
    }

   
   @SuppressWarnings("unchecked")
   public <V> V getDataFromCache(String key){
   	BoundValueOperations<String, Object> boundValueOps = template.boundValueOps(key);
   	return (V)boundValueOps.get();
   }
   
	public void putDataTocache(String key,Object value){
	    	BoundValueOperations<String, Object> boundHashOps=template.boundValueOps(key);
	    	boundHashOps.set(value);
	}
	 

	@Override
	public <V> void updateUser(Object ouids) {
	   String [] uids=	ouids.toString().split(",");
	   if (uids!=null&&uids.length>0) {
			for (String uid : uids) {
				String token = getDataFromCache("userId_"+uid);
				if (StringUtil.isnotNull(token)) {
//					com.smartcold.zigbee.manage.entity.UserEntity
					Object userObject= getDataFromCache(token);
					if(userObject!=null){
						com.smartcold.zigbee.manage.entity.UserEntity user = userMapper.findZWUserById(Integer.parseInt(uid));
						System.err.println("收到更新数据指令============================="+JSON.toJSONString(user));
						putDataTocache(token, user);
					}
				} 
			}
      	}
	}

	@Override
	public <V> void delUser(int oid) {
				
	}
}
