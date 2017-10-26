package com.smartcold.manage.cold.service.redis;

public interface DistributedLock {
	
	public Boolean getLock();
	
	public void releaseLock();

}
