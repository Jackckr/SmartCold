package com.smartcold.bgzigbee.manage.dto;

import com.smartcold.bgzigbee.manage.entity.FileDataEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-08-13 12:57)
 */
public class RdcAuthDTO {

    private int userId;

    private String userName;

    private List<FileDataEntity> authPics;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public List<FileDataEntity> getAuthPics() {
        return authPics;
    }

    public void setAuthPics(List<FileDataEntity> authPics) {
        this.authPics = authPics;
    }
}
