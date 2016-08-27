package com.smartcold.zigbee.manage.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.CommonMapper;
import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dao.RdcShareMapper;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;
import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.service.FtpService;
import com.smartcold.zigbee.manage.service.RdcShareService;
import com.smartcold.zigbee.manage.util.SetUtil;
import com.smartcold.zigbee.manage.util.StringUtil;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:睿库共享
 * Create on MaQiang 2016-6-27 09:28:36
 */
@Service("rdcShareService")
public class RdcShareServiceImpl implements RdcShareService {
	@Autowired
	private CommonMapper commonMapper;
    @Autowired
	private FileDataMapper fileDataDao;
	@Autowired
	private RdcShareMapper rdcShareMapper;
	 /**
     * 
     */
	@Override
	public int addShareMsg(RdcShareDTO rdcShareDTO) {
		return this.rdcShareMapper.addshareInfo(rdcShareDTO);
	}
	@Override
	public int updateshareInfo(RdcShareDTO rdcShareDTO){
		  return this.rdcShareMapper.updateshareInfo(rdcShareDTO);
	 }
	/**
	 * 删除用户发布的信息
	 * @param id
	 * @param uid
	 */
	@Override
	public void delShareInfoByid(int id,int uid){
		this.rdcShareMapper.delShareInfoByid( id, uid);
	}
	/**
     * 获得睿库信息
     * @param filter
     * @return
     */
    public PageInfo<RdcShareDTO> getRdcList(int pageNum,int pageSize,Map<String, Object> parameters){
  	    PageHelper.startPage(pageNum, pageSize);
  		Page<RdcShareDTO> serdcList = this.rdcShareMapper.getRdcList(parameters);
  		for (RdcShareDTO rdcShareDTO : serdcList) {
  			 List<FileDataEntity> files = fileDataDao.findByBelongIdAndCategory(rdcShareDTO.getRdcID(), FileDataMapper.CATEGORY_STORAGE_PIC);
  			if(SetUtil.isnotNullList(files)){
  				List<String> filelist =new ArrayList<String>();
  				for (FileDataEntity file : files) {
  					filelist.add(FtpService.READ_URL+file.getLocation());
				}
  				rdcShareDTO.setFiles(filelist);
  				rdcShareDTO.setLogo(files.get(files.size()-1).getLocation());
  			}
		}
  		return new PageInfo<RdcShareDTO>(serdcList);
    }
    
    
	/**
	 * 获得货品共享信息
	 * @param pageNum
	 * @param pageSize
	 * @param filter
	 * @return
	 */
	@Override
	public PageInfo<RdcShareDTO> getSEGDList(int pageNum, int pageSize,Map<String, Object> parameters) {
		PageHelper.startPage(pageNum, pageSize);
		Page<RdcShareDTO> serdcList = this.rdcShareMapper.getSEGDList(parameters);
		return new PageInfo<RdcShareDTO>(serdcList);
	}

	/**
	 * 获得配送共享信息
	 * @param pageNum
	 * @param pageSize
	 * @param filter
	 * @return
	 */
	@Override
	public PageInfo<RdcShareDTO> getSEPSList(int pageNum, int pageSize,Map<String, Object> parameters) {
		PageHelper.startPage(pageNum, pageSize);
		Page<RdcShareDTO> serdcList = this.rdcShareMapper.getSEPSList(parameters);
		return new PageInfo<RdcShareDTO>(serdcList);
	}
	/**
	 * 获得仓库共享信息
	 * @param pageNum
	 * @param pageSize
	 * @param filter
	 * @return
	 */
	@Override
	public PageInfo<RdcShareDTO> getSERDCList(int pageNum, int pageSize,HashMap<String, Object> parameters) {
		PageHelper.startPage(pageNum, pageSize);
		Page<RdcShareDTO> serdcList = this.rdcShareMapper.getSERDCList(parameters);
		return new PageInfo<RdcShareDTO>(serdcList);
	}

