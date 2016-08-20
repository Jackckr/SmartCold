package com.smartcold.manage.cold.entity.olddb;

public class RdcSensor {
    private Integer rsid;

    private Integer sid;

    private Integer rdcid;

    private Integer sx;

    private Integer sy;

    private Integer coldstorageid;
    
    private int type;
    
    private int oid;
    
    private String key;

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

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Integer getRsid() {
        return rsid;
    }

    public void setRsid(Integer rsid) {
        this.rsid = rsid;
    }

    public Integer getSid() {
        return sid;
    }

    public void setSid(Integer sid) {
        this.sid = sid;
    }

    public Integer getRdcid() {
        return rdcid;
    }

    public void setRdcid(Integer rdcid) {
        this.rdcid = rdcid;
    }

    public Integer getSx() {
        return sx;
    }

    public void setSx(Integer sx) {
        this.sx = sx;
    }

    public Integer getSy() {
        return sy;
    }

    public void setSy(Integer sy) {
        this.sy = sy;
    }

    public void setColdstorageid(Integer coldstorageid) {
        this.coldstorageid = coldstorageid;
    }

    public Integer getColdstorageid() {
        return coldstorageid;
    }
}