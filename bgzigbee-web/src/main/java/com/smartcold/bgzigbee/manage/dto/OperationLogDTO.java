package com.smartcold.bgzigbee.manage.dto;

import java.util.Date;

public class OperationLogDTO {
    private Integer id;

    private String name;

    private Integer adminId;
    
    private String adminName;

    private Date addtime;

    private String result;

    private String requestUrl;

    private String content;
    
    public OperationLogDTO() {
	}

	public OperationLogDTO(String name, Integer adminId, Date addtime, String requestUrl, String content) {
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
}