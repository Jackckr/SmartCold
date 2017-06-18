package com.smartcold.bgzigbee.manage.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.RdcEntity;

public interface RdcMapper {

	Page<RdcEntity> findRdcList(@Param("audit")Integer audit, @Param("keyword")String keyword);

	List<RdcEntity> findRDCByRDCId(@Param("rdcID") int rdcID);
	
	List<HashMap<String,Object>> getRdcByName(@Param("keyword")String keyword);

	int insertRdc(RdcEntity rdc);

	void updateRdc(RdcEntity rdcEntity);

	int checkName(String name);

	boolean checkCellphone(String cellphone);

	void updateMappingById(@Param("rdcId") int rdcId, @Param("mapping") String mapping);
	
	int deleteByRdcID(int rdcID);
	
	int changeAudit(@Param("rdcID") int rdcID,@Param("audit") int audit);
	
	List<HashMap<String, String>> getRdcMangConfig(@Param("rdcid")Integer rdcid );
	
	List<HashMap<String, String>> getRdcMangtlConfig(@Param("rdcid")Integer rdcid );
	
	void addRdcMangConfig(@Param("rdcid")Integer rdcid ,@Param("muid")String muid,@Param("uuid")String uuid,@Param("mtelephone")String mtelephone,@Param("uTelephone")String uTelephone,@Param("aTelephone")String aTelephone);
	
	void upRdcMangConfig(@Param("id")Integer id ,@Param("rdcid")Integer rdcid ,@Param("muid")String muid,@Param("uuid")String uuid,@Param("mtelephone")String mtelephone,@Param("uTelephone")String uTelephone,@Param("aTelephone")String aTelephone);

	RdcEntity getRdcById (Integer id);
	
	
}