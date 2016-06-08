package com.smartcold.zigbee.manage.dto;
/**
 * @author jiangkaiqiang
 * @date 2016-6-7 下午8:10:02  
 * @Description: UploadFileEntity,used to upload file
 */
public class UploadFileEntity {
	private String name;//file name-->FTP client
	private String qualifiedName;//file path + file name--->local
	private String path; //file path-->FTP client
	public UploadFileEntity(String name, String qualifiedName, String path) {
		super();
		this.name = name;
		this.qualifiedName = qualifiedName;
		this.path = path;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getQualifiedName() {
		return qualifiedName;
	}
	public void setQualifiedName(String qualifiedName) {
		this.qualifiedName = qualifiedName;
	}

}
