package com.smartcold.zigbee.manage.entity;


/**
 * Created by qiangzi on 2017/5/18.
 */
/*冷库认证实体类*/
public class RdcAuthEntity {
	private int id           ;
	private int uid          ;
	private int type        ;
	private int rdcid        ;
	private int state        ;
	private String imgurl       ;
	private String note         ;
	private String msg          ;
	private String addtime      ;
	
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public int getRdcid() {
		return rdcid;
	}
	public void setRdcid(int rdcid) {
		this.rdcid = rdcid;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public String getImgurl() {
		return imgurl;
	}
	public void setImgurl(String imgurl) {
		this.imgurl = imgurl;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public String getAddtime() {
		return addtime;
	}
	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
}
