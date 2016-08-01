package com.smartcold.manage.cold.dto;

/**
 * 历史记录查询list
 * @author corly
 */
public class SearchMeta {
	private int type;
	private int oid;
	private String key;
	private String keyDesc;
	private String oidDesc;

	public SearchMeta(int type, int oid, String key, String keyDesc, String oidDesc) {
		super();
		this.type = type;
		this.oid = oid;
		this.key = key;
		this.keyDesc = keyDesc;
		this.oidDesc = oidDesc;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
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
		return keyDesc;
	}
	public void setTypeDesc(String typeDesc) {
		this.keyDesc = typeDesc;
	}
	public String getOidDesc() {
		return oidDesc;
	}
	public void setOidDesc(String oidDesc) {
		this.oidDesc = oidDesc;
	}
}
