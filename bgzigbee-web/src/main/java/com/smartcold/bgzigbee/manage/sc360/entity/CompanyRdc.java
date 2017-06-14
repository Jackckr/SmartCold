package com.smartcold.bgzigbee.manage.sc360.entity;

import com.smartcold.bgzigbee.manage.entity.RdcEntity;

import java.util.Date;

public class CompanyRdc {
    private Integer id;

    private Integer companyid;

    private Integer rdcid;

    private String imgurl;
    
    private Date addtime;

    private Company company;

    private RdcEntity rdc;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCompanyid() {
        return companyid;
    }

    public void setCompanyid(Integer companyid) {
        this.companyid = companyid;
    }

    public Integer getRdcid() {
        return rdcid;
    }

    public void setRdcid(Integer rdcid) {
        this.rdcid = rdcid;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }

	public String getImgurl()
	{
		return imgurl;
	}

	public void setImgurl(String imgurl)
	{
		this.imgurl = imgurl;
	}

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public RdcEntity getRdc() {
        return rdc;
    }

    public void setRdc(RdcEntity rdc) {
        this.rdc = rdc;
    }
}