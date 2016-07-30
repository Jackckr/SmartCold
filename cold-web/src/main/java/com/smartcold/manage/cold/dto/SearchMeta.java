package com.smartcold.manage.cold.dto;

/**
 * 历史记录查询list
 * @author corly
 */
public class SearchMeta {
	private int type;
	private int oid;
	private String typeDesc;
	private String oidDesc;

	public SearchMeta(int type, int oid, String typeDesc, String oidDesc) {
		super();
		this.type = type;
		this.oid = oid;
		this.typeDesc = typeDesc;
		this.oidDesc = oidDesc;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getOid() {
		return oid;
	}
	public void setOid(int oid) {
		this.oid = oid;
	}
	public String getTypeDesc() {
		return typeDesc;
	}
	public void setTypeDesc(String typeDesc) {
		this.typeDesc = typeDesc;
	}
	public String getOidDesc() {
		return oidDesc;
	}
	public void setOidDesc(String oidDesc) {
		this.oidDesc = oidDesc;
	}
}
