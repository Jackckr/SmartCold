package com.smartcold.manage.cold.dao.olddb;

import com.smartcold.manage.cold.entity.olddb.SystemInformEntity;

public interface MessageMapper {
	
//  public  void  addwarningmessage(WarningMsgEntity data);
//  public  List<HashMap<String, Object>> findObjsetByOid(@Param("table")String table,@Param("oid")int oid);
    
  public void addsystemInform(SystemInformEntity data);
  
  
  
  
  
  
}