	/**
	   * 获得关联库全部信息
	   * @param filter
	   * @return
	   */
     @Override
	 public PageInfo<RdcShareDTO> getSEListByRdcID(int pageNum,int pageSize,Map<String, Object> parameters){
  	     PageHelper.startPage(pageNum, pageSize);
		 Page<RdcShareDTO> serdcList = this.rdcShareMapper.getSEListByRdcID(parameters);
		 return new PageInfo<RdcShareDTO>(serdcList);
	 }
     
     
     
     
     /**
 	 * 获得修改共享信息详情
 	 * @param id
 	 * @return
 	 */
 	public RdcShareDTO getSEByIDForEdit(String id){
 		 RdcShareDTO vo = this.rdcShareMapper.getSEByID(id);
 		 if(vo!=null){
 			 List<FileDataEntity> files = this.fileDataDao.findByBelongIdAndCategory(vo.getId(), FileDataMapper.CATEGORY_SHARE_PIC);
 			 if(SetUtil.isnotNullList(files)){
 					List<String> filelist =new ArrayList<String>();
 					for (FileDataEntity file : files) {
 						filelist.add(FtpService.READ_URL+file.getLocation());
 					}
 					vo.setFiles(filelist);
 					vo.setLogo(files.get(files.size()-1).getLocation());
 			} 
 		 }
 		 return vo;
 	}
     
     
     
    /**
	 * 获得共享详情
	 * @param id
	 * @return
	 */
	public RdcShareDTO getSEByID(String id){
		 RdcShareDTO vo = this.rdcShareMapper.getSEByID(id);
		 if(vo!=null){
			 List<FileDataEntity> files = this.fileDataDao.findByBelongIdAndCategory(vo.getId(), FileDataMapper.CATEGORY_SHARE_PIC);
			 if(SetUtil.isnotNullList(files)){
					List<String> filelist =new ArrayList<String>();
					for (FileDataEntity file : files) {
						filelist.add(FtpService.READ_URL+file.getLocation());
					}
					vo.setFiles(filelist);
					vo.setLogo(files.get(files.size()-1).getLocation());
			} 
			 if(3==vo.getDataType()){
				 if(StringUtil.isnotNull(vo.getCodeLave1())){
					 List<Map<String, Object>> dataMap1 = this.commonMapper.getBaseDataByID("storagemanagetype", "id", "type",Integer.parseInt(vo.getCodeLave1()));//经营类型
					 if(SetUtil.isnotNullList(dataMap1)){ vo.setCodeLave1(dataMap1.get(0).get("type")+"") ; }
				 }
				 if(StringUtil.isnotNull(vo.getCodeLave2())){
				   List<Map<String, Object>> dataMap2 = this.commonMapper.getBaseDataByID("storagetempertype", "id", "type",Integer.parseInt(vo.getCodeLave2()));// 温度类型
				  if(SetUtil.isnotNullList(dataMap2)){ vo.setCodeLave2(dataMap2.get(0).get("type")+"") ; }
				 }
			 }else if(2==vo.getDataType()){
				 if(StringUtil.isnotNull(vo.getCodeLave1())){
					 List<Map<String, Object>> dataMap1 = this.commonMapper.getCommDataByID(Integer.parseInt(vo.getCodeLave1()),"ps_fm_type");//业务类型
					 if(SetUtil.isnotNullList(dataMap1)){ vo.setCodeLave1(dataMap1.get(0).get("type_name")+"") ; }
				 }
				 if(StringUtil.isnotNull(vo.getCodeLave2())){
					 List<Map<String, Object>> dataMap2 = this.commonMapper.getCommDataByID(Integer.parseInt(vo.getCodeLave2()),"ps_cl_type");//温度类型
					 if(SetUtil.isnotNullList(dataMap2)){ vo.setCodeLave2(dataMap2.get(0).get("type_name")+"") ; }
				 }
				 if(StringUtil.isnotNull(vo.getCodeLave3())){
					 List<Map<String, Object>> dataMap3 = this.commonMapper.getBaseDataByID("storagetruck", "id", "type",Integer.parseInt(vo.getCodeLave3()));//车型
					 if(SetUtil.isnotNullList(dataMap3)){ vo.setCodeLave3(dataMap3.get(0).get("type")+"") ; }
				 }
			 }else if(1==vo.getDataType()){
				 if(StringUtil.isnotNull(vo.getCodeLave1())){
					 List<Map<String, Object>> dataMap = this.commonMapper.getCommDataByID(Integer.parseInt(vo.getCodeLave1()),"good_type");
					 if(SetUtil.isnotNullList(dataMap)){ vo.setCodeLave1(dataMap.get(0).get("type_name")+"") ; }
				 }
			 }
		 }
		 return vo;
	}
}
