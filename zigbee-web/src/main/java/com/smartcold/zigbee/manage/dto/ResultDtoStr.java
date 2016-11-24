package com.smartcold.zigbee.manage.dto;

public class ResultDtoStr {

	private String status;

	private String message;

	public ResultDtoStr() {

	}

	public ResultDtoStr(String status, String message) {
		this.status = status;
		this.message = message;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
