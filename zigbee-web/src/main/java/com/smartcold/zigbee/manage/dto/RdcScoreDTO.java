package com.smartcold.zigbee.manage.dto;

import com.smartcold.zigbee.manage.entity.FileDataEntity;

public class RdcScoreDTO {

    private int id;

    private String name;

    private float rdcscore;

    private int rdccommentcnt;

    private int rdcrecommendpercent;

    private FileDataEntity storagePic;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getRdcscore() {
        return rdcscore;
    }

    public void setRdcscore(float rdcscore) {
        this.rdcscore = rdcscore;
    }

    public int getRdccommentcnt() {
        return rdccommentcnt;
    }

    public void setRdccommentcnt(int rdccommentcnt) {
        this.rdccommentcnt = rdccommentcnt;
    }

    public int getRdcrecommendpercent() {
        return rdcrecommendpercent;
    }

    public void setRdcrecommendpercent(int rdcrecommendpercent) {
        this.rdcrecommendpercent = rdcrecommendpercent;
    }

    public FileDataEntity getStoragePic() {
        return storagePic;
    }

    public void setStoragePic(FileDataEntity storagePic) {
        this.storagePic = storagePic;
    }
}
