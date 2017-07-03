package com.smartcold.zigbee.manage.entity;

import com.smartcold.zigbee.manage.dto.RdcShareDTO;

/**
 * Created by qiangzi on 2017/7/3.
 */
public class CollectEntity {
    private int id;
    private int uid;
    private int collectId;
    private int collectType;
    private RdcEntity rdcEntity;
    private RdcShareDTO rdcShareDTO;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getCollectId() {
        return collectId;
    }

    public void setCollectId(int collectId) {
        this.collectId = collectId;
    }

    public int getCollectType() {
        return collectType;
    }

    public void setCollectType(int collectType) {
        this.collectType = collectType;
    }

    public RdcEntity getRdcEntity() {
        return rdcEntity;
    }

    public void setRdcEntity(RdcEntity rdcEntity) {
        this.rdcEntity = rdcEntity;
    }

    public RdcShareDTO getRdcShareDTO() {
        return rdcShareDTO;
    }

    public void setRdcShareDTO(RdcShareDTO rdcShareDTO) {
        this.rdcShareDTO = rdcShareDTO;
    }
}
