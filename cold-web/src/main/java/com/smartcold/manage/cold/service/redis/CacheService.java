package com.smartcold.manage.cold.service.redis;



/**
 * @author Administrator
 */
public interface CacheService
{
	
	public void removeKey(String key);
   
    public <V> V getData(String key);
   
	public void putData(String key,Object  value);
	
	
}
