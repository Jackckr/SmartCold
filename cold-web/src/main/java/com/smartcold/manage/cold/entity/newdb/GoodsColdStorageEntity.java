package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-03-19 11:54)
 */
public class GoodsColdStorageEntity {

	private int id;

	private int coldstorageid;

	private float frozenInputQuantity;

	private float forzenOutputQuantity;

	private float freshIutputQuantity;

	private float freshOutputQuantity;

	private float frozenInputTemperature;

	private float freshInputTemperature;

	private Date collectionTime;

	private Date addTime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getColdstorageid() {
		return coldstorageid;
	}

	public void setColdstorageid(int coldstorageid) {
		this.coldstorageid = coldstorageid;
	}

	public float getFrozenInputQuantity() {
		return frozenInputQuantity;
	}

	public void setFrozenInputQuantity(float frozenInputQuantity) {
		this.frozenInputQuantity = frozenInputQuantity;
	}

	public float getForzenOutputQuantity() {
		return forzenOutputQuantity;
	}

	public void setForzenOutputQuantity(float forzenOutputQuantity) {
		this.forzenOutputQuantity = forzenOutputQuantity;
	}

	public float getFreshIutputQuantity() {
		return freshIutputQuantity;
	}

	public void setFreshIutputQuantity(float freshIutputQuantity) {
		this.freshIutputQuantity = freshIutputQuantity;
	}

	public float getFreshOutputQuantity() {
		return freshOutputQuantity;
	}

	public void setFreshOutputQuantity(float freshOutputQuantity) {
		this.freshOutputQuantity = freshOutputQuantity;
	}

	public float getFrozenInputTemperature() {
		return frozenInputTemperature;
	}

	public void setFrozenInputTemperature(float frozenInputTemperature) {
		this.frozenInputTemperature = frozenInputTemperature;
	}

	public float getFreshInputTemperature() {
		return freshInputTemperature;
	}

	public void setFreshInputTemperature(float freshInputTemperature) {
		this.freshInputTemperature = freshInputTemperature;
	}

	public Date getCollectionTime() {
		return collectionTime;
	}

	public void setCollectionTime(Date collectionTime) {
		this.collectionTime = collectionTime;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}
}
