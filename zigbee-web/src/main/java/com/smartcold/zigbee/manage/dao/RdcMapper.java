package com.smartcold.zigbee.manage.dao;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestParam;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dto.RdcAddDTO;
import com.smartcold.zigbee.manage.dto.RdcEntityDTO;
import com.smartcold.zigbee.manage.entity.RdcEntity;

public interface RdcMapper {

    List<RdcEntity> findRdcList();

    List<RdcEntity> findRDCByRDCId(@Param("rdcID") int rdcID);

    int insertRdc(RdcEntity rdc);

    void updateRdc(RdcEntity rdcEntity);
    
    int checkName(String name);
    
    int deleteByRdcID(int rdcID);
    
    boolean checkCellphone(String cellphone);
   
    /**
     * 获得睿库分页信息
     * @param parameters
     * @return
     */
    public Page<RdcEntityDTO> getRDCList(Map<String, Object> parameters);

	Page<RdcEntityDTO> findRDCByUserId(@Param("userID") int userID, @Param("keyword") String keyword);
	
	public List<HashMap<String, Object>> findRDCById( int rdcID);
	
	RdcEntityDTO findRDCEntityDtoByRdcId(@Param("rdcID") int rdcID);

}