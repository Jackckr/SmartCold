package com.smartcold.manage.cold.enums;

public enum StorageType {

	STORAGE_TEMP(1, "newstorage", "冷库温度"),
	
	STORAGE_POWER(2, "newstorage", "冷库电量"),
	
	STORAGE_DOOR(3, "newdoor", "冷库门"),
	
	COMPRESSOR_POWER(4, "newcompressor", "压缩机电量"),
	
	COMPRESSOR_PRESS_L(5, "newcompressor", "压缩机低压"),
	
	COMPRESSOR_PRESS_H(6, "newcompressor", "压缩机高压");
	
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
