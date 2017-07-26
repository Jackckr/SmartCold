package com.smartcold.bgzigbee.manage.enums;

/**
 * Created by corly on 16-8-13.
 */
public enum SetTables {
	
	
	STORAGESET(1, "coldstorageset", "冷库"),

	TEMPE(18, "tempset", "温度"),
	
	HUMIDITY(19, "humidityset", "湿度"),
	
	DOORSET(2, "coldstoragedoorset", "冷库门"),

	COMPRESSORGROUPSET(3, "compressorgroupset", "压缩机组"),

	BLOWERSET(4, "blowerset", "冷风机"),

	COMPRESSORSET(5, "compressorset", "单体压缩机"),

	WINDSCREENSET(6, "windscreenset", "风幕机"),

	EVAPORATIVESET(7, "evaporativeset", "冷凝系统"),

	EVAPORATIVEWATERSET(8, "evaporativewaterset", "冷凝系统水泵"),

	EVAPORATIVEBLOWERSET(9, "evaporativeblowerset", "冷凝系统风机"),

	POWERSET(10, "powerset", "电表"),

	PLATFORMDOORSET(11, "platformdoorset", "月台门"),

	PRESSUREPLATFORMSET(12, "pressureplatformset", "液压平台"),

	CHARGINGPILESET(13, "chargingpileset", "充电桩"),

	FORKLIFTSET(14, "forkliftset", "叉车"),

	COLDSTORAGELIGHTSET(15, "coldstoragelightset", "灯组"),

	CIRCULATINGPUMPSET(16, "circulatingpumpset", "防冻循环泵"),

	WALL(17, "wallset", "冷库墙");
	
	

	private int type;
	private String table;
	private String desc;

	private SetTables(int type, String table, String desc) {
		this.type = type;
		this.table = table;
		this.desc = desc;
	}

	public static SetTables getByType(int type) {
		for (SetTables item : SetTables.values()) {
			if (item.type == type)
				return item;
		}
		throw new IllegalArgumentException("invalid type");
	}

	public static boolean checkTable(String table) {
		for (SetTables item : SetTables.values()) {
			if (item.table.equals(table))
				return true;
		}
		throw new IllegalArgumentException("invalide table name: " + table);
	}

	public String getTable() {
		return table;
	}

	public int getType() {
		return type;
	}

	public String getDesc() {
		return desc;
	}
}
