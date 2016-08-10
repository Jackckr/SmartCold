package com.smartcold.manage.cold.enums;

import java.io.Serializable;

public enum StorageType implements Serializable{

	STORAGE(1, "coldstorage", "冷库"),
	
	DOOR(2, "coldstoragedoor", "门"),
	
	COMPRESSOR(3, "compressorgroup", "压缩机"),

	BLOWER(4, "blower", "风机");
	
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
