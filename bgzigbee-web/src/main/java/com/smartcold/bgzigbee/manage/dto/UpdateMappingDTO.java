package com.smartcold.bgzigbee.manage.dto;

/**
 * Created by corly on 16-8-20.
 */
public class UpdateMappingDTO {
    private String table;
    private int id;
    private String mapping;

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMapping() {
        return mapping;
    }

    public void setMapping(String mapping) {
        this.mapping = mapping;
    }
}
