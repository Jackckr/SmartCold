package com.smartcold.manage.cold.service.redis;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;

import redis.clients.jedis.Jedis;

@Component
public class RedisDistributedLock implements DistributedLock {

	@Resource
	private RedisConnectionFactory rcf;
	
	private static final String LOCK_NODE ="LOCK";
	
	private ThreadLocal<String> local = new ThreadLocal<>();
	
	@Override
	public Boolean getLock() {
		Jedis jedis = (Jedis) rcf.getConnection().getNativeConnection();
		String value = UUID.randomUUID().toString();
		String ret = jedis.set(LOCK_NODE, value, "NX", "PX", 10000);
		if(!StringUtils.isEmpty(ret) && ret.equals("OK")){
			local.set(value);
			jedis.close();
			return true;
		}
		jedis.close();
		return false;
	}

	@Override
	public void releaseLock() {
		String script =null;
		try {
			script = FileCopyUtils.copyToString(new FileReader(ResourceUtils.getFile("classpath:unlock.lua")));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Jedis jedis = (Jedis) rcf.getConnection().getNativeConnection();
		List<String> keys = new ArrayList<String>();
		keys.add(LOCK_NODE);
		List<String> args = new ArrayList<String>();
		args.add(local.get());
		jedis.eval(script, keys, args);
		jedis.close();
	}

}
