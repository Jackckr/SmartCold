package com.smartcold.manage.cold.service;


/**
 * @author Administrator
 */
public interface CacheService
{
	/**
	 * 
	 * @param key
	 * @return obj
	 */
	public <V> V cacheResult(String key);//
	
	public <V> V cacheResultList(String key);
	
	public void cacheRemove(String key);
	
	public <V> void cachePut(String key, V value);
	
}
