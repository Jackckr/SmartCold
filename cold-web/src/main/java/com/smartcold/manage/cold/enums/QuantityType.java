package com.smartcold.manage.cold.enums;

import java.io.Serializable;
/**
 * 临时定义->无意义
 * @author Administrator
 *
 */

@Deprecated
public enum QuantityType implements Serializable{
	GoodsHeat(1,"GoodsHeat","Q货"),
	QFrost(4, "QFrost", "Q霜"),
	QForklift(2, "QForklift", "Q叉"),//2->14
	WallHeat(1,"WallHeat","5保温热量"),
	Qblower(4, "Qblower", "Q风"),
	Qctdoor(2, "Qctdoor", "Q门"),//2     换气
	Qlighting(2, "Qlighting", "Q照");//2->15
	private int type;
	private String key;
	private String desc;
	
	private QuantityType(int type, String table, String desc) {
		this.type = type;
		this.key = table;
		this.desc = desc;
	}
	
}
