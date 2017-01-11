package com.smartcold.manage.cold.dto;

import java.util.Date;

public class DataResultDto {

	private String status;

	private String time;

	public DataResultDto(int status) {
		this.status = Integer.toString(status);
		this.time = Long.toString(new Date().getTime() / 1000);
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

}
