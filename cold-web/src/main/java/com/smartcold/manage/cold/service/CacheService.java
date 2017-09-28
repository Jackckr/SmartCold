package com.smartcold.manage.cold.service;



/**
 * @author Administrator
 */
public interface CacheService
{
	
	public void cleraChace(String key);
   
    public <V> V getDataFromCache(String key);
   
	public void putDataTocache(String key,Object  value);
	
	
}
