package com.smartcold.bgzigbee.manage.dto;

/**
 * Created by corly on 16-8-17.
 */
public class RdcIdAndNameDTO {
    private int rdcid;
    private String table;
    private String name;
    private double power;
    private String mapping;
    

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public int getRdcid() {
        return rdcid;
    }

    public void setRdcid(int rdcid) {
        this.rdcid = rdcid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

	public double getPower() {
		return power;
	}

	public void setPower(double power) {
		this.power = power;
	}

	public String getMapping() {
		return mapping;
	}

	public void setMapping(String mapping) {
		this.mapping = mapping;
	}
    
    
}
