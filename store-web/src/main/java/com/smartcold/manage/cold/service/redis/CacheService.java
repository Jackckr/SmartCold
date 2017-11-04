package com.smartcold.manage.cold.service.redis;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:
 * Create on MaQiang 2016-6-25 09:28:36
 */
public interface CacheService
{
	
//	public void removeKey(String key);
//   
//    public <V> V getData(String key);
//   
//	public void putData(String key,Object  value);
	
	public <V> V getData( String cacheName,String key ) ;

	public void removeKey( String cacheName,String key) ;

	public <V> void putData( String cacheName,String key, V value) ;
}
