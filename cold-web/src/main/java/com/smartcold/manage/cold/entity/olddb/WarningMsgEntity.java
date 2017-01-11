package com.smartcold.manage.cold.entity.olddb;
/**
 * Copyright (C) DCIS 版权所有
 * 功能描述: 告警消息
 * Create on MaQiang 2016年9月27日11:54:21
 **/
public class WarningMsgEntity {
		private int	id         ;
		private int	type       ;
		private int	rdcid      ;
		private String	typeName   ;
		private String	telephone  ;
		private String	message    ;
		private String	addtime    ;
		
		public WarningMsgEntity(){
			super();
		}
		public WarningMsgEntity(int type, int rdcid, String typeName,String telephone, String message) {
			super();
			this.type = type;
			this.rdcid = rdcid;
			this.typeName = typeName;
			this.telephone = telephone;
			this.message = message;
		}
		public int getId() {
			return id;
		}
		public void setId(int id) {
			this.id = id;
		}
		public int getType() {
			return type;
		}
		public void setType(int type) {
			this.type = type;
		}
		public int getRdcid() {
			return rdcid;
		}
		public void setRdcid(int rdcid) {
			this.rdcid = rdcid;
		}
		public String getTypeName() {
			return typeName;
		}
		public void setTypeName(String typeName) {
			this.typeName = typeName;
		}
		public String getTelephone() {
			return telephone;
		}
		public void setTelephone(String telephone) {
			this.telephone = telephone;
		}
		public String getMessage() {
			return message;
		}
		public void setMessage(String message) {
			this.message = message;
		}
		public String getAddtime() {
			return addtime;
		}
		public void setAddtime(String addtime) {
			this.addtime = addtime;
		}
}
