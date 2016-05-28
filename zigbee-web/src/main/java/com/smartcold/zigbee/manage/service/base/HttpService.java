package com.smartcold.zigbee.manage.service.base;

public interface HttpService {
	public String sendGet(String url);

	public String sendGet(String url, int timeout);

	public String sendPost(String url, String params);

	public String sendPost(String url, String params, int secTimeout);
}
