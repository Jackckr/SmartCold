package com.smartcold.manage.cold.entity.olddb;
/**
 * @author MengShuang 
 * @Date 2016年6月16日 下午2:37:38
 */
public class FileDataEntity {
	private int id;
	private String type;
	private String location;
	private String category;
	private int belongid;
	private String name;
	private String description;
	
	public FileDataEntity() {
		// TODO Auto-generated constructor stub
	}
	
	public FileDataEntity(String type, String location, String category,
			int belongid, String name) {
		super();
		this.type = type;
		this.location = location;
		this.category = category;
		this.belongid = belongid;
		this.name = name;
	}


	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public int getBelongid() {
		return belongid;
	}
	public void setBelongid(int belongid) {
		this.belongid = belongid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
}
