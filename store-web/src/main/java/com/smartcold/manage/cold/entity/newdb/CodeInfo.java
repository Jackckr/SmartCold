package com.smartcold.manage.cold.entity.newdb;

import java.io.Serializable;  
  
public class CodeInfo implements Serializable{  
  
    private static final long serialVersionUID = 1L;  
      
    private Long id;  
    private String name;  
    private String code;  
    private String descr;  
    private String descrE;  
    private String createdBy;  
    private Long createdAt;  
      
    private String time;  
    private String tagCode;  
    private String tagName;  
  
    public Long getId() {  
        return id;  
    }  
  
    public void setId(Long id) {  
        this.id = id;  
    }  
  
    public String getName() {  
        return name;  
    }  
  
    public void setName(String name) {  
        this.name = name;  
    }  
  
    public String getCode() {  
        return code;  
    }  
  
    public void setCode(String code) {  
        this.code = code;  
    }  
  
    public String getDescr() {  
        return descr;  
    }  
  
    public void setDescr(String descr) {  
        this.descr = descr;  
    }  
  
    public String getDescrE() {  
        return descrE;  
    }  
  
    public void setDescrE(String descrE) {  
        this.descrE = descrE;  
    }  
  
    public String getCreatedBy() {  
        return createdBy;  
    }  
  
    public void setCreatedBy(String createdBy) {  
        this.createdBy = createdBy;  
    }  
  
    public Long getCreatedAt() {  
        return createdAt;  
    }  
  
    public void setCreatedAt(Long createdAt) {  
        this.createdAt = createdAt;  
    }  
  
    public String getTime() {  
        return time;  
    }  
  
    public void setTime(String time) {  
        this.time = time;  
    }  
  
    public String getTagCode() {  
        return tagCode;  
    }  
  
    public void setTagCode(String tagCode) {  
        this.tagCode = tagCode;  
    }  
  
    public String getTagName() {  
        return tagName;  
    }  
  
    public void setTagName(String tagName) {  
        this.tagName = tagName;  
    }  
  
}  

