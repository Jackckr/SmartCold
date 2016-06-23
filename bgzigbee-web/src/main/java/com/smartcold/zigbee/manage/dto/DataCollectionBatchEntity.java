package com.smartcold.zigbee.manage.dto;

import java.util.List;

public class DataCollectionBatchEntity {

	private String apID;

	private List<InfoEntity> infos;

	public class InfoEntity {

		private String devID;

		private long time;

		private float temp;

		public long getTime() {
			return this.time;
		}

		public void setTime(long time) {
			this.time = time;
		}

		public float getTemp() {
			return this.temp;
		}

		public void setTemp(float temp) {
			this.temp = temp;
		}

		public String getDevID() {
			return devID;
		}

		public void setDevID(String devID) {
			this.devID = devID;
		}
	}

	public String getApID() {
		return apID;
	}

	public void setApID(String apID) {
		this.apID = apID;
	}

	public List<InfoEntity> getInfos() {
		return infos;
	}

	public void setInfos(List<InfoEntity> infos) {
		this.infos = infos;
	}

}
