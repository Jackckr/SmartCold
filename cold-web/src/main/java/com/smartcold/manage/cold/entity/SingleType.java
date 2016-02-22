package com.smartcold.manage.cold.entity;

import java.util.List;

public class SingleType {

	private String name;
	
	private int id;

	private List<GoodsEntity> goodsEntity;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<GoodsEntity> getGoodsEntity() {
		return goodsEntity;
	}

	public void setGoodsEntity(List<GoodsEntity> goodsEntity) {
		this.goodsEntity = goodsEntity;
	}
}
