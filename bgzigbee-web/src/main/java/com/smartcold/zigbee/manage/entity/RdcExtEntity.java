package com.smartcold.zigbee.manage.entity;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 22:19)
 */
public class RdcExtEntity {

    private int id;

    private int RDCID;

    private byte companydevice;

    private byte companystaff;

    private byte managetype;

    private byte storagetype;

    private byte storageheight;

    private byte storagestruct;

    private byte storageplatform;

    private byte storageplatformtype;

    private byte storageislihuo;

    private byte storagelihuocontrol;

    private int storagelihuoarea;

    private byte storagerefreg;

    private byte storagetempmonitor;

    private String storagecapacity;

    private String storagetruck;

    private byte storagetempertype;

    private String facility;

    private String honorpiclocation;

    private String arrangepiclocation;

    private String storagepiclocation;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRDCID() {
        return RDCID;
    }

    public void setRDCID(int RDCID) {
        this.RDCID = RDCID;
    }

    public byte getCompanydevice() {
        return companydevice;
    }

    public void setCompanydevice(byte companydevice) {
        this.companydevice = companydevice;
    }

    public byte getCompanystaff() {
        return companystaff;
    }

    public void setCompanystaff(byte companystaff) {
        this.companystaff = companystaff;
    }


    public byte getStoragetype() {
        return storagetype;
    }

    public void setStoragetype(byte storagetype) {
        this.storagetype = storagetype;
    }

    public byte getStorageheight() {
        return storageheight;
    }

    public void setStorageheight(byte storageheight) {
        this.storageheight = storageheight;
    }

    public byte getStoragestruct() {
        return storagestruct;
    }

    public void setStoragestruct(byte storagestruct) {
        this.storagestruct = storagestruct;
    }

    public byte getStorageplatform() {
        return storageplatform;
    }

    public void setStorageplatform(byte storageplatform) {
        this.storageplatform = storageplatform;
    }

    public byte getStorageplatformtype() {
        return storageplatformtype;
    }

    public void setStorageplatformtype(byte storageplatformtype) {
        this.storageplatformtype = storageplatformtype;
    }

    public byte getStorageislihuo() {
        return storageislihuo;
    }

    public void setStorageislihuo(byte storageislihuo) {
        this.storageislihuo = storageislihuo;
    }

    public byte getManagetype() {
		return managetype;
	}

	public void setManagetype(byte managetype) {
		this.managetype = managetype;
	}

	public byte getStoragelihuocontrol() {
        return storagelihuocontrol;
    }

    public void setStoragelihuocontrol(byte storagelihuocontrol) {
        this.storagelihuocontrol = storagelihuocontrol;
    }

    public int getStoragelihuoarea() {
        return storagelihuoarea;
    }

    public void setStoragelihuoarea(int storagelihuoarea) {
        this.storagelihuoarea = storagelihuoarea;
    }

    public byte getStoragerefreg() {
        return storagerefreg;
    }

    public void setStoragerefreg(byte storagerefreg) {
        this.storagerefreg = storagerefreg;
    }

    public byte getStoragetempmonitor() {
        return storagetempmonitor;
    }

    public void setStoragetempmonitor(byte storagetempmonitor) {
        this.storagetempmonitor = storagetempmonitor;
    }

    public String getStoragecapacity() {
        return storagecapacity;
    }

    public void setStoragecapacity(String storagecapacity) {
        this.storagecapacity = storagecapacity;
    }

    public String getStoragetruck() {
        return storagetruck;
    }

    public void setStoragetruck(String storagetruck) {
        this.storagetruck = storagetruck;
    }

    public byte getStoragetempertype() {
        return storagetempertype;
    }

    public void setStoragetempertype(byte storagetempertype) {
        this.storagetempertype = storagetempertype;
    }

    public String getFacility() {
        return facility;
    }

    public void setFacility(String facility) {
        this.facility = facility;
    }

    public String getHonorpiclocation() {
        return honorpiclocation;
    }

    public void setHonorpiclocation(String honorpiclocation) {
        this.honorpiclocation = honorpiclocation;
    }

    public String getArrangepiclocation() {
        return arrangepiclocation;
    }

    public void setArrangepiclocation(String arrangepiclocation) {
        this.arrangepiclocation = arrangepiclocation;
    }

    public String getStoragepiclocation() {
        return storagepiclocation;
    }

    public void setStoragepiclocation(String storagepiclocation) {
        this.storagepiclocation = storagepiclocation;
    }
}
