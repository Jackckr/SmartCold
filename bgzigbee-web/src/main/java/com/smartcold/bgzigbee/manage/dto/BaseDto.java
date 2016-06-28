package com.smartcold.bgzigbee.manage.dto;

import java.util.Date;

public class BaseDto {

	private int status;

	private long time;

	public BaseDto(int status) {
		this.status = status;
		this.time = new Date().getTime() / 1000;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public long getTime() {
		return time;
	}

	public void setTime(long time) {
		this.time = time;
	}

}
