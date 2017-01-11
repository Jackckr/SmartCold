package com.smartcold.manage.cold.dto;

import java.util.Date;

public class CostEntity {
	private double cost;

	private Date time;

	public CostEntity(double cost, Date time) {
		this.cost = cost;
		this.time = time;
	}

	public double getCost() {
		return cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

}
