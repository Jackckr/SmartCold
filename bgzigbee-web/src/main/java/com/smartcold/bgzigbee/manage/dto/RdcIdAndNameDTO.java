package com.smartcold.bgzigbee.manage.dto;

/**
 * Created by corly on 16-8-17.
 */
public class RdcIdAndNameDTO {
    private String table;
    private int rdcid;
    private String name;

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
}
