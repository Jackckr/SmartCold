package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

public class OperationLog {
    private Integer id;

    private String name;

    private Integer adminId;

    private Date addtime;

    private String result;

    private String requestUrl;

    private String content;

    private Integer type;

    private Integer stype;

    private String mapper;

    public OperationLog() {
	}
    
    public OperationLog(String name, Integer adminId, String requestUrl, String content) {
		super();
		this.result = "成功";
		this.name = name;
		this.adminId = adminId;
		this.addtime = new Date();
		this.requestUrl = requestUrl;
		this.content = content;
	}

	public OperationLog(String name, Integer adminId, Date addtime, String requestUrl, String content) {
		super();
		this.result = "成功";
		this.name = name;
		this.adminId = adminId;
		this.addtime = addtime;
		this.requestUrl = requestUrl;
		this.content = content;
	}

	public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result == null ? null : result.trim();
    }

    public String getRequestUrl() {
        return requestUrl;
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl == null ? null : requestUrl.trim();
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content == null ? null : content.trim();
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStype() {
        return stype;
    }

    public void setStype(Integer stype) {
        this.stype = stype;
    }

    public String getMapper() {
        return mapper;
    }

    public void setMapper(String mapper) {
        this.mapper = mapper;
    }
}