package com.smartcold.zigbee.manage.service;

import com.smartcold.zigbee.manage.entity.CookieEntity;

public interface CookieService {

	static int EXPIERD_TIME = 60;

	public String insertCookie(String username);

	public CookieEntity findEffectiveCookie(String cookie);

	public void deleteCookie(String cookie);
}
