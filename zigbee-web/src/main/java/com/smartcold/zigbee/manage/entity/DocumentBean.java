/*
* CreateDate : 2015-09-30 12:28:56
* CreateBy   : Bernie Chen  
 */
package com.smartcold.zigbee.manage.entity;

import java.io.InputStream;



public class DocumentBean {

	private String kcId;
	private String filetype;
	private String parameter;//保存附件的name值  例：AA  <input type="file" name="AA">
	
	private String name;
	private String suffix;
	private String fullname;
	private String url;
	private String folderPath;
	private String folderUrl;
	private String namenPath;
	private String appListThumbnailUrl;
	private String appThumbnailUrl;
	private String pcListThumbnailUrl;
	private String pcThumbnailUrl;
	private long size;
	private InputStream io;
	public String getFolderUrl() {
		return folderUrl;
	}
	public void setFolderUrl(String folderUrl) {
		this.folderUrl = folderUrl;
	}
	public String getParameter() {
		return parameter;
	}
	public void setParameter(String parameter) {
		this.parameter = parameter;
	}
	public String getKcId() {
		return kcId;
	}
	public void setKcId(String kcId) {
		this.kcId = kcId;
	}
	public String getFiletype() {
		return filetype;
	}
	public void setFiletype(String filetype) {
		this.filetype = filetype;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSuffix() {
		return suffix;
	}
	public void setSuffix(String suffix) {
		this.suffix = suffix;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getFolderPath() {
		return folderPath;
	}
	public void setFolderPath(String folderPath) {
		this.folderPath = folderPath;
	}
	public String getFullname() {
		return fullname;
	}
	public void setFullname(String fullname) {
		this.fullname = fullname;
	}
	public String getAppListThumbnailUrl() {
		return appListThumbnailUrl;
	}
	public void setAppListThumbnailUrl(String appListThumbnailUrl) {
		this.appListThumbnailUrl = appListThumbnailUrl;
	}
	public String getAppThumbnailUrl() {
		return appThumbnailUrl;
	}
	public void setAppThumbnailUrl(String appThumbnailUrl) {
		this.appThumbnailUrl = appThumbnailUrl;
	}
	public String getPcListThumbnailUrl() {
		return pcListThumbnailUrl;
	}
	public void setPcListThumbnailUrl(String pcListThumbnailUrl) {
		this.pcListThumbnailUrl = pcListThumbnailUrl;
	}
	public String getPcThumbnailUrl() {
		return pcThumbnailUrl;
	}
	public void setPcThumbnailUrl(String pcThumbnailUrl) {
		this.pcThumbnailUrl = pcThumbnailUrl;
	}
	
	public long getSize() {
		return size;
	}
	public void setSize(long size) {
		this.size = size;
	}
	public InputStream getIo() {
		return io;
	}
	public void setIo(InputStream io) {
		this.io = io;
	}
	public String getNamenPath() {
		return namenPath;
	}
	public void setNamenPath(String namenPath) {
		this.namenPath = namenPath;
	}



}