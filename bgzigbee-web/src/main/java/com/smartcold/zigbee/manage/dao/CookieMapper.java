package com.smartcold.zigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.CookieEntity;

public interface CookieMapper {

	public void insertCookie(CookieEntity cookieEntity);
	
	public void deleteCookie(@Param("cookie") String cookie);
	
	public CookieEntity findEffectiveCookie(@Param("cookie") String cookie);
}
