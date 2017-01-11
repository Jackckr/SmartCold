package com.smartcold.manage.cold.dao.olddb;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.WarningMsgEntity;

public interface MessageMapper {
	
  public  void  addwarningmessage(WarningMsgEntity data);
    
  public  List<HashMap<String, Object>> findObjsetByOid(@Param("table")String table,@Param("oid")int oid);
  
  
}
