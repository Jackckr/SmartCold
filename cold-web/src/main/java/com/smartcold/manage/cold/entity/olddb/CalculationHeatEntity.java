package com.smartcold.manage.cold.entity.olddb;

import com.smartcold.manage.cold.dto.WallEntity;
import com.smartcold.manage.cold.entity.newdb.GoodsEntity;
import com.smartcold.manage.cold.entity.newdb.PackEntity;
import com.smartcold.manage.cold.entity.newdb.UsageEntity;

public class CalculationHeatEntity {

	private int length;

	private int weight;

	private int height;

	private float outsideTemperature;

	private float insideTemperature;

	private float outsideHumidity;

	private float insideHumidity;

	private float circulation;

	private float loadTemperature;

	private float freezingHour;

	private WallEntity leftWall;

	private WallEntity rightWall;

	private WallEntity frontWall;

	private WallEntity behindWall;

	private WallEntity ceiling;

	private WallEntity floor;

	private GoodsEntity goods;
	
	private int goodsType;

	private float goodsFromTemperature;

	private float goodsToTemperature;

	private float goodsWeight;

	private float goodsTotalWeight;

	private UsageEntity usage;

	private float density;

	private PackEntity pack;

	private float refrigeration;

	private float dailyLoad;

	private float lightLoad;

	private float otherLoad;

	private int people;

	private float costTime;

	public int getLength() {
		return length;
	}

	public void setLength(int length) {
		this.length = length;
	}

	public int getWeight() {
		return weight;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public float getOutsideTemperature() {
		return outsideTemperature;
	}

	public void setOutsideTemperature(float outsideTemperature) {
		this.outsideTemperature = outsideTemperature;
	}

	public float getInsideTemperature() {
		return insideTemperature;
	}

	public void setInsideTemperature(float insideTemperature) {
		this.insideTemperature = insideTemperature;
	}

	public float getOutsideHumidity() {
		return outsideHumidity;
	}

	public void setOutsideHumidity(float outsideHumidity) {
		this.outsideHumidity = outsideHumidity;
	}

	public float getInsideHumidity() {
		return insideHumidity;
	}

	public void setInsideHumidity(float insideHumidity) {
		this.insideHumidity = insideHumidity;
	}

	public float getCirculation() {
		return circulation;
	}

	public void setCirculation(float circulation) {
		this.circulation = circulation;
	}

	public float getLoadTemperature() {
		return loadTemperature;
	}

	public void setLoadTemperature(float loadTemperature) {
		this.loadTemperature = loadTemperature;
	}

	public float getFreezingHour() {
		return freezingHour;
	}

	public void setFreezingHour(float freezingHour) {
		this.freezingHour = freezingHour;
	}

	public WallEntity getLeftWall() {
		return leftWall;
	}

	public void setLeftWall(WallEntity leftWall) {
		this.leftWall = leftWall;
	}

	public WallEntity getRightWall() {
		return rightWall;
	}

	public void setRightWall(WallEntity rightWall) {
		this.rightWall = rightWall;
	}

	public WallEntity getFrontWall() {
		return frontWall;
	}

	public void setFrontWall(WallEntity frontWall) {
		this.frontWall = frontWall;
	}

	public WallEntity getBehindWall() {
		return behindWall;
	}

	public void setBehindWall(WallEntity behindWall) {
		this.behindWall = behindWall;
	}

	public WallEntity getCeiling() {
		return ceiling;
	}

	public void setCeiling(WallEntity ceiling) {
		this.ceiling = ceiling;
	}

	public WallEntity getFloor() {
		return floor;
	}

	public void setFloor(WallEntity floor) {
		this.floor = floor;
	}

	public GoodsEntity getGoods() {
		return goods;
	}

	public void setGoods(GoodsEntity goods) {
		this.goods = goods;
	}

	public int getGoodsType() {
		return goodsType;
	}

	public void setGoodsType(int goodsType) {
		this.goodsType = goodsType;
	}

	public float getGoodsFromTemperature() {
		return goodsFromTemperature;
	}

	public void setGoodsFromTemperature(float goodsFromTemperature) {
		this.goodsFromTemperature = goodsFromTemperature;
	}

	public float getGoodsToTemperature() {
		return goodsToTemperature;
	}

	public void setGoodsToTemperature(float goodsToTemperature) {
		this.goodsToTemperature = goodsToTemperature;
	}

	public float getGoodsWeight() {
		return goodsWeight;
	}

	public void setGoodsWeight(float goodsWeight) {
		this.goodsWeight = goodsWeight;
	}

	public float getGoodsTotalWeight() {
		return goodsTotalWeight;
	}

	public void setGoodsTotalWeight(float goodsTotalWeight) {
		this.goodsTotalWeight = goodsTotalWeight;
	}

	public UsageEntity getUsage() {
		return usage;
	}

	public void setUsage(UsageEntity usage) {
		this.usage = usage;
	}

	public float getDensity() {
		return density;
	}

	public void setDensity(float density) {
		this.density = density;
	}

	public PackEntity getPack() {
		return pack;
	}

	public void setPack(PackEntity pack) {
		this.pack = pack;
	}

	public float getRefrigeration() {
		return refrigeration;
	}

	public void setRefrigeration(float refrigeration) {
		this.refrigeration = refrigeration;
	}

	public float getDailyLoad() {
		return dailyLoad;
	}

	public void setDailyLoad(float dailyLoad) {
		this.dailyLoad = dailyLoad;
	}

	public float getLightLoad() {
		return lightLoad;
	}

	public void setLightLoad(float lightLoad) {
		this.lightLoad = lightLoad;
	}

	public float getOtherLoad() {
		return otherLoad;
	}

	public void setOtherLoad(float otherLoad) {
		this.otherLoad = otherLoad;
	}

	public int getPeople() {
		return people;
	}

	public void setPeople(int people) {
		this.people = people;
	}

	public float getCostTime() {
		return costTime;
	}

	public void setCostTime(float costTime) {
		this.costTime = costTime;
	}
}
