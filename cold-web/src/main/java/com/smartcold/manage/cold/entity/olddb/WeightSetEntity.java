package com.smartcold.manage.cold.entity.olddb;

/**
 * Copyright (C) DCIS 版权所有
 * 功能描述: 权重比-->临时用
 * Create on MaQiang 2016年10月19日17:04:40
 **/
public class WeightSetEntity {
    private Integer	id             ;
    private Integer	rdcid          ;
    private double	factor1        ;
    private double	factor2        ;
    private double	factor3        ;
    private double	factor4        ;
    private double	transport1     ;
    private double	transport2     ;
    private double	transport3     ;
    private double	crew1          ;
    private double	crew2          ;
    private double	crew3           ;
    
    
    
	public WeightSetEntity() {
		super();
	}
	
	public WeightSetEntity( double factor1, double factor2,
			double factor3,double factor4, double transport1, double transport2,
			double transport3, double crew1, double crew2, double crew3) {
		super();
		
		this.factor1 = factor1;
		this.factor2 = factor2;
		this.factor3 = factor3;
		this.factor4 = factor4;
		this.transport1 = transport1;
		this.transport2 = transport2;
		this.transport3 = transport3;
		this.crew1 = crew1;
		this.crew2 = crew2;
		this.crew3 = crew3;
	}

	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getRdcid() {
		return rdcid;
	}
	public void setRdcid(Integer rdcid) {
		this.rdcid = rdcid;
	}
	public double getFactor1() {
		return factor1;
	}
	public void setFactor1(double factor1) {
		this.factor1 = factor1;
	}
	public double getFactor2() {
		return factor2;
	}
	public void setFactor2(double factor2) {
		this.factor2 = factor2;
	}
	public double getFactor3() {
		return factor3;
	}
	public void setFactor3(double factor3) {
		this.factor3 = factor3;
	}
	
	public double getFactor4() {
		return factor4;
	}

	public void setFactor4(double factor4) {
		this.factor4 = factor4;
	}

	public double getTransport1() {
		return transport1;
	}
	public void setTransport1(double transport1) {
		this.transport1 = transport1;
	}
	public double getTransport2() {
		return transport2;
	}
	public void setTransport2(double transport2) {
		this.transport2 = transport2;
	}
	public double getTransport3() {
		return transport3;
	}
	public void setTransport3(double transport3) {
		this.transport3 = transport3;
	}
	public double getCrew1() {
		return crew1;
	}
	public void setCrew1(double crew1) {
		this.crew1 = crew1;
	}
	public double getCrew2() {
		return crew2;
	}
	public void setCrew2(double crew2) {
		this.crew2 = crew2;
	}
	public double getCrew3() {
		return crew3;
	}
	public void setCrew3(double crew3) {
		this.crew3 = crew3;
	}
}
