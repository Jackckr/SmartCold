package com.smartcold.manage.cold.enums;

import java.io.Serializable;

public enum StorageType implements Serializable{

	STORAGE(1, "coldstorage", "冷库"),
	
	DOOR(2, "coldstoragedoor", "冷库门"),
	
	COMPRESSORGROUP(3, "compressorgroup", "压缩机组"),

	BLOWER(4, "blower", "冷风机"),

	COMPRESSOR(5, "compressor", "单体压缩机"),

	WINDSCREEN(6, "windscreen", "风幕机"),

	EVAPORATIVE(7, "evaporative", "蒸发冷系统"),

	EVAPORATIVEWATER(8, "evaporativewater", "蒸发冷水泵"),

	EVAPORATIVEBLOWER(9, "evaporativeblower", "蒸发冷风机"),

	POWER(10, "power", "电表"),

	PLATFORMDOOR(11, "platformdoor", "月台门"),

	PRESSUREPLATFORM(12, "pressureplatform", "液压平台"),

	CHARGINGPILE(13, "chargingpile", "充电桩"),

	FORKLIFT(14, "forklift", "叉车"),

	COLDSTORAGELIGHT(15, "coldstoragelight", "灯组"),

	CIRCULATINGPUMP(16, "circulatingpump", "防冻循环泵");


	private int type;
	private String table;
	private String desc;
	
	private StorageType(int type, String table, String desc) {
		this.type = type;
		this.table = table;
		this.desc = desc;
	}
	
	public static StorageType getStorageType(int type){
		for(StorageType item : values()){
			if (item.getType() == type) {
				return item;
			}
		}
		throw new IllegalArgumentException("type is not correct");
	}
	
	public int getType() {
		return type;
	}

	public String getTable() {
		return table;
	}

	public String getDesc() {
		return desc;
	}
}
