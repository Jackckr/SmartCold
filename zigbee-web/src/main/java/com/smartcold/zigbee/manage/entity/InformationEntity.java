package com.smartcold.zigbee.manage.entity;

import java.util.Date;
/**
 * 资讯实体类
 * @author jkq
 *
 */
public class InformationEntity {
	private int id;
	private String title;//标题
	private String keywords;//关键词
	private int category;//分类，关联查询分类名称
	private int posterid;//发布者id，关联admin实体类
	private int browsenum;//浏览量
	private String content;//内容
	private Date posttime;//发布时间
	private String coverpic = "app/img/food.jpg";
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getKeywords() {
		return keywords;
	}
	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}
	public int getCategory() {
		return category;
	}
	public void setCategory(int category) {
		this.category = category;
	}
	public int getPosterid() {
		return posterid;
	}
	public void setPosterid(int posterid) {
		this.posterid = posterid;
	}
	public int getBrowsenum() {
		return browsenum;
	}
	public void setBrowsenum(int browsenum) {
		this.browsenum = browsenum;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Date getPosttime() {
		return posttime;
	}
	public void setPosttime(Date posttime) {
		this.posttime = posttime;
	}
	public String getCoverpic() {
		return coverpic;
	}
	public void setCoverpic(String coverpic) {
		this.coverpic = coverpic;
	}
	
	
}
