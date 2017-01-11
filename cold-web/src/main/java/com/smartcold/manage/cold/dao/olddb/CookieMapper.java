package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.CookieEntity;

public interface CookieMapper {

	public void insertCookie(CookieEntity cookieEntity);

	public void deleteCookie(@Param("cookie") String cookie);

	public CookieEntity findEffectiveCookie(@Param("cookie") String cookie);
}
