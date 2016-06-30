package com.smartcold.bgzigbee.manage.enums;

public enum SpiderItemType {

	COLDSTORAGE(1, "冷库"),

	COMPRESSOR(2, "压缩机组"),

	BLOWER(3, "风机"),

	WARNING(4, "告警"),

	UNKNOW(99, "未知");

	private int type;

	private String name;

	private SpiderItemType(int type, String name) {
		this.type = type;
		this.name = name;
	}

	public int getType() {
		return type;
	}

	public String getName() {
		return name;
	}

	public static SpiderItemType getSpiderItemType(int type) {
		for (SpiderItemType cs : values()) {
			if (cs.getType() == type) {
				return cs;
			}
		}

		return UNKNOW;
	}
}
