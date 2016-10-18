package com.smartcold.manage.cold.enums;

import java.io.Serializable;
/**
 * 临时定义->无意义
 * @author Administrator
 *
 */

@Deprecated
public enum QuantityType implements Serializable{

	QFrost(7, "QFrost", "Q霜"),
	Qblower(7, "Qblower", "Q风"),
	Qctdoor(7, "Qctdoor", "Q门"),//换气
	QForklift(7, "QForklift", "Q叉"),
	Qlighting(7, "Qlighting", "Q照");
	private int type;
	private String key;
	private String desc;
	
	private QuantityType(int type, String table, String desc) {
		this.type = type;
		this.key = table;
		this.desc = desc;
	}
	
}
