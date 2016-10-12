package com.smartcold.bgzigbee.manage.entity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-03-19 16:25)
 */
public class ColdStorageSetEntity {

	private int id;

	private int coldStorageID;

	private int rdcId;

	private String name;

	private float startTemperature;

	private float energyCost;

	private Double longitude;

	private Double latitude;

	private String location;

	private String mapping;

	private float tempdiff;

	private Double overtempalarm;
	private Double overtempdelay;
	private Double length       ;
	private Double width        ;
	private Double height       ;
	private Double inhumidity   ;
	private Double outhumidity  ;
	private Double intempe      ;
    private Double outtempe     ;
	
    
    

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getColdStorageID() {
		return coldStorageID;
	}

	public void setColdStorageID(int coldStorageID) {
		this.coldStorageID = coldStorageID;
	}

	public int getRdcId() {
		return rdcId;
	}

	public void setRdcId(int rdcId) {
		this.rdcId = rdcId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public float getStartTemperature() {
		return startTemperature;
	}

	public void setStartTemperature(float startTemperature) {
		this.startTemperature = startTemperature;
	}

	public float getEnergyCost() {
		return energyCost;
	}

	public void setEnergyCost(float energyCost) {
		this.energyCost = energyCost;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getMapping() {
		return mapping;
	}

	public void setMapping(String mapping) {
		this.mapping = mapping;
	}

	public float getTempdiff() {
		return tempdiff;
	}

	public void setTempdiff(float tempdiff) {
		this.tempdiff = tempdiff;
	}

	public Double getOvertempalarm() {
		return overtempalarm;
	}

	public void setOvertempalarm(Double overtempalarm) {
		this.overtempalarm = overtempalarm;
	}

	public Double getOvertempdelay() {
		return overtempdelay;
	}

	public void setOvertempdelay(Double overtempdelay) {
		this.overtempdelay = overtempdelay;
	}

	public Double getLength() {
		return length;
	}

	public void setLength(Double length) {
		this.length = length;
	}

	public Double getWidth() {
		return width;
	}

	public void setWidth(Double width) {
		this.width = width;
	}

	public Double getHeight() {
		return height;
	}

	public void setHeight(Double height) {
		this.height = height;
	}

	public Double getInhumidity() {
		return inhumidity;
	}

	public void setInhumidity(Double inhumidity) {
		this.inhumidity = inhumidity;
	}

	public Double getOuthumidity() {
		return outhumidity;
	}

	public void setOuthumidity(Double outhumidity) {
		this.outhumidity = outhumidity;
	}

	public Double getIntempe() {
		return intempe;
	}

	public void setIntempe(Double intempe) {
		this.intempe = intempe;
	}

	public Double getOuttempe() {
		return outtempe;
	}

	public void setOuttempe(Double outtempe) {
		this.outtempe = outtempe;
	}
	
	
}
