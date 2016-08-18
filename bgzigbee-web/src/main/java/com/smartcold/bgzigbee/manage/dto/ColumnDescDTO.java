package com.smartcold.bgzigbee.manage.dto;

/**
 * Created by corly on 16-8-16.
 */
public class ColumnDescDTO {
    private String field;
    private String comment;

    public ColumnDescDTO() {
    }

    public ColumnDescDTO(String field, String comment) {
        this.field = field;
        this.comment = comment;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
