package com.smartcold.zigbee.manage.entity;

/**
 * Created by qiangzi on 2017/9/18.
 */
public class PushEntity {
    private long appKey;

    private String title;

    private String summary;

    private String token;

    private String userIds;

    private Integer type;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserIds() {
        return userIds;
    }

    public void setUserIds(String userIds) {
        this.userIds = userIds;
    }

    public long getAppKey() {
        return appKey;
    }

    public void setAppKey(long appKey) {
        this.appKey = appKey;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
