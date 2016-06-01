package com.smartcold.manage.cold.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.CookieMapper;
import com.smartcold.manage.cold.entity.CookieEntity;
import com.smartcold.manage.cold.service.CookieService;

@Service
public class CookieServiceImpl implements CookieService {

	@Autowired
	private CookieMapper cookieDao;

	@Override
	public CookieEntity findEffectiveCookie(String cookie) {
		return cookieDao.findEffectiveCookie(cookie);
	}

	@Override
	public void deleteCookie(String cookie) {
		cookieDao.deleteCookie(cookie);
	}

}
