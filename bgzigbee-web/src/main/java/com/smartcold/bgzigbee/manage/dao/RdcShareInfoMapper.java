package com.smartcold.bgzigbee.manage.dao;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.RdcShareDTO;
import com.smartcold.bgzigbee.manage.entity.RdcSharedInfoEntity;

/**
 * Created by qiangzi on 2017/5/24.
 */
public interface RdcShareInfoMapper {


	public RdcSharedInfoEntity findShareInfoById(Integer id);

    public void delShareInfoById(Integer id);
    
    int delByRdcId(int rdcId);
    
    /**
	   * 更新发布消息
	   * @param rdcShareDTO
	   * @return
	   */
    public int addshareInfo(RdcShareDTO rdcShareDTO);
	  /**
	   * 更新发布消息
	   * @param rdcShareDTO
	   * @return
	   */
	 public int updateshareInfo(RdcShareDTO rdcShareDTO);
	 
	 public  List<RdcSharedInfoEntity> findShareInfo(@Param("type") String type,@Param("stauts") String stauts,@Param("keyword")String keyword,@Param("startTime") Date sTime,@Param("endTime") Date eTime);

   
}
