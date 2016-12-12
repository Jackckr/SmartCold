package com.smartcold.zigbee.manage.entity;

/**
 * 消息实体类
 * @author jkq
 *
 */
public class MessageEntity {
	private int id;
	private int oid;//订单或者报警ID
	private int userid;//要通知的userid
    private int msgcount;//消息的数量
    private String msgdata;//消息内容
    private int msgcategory;//消息分类
    private String informtime;//通知时间
    private String msgpic = "app/img/food.jpg";//消息图片
    private String msgurl; //消息外链
    private int isread; //是否已读
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUserid() {
		return userid;
	}
	public int getOid() {
		return oid;
	}
	public void setOid(int oid) {
		this.oid = oid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	public int getMsgcount() {
		return msgcount;
	}
	public void setMsgcount(int msgcount) {
		this.msgcount = msgcount;
	}
	public String getMsgdata() {
		return msgdata;
	}
	public void setMsgdata(String msgdata) {
		this.msgdata = msgdata;
	}
	public int getMsgcategory() {
		return msgcategory;
	}
	public void setMsgcategory(int msgcategory) {
		this.msgcategory = msgcategory;
	}
	
	public String getInformtime() {
		return informtime;
	}
	public void setInformtime(String informtime) {
		this.informtime = informtime;
	}
	public String getMsgpic() {
		return msgpic;
	}
	public void setMsgpic(String msgpic) {
		this.msgpic = msgpic;
	}
	public String getMsgurl() {
		return msgurl;
	}
	public void setMsgurl(String msgurl) {
		this.msgurl = msgurl;
	}
	public int getIsread() {
		return isread;
	}
	public void setIsread(int isread) {
		this.isread = isread;
	}

    
}
