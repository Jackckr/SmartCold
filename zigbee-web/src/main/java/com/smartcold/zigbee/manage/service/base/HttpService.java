package com.smartcold.zigbee.manage.service.base;

import com.alibaba.fastjson.JSONObject;

public interface HttpService {
	public String sendGet(String url);

	public String sendGet(String url, int timeout);

	public String sendPost(String url, String params);

	public String sendPost(String url, String params, int secTimeout);

	public String sendPostByJson(String url,JSONObject json);
}
