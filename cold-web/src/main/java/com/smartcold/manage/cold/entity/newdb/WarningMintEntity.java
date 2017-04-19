package com.smartcold.manage.cold.entity.newdb;

import java.util.List;

import com.smartcold.manage.cold.entity.olddb.FileDataEntity;

/**
 * ACL权限中心对象 Copyright 2016 CoderDream's Studio All right reserved. Creators
 * MaQiang Created on 2017年3月19日09:38:34
 */
public class WarningMintEntity {
	 private int  id              ;
	 private int  userId             ;
	 private int  refid           ;
	 private int  rdcid           ;
	 private int  type            ;
	 private int  oid             ;
	 private int  level           ;
	 private int  status          ;
	 private int  maintid     ;
	 private int  warningtype     ;
	 private String  mapper       ;
	 private String  warningmsg   ;
	 private String  analysismsg  ;
	 private String  desc         ;
	 private String  addtime      ;
	 private List<FileDataEntity> imgList;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getRefid() {
		return refid;
	}
	public void setRefid(int refid) {
		this.refid = refid;
	}
	public int getRdcid() {
		return rdcid;
	}
	public void setRdcid(int rdcid) {
		this.rdcid = rdcid;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getOid() {
		return oid;
	}
	public void setOid(int oid) {
		this.oid = oid;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public int getMaintid() {
		return maintid;
	}
	public void setMaintid(int maintid) {
		this.maintid = maintid;
	}
	public int getWarningtype() {
		return warningtype;
	}
	public void setWarningtype(int warningtype) {
		this.warningtype = warningtype;
	}
	public String getMapper() {
		return mapper;
	}
	public void setMapper(String mapper) {
		this.mapper = mapper;
	}
	public String getWarningmsg() {
		return warningmsg;
	}
	public void setWarningmsg(String warningmsg) {
		this.warningmsg = warningmsg;
	}
	public String getAnalysismsg() {
		return analysismsg;
	}
	public void setAnalysismsg(String analysismsg) {
		this.analysismsg = analysismsg;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getAddtime() {
		return addtime;
	}
	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}
	public List<FileDataEntity> getImgList() {
		return imgList;
	}
	public void setImgList(List<FileDataEntity> imgList) {
		this.imgList = imgList;
	}
	
}
