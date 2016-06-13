package com.smartcold.zigbee.manage.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.gson.reflect.TypeToken;
import com.smartcold.zigbee.manage.dao.*;
import com.smartcold.zigbee.manage.dto.RdcAddDTO;
import com.smartcold.zigbee.manage.dto.RdcDTO;
import com.smartcold.zigbee.manage.dto.RdcEntityDTO;
import com.smartcold.zigbee.manage.entity.*;
import com.smartcold.zigbee.manage.service.FtpService;
import com.smartcold.zigbee.manage.service.RdcService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:14)
 */
@Service
public class RdcServiceImpl implements RdcService {

	@Autowired
	private RdcMapper rdcDao;

	@Autowired
	private RdcExtMapper rdcExtDao;

	@Autowired
	private StorageManageTypeMapper storageManageTypeDao;

	@Autowired
	private StorageTemperTypeMapper storageTemperTypeDao;

	@Autowired
	private StorageTypeMapper storageTypeDao;

	@Autowired
	private CommentMapper commentDao;

	@Override
	public List<RdcEntity> findRdcList() {
		return rdcDao.findRdcList();
	}

	@Override
	public List<RdcDTO> findAllRdcDtos() {
		List<RdcDTO> rdcDTOs = Lists.newArrayList();

		List<RdcEntity> rdcList = rdcDao.findRdcList();
		List<RdcExtEntity> rdcExtList = rdcExtDao.findRdcExtList();
		List<StorageManageTypeEntity> manageTypes = storageManageTypeDao.findAll();
		List<StorageTemperTypeEntity> temperTypes = storageTemperTypeDao.findAll();
		List<StorageTypeEntity> storageTypes = storageTypeDao.findAll();
		if (!CollectionUtils.isEmpty(rdcList)) {
			for (RdcEntity rdcEntity : rdcList) {
				RdcDTO rdcDTO = new RdcDTO();
				rdcDTO.setId(rdcEntity.getId());
				rdcDTO.setProvinceId(rdcEntity.getProvinceid());
				rdcDTO.setSqm(rdcEntity.getSqm());
				String manageType = "";
				String temperType = "";
				String storageType = "";
				String storageTruck = "无";
				if (!CollectionUtils.isEmpty(rdcExtList)) {
					for (RdcExtEntity rdcExtEntity : rdcExtList) {
						if (rdcExtEntity.getRDCID() == rdcEntity.getId()) {
							if (!CollectionUtils.isEmpty(manageTypes)) {
								for (StorageManageTypeEntity storageManageTypeEntity : manageTypes) {
									if (rdcExtEntity.getManagetype() == storageManageTypeEntity.getId()) {
										manageType = storageManageTypeEntity.getType();
									}
								}
							}
							if (!CollectionUtils.isEmpty(temperTypes)) {
								for (StorageTemperTypeEntity storageTemperTypeEntity : temperTypes) {
									if (rdcExtEntity.getManagetype() == storageTemperTypeEntity.getId()) {
										temperType = storageTemperTypeEntity.getType();
									}
								}
							}
							if (!CollectionUtils.isEmpty(storageTypes)) {
								for (StorageTypeEntity storageTypeEntity : storageTypes) {
									if (rdcExtEntity.getManagetype() == storageTypeEntity.getId()) {
										storageType = storageTypeEntity.getType();
									}
								}
							}
							if (Strings.isNullOrEmpty(rdcExtEntity.getStoragetruck())) {
								storageTruck = "有";
							}
						}
					}
				}
				rdcDTO.setCompanykind(manageType);
				rdcDTO.setStoragetempertype(temperType);
				rdcDTO.setStoragetype(storageType);
				rdcDTO.setStoragetruck(storageTruck);
				rdcDTO.setRdcEntity(rdcEntity);
				rdcDTOs.add(rdcDTO);
			}
		}
		return rdcDTOs;
	}

	@Override
	public List<RdcAddDTO> findRDCDTOByRDCId(@RequestParam int rdcID) {
		List<RdcEntity> rdcByRDCId = rdcDao.findRDCByRDCId(rdcID);
		List<RdcExtEntity> rdcExtByRDCId = rdcExtDao.findRDCExtByRDCId(rdcID);
		List<RdcAddDTO> result = Lists.newArrayList();
		RdcAddDTO rdcAddDTO = new RdcAddDTO();
		if (!CollectionUtils.isEmpty(rdcByRDCId) && rdcByRDCId.size() > 0) {
			RdcEntity rdcEntity = rdcByRDCId.get(0);
			rdcAddDTO.setAddress(rdcEntity.getAddress());
			rdcAddDTO.setArea(rdcEntity.getSqm());
			rdcAddDTO.setCityId(rdcEntity.getCityid());
			rdcAddDTO.setName(rdcEntity.getName());
			rdcAddDTO.setPhoneNum(rdcEntity.getCellphone());
			rdcAddDTO.setProvinceId(rdcEntity.getProvinceid());
			rdcAddDTO.setRemark(rdcEntity.getCommit());
			rdcAddDTO.setStructure(rdcEntity.getStruct());
			rdcAddDTO.setTelphoneNum(rdcEntity.getPhone());
			rdcAddDTO.setTonnage(rdcEntity.getCapacity());
		}

		if (!CollectionUtils.isEmpty(rdcByRDCId) && rdcByRDCId.size() > 0 && !CollectionUtils.isEmpty(rdcExtByRDCId)
				&& rdcExtByRDCId.size() > 0) {
			RdcExtEntity rdcExtEntity = rdcExtByRDCId.get(0);
			rdcAddDTO.setCompanyDevice(rdcExtEntity.getCompanydevice());
			rdcAddDTO.setFacility(rdcExtEntity.getFacility());
			rdcAddDTO.setLihuoArea(rdcExtEntity.getStoragelihuoarea());
			rdcAddDTO.setLihuoRoom(rdcExtEntity.getStorageislihuo());
			rdcAddDTO.setLihuoTemperCtr(rdcExtEntity.getStoragelihuocontrol());
			rdcAddDTO.setManageType(rdcExtEntity.getManagetype());
			rdcAddDTO.setPlatform(rdcExtEntity.getStorageplatform());
			rdcAddDTO.setStorageRefreg(rdcExtEntity.getStoragerefreg());
			rdcAddDTO.setStorageType(rdcExtEntity.getStoragetype());
			rdcAddDTO.setTemperRecord(rdcExtEntity.getStoragetempmonitor());
			rdcAddDTO.setTemperType(rdcExtEntity.getStoragetempertype());
			ArrayList<String> locationList = gson.fromJson(rdcExtEntity.getStoragepiclocation(),
					new TypeToken<List<String>>() {
					}.getType());
			for (int i = 0; i < locationList.size(); i++) {
				locationList.set(i,
						String.format("http://%s:%s/%s", FtpService.PUBURL, FtpService.READPORT, locationList.get(i)));
			}
			rdcAddDTO.setStoragePicLocation(gson.toJson(locationList));

			String[] truck = rdcExtEntity.getStoragetruck().split(",");// 1:2,2:2,3:2,4:1,5:1
			for (int i = 0; i < truck.length; i++) {
				String[] truckItem = truck[i].split(":");
				if (truckItem[0].equalsIgnoreCase("1")) {
					rdcAddDTO.setColdTruck1(Integer.parseInt(truckItem[1]));
				} else if (truckItem[0].equalsIgnoreCase("2")) {
					rdcAddDTO.setColdTruck2(Integer.parseInt(truckItem[1]));
				} else if (truckItem[0].equalsIgnoreCase("3")) {
					rdcAddDTO.setColdTruck3(Integer.parseInt(truckItem[1]));
				} else if (truckItem[0].equalsIgnoreCase("4")) {
					rdcAddDTO.setColdTruck4(Integer.parseInt(truckItem[1]));
				}
			}
			String[] capacity = rdcExtEntity.getStoragecapacity().split(",");// 1:2,2:2,3:2,4:1,5:1
			for (int i = 0; i < capacity.length; i++) {
				String[] capacityItem = capacity[i].split(":");
				if (capacityItem[0].equalsIgnoreCase("1")) {
					rdcAddDTO.setCapacity1(Integer.parseInt(capacityItem[1]));
				} else if (capacityItem[0].equalsIgnoreCase("2")) {
					rdcAddDTO.setCapacity2(Integer.parseInt(capacityItem[1]));
				} else if (capacityItem[0].equalsIgnoreCase("3")) {
					rdcAddDTO.setCapacity3(Integer.parseInt(capacityItem[1]));
				} else if (capacityItem[0].equalsIgnoreCase("4")) {
					rdcAddDTO.setCapacity4(Integer.parseInt(capacityItem[1]));
				} else if (capacityItem[0].equalsIgnoreCase("5")) {
					rdcAddDTO.setCapacity5(Integer.parseInt(capacityItem[1]));
				}
			}
			result.add(rdcAddDTO);
		}

		float score = 0.0f;
		float rdcPositionScore = 0.0f;
		float rdcFacilityScore = 0.0f;
		float rdcServiceScore = 0.0f;
		float rdcHealthScore = 0.0f;

		int userCommentCnt = 0;
		int userRecommendPercent = 0;
		// 计算RDC的评分/用户推荐数/评论数
		List<CommentEntity> commentsByRdcId = commentDao.findCommentsByRdcId(rdcID);
		if (!CollectionUtils.isEmpty(commentsByRdcId)) {
			userCommentCnt = commentsByRdcId.size();
			float totalScore = 0;
			int recommendCnt = 0;
			for (CommentEntity commentEntity : commentsByRdcId) {
				totalScore += commentEntity.getGrade();
				rdcPositionScore += commentEntity.getLocationGrade();
				rdcFacilityScore += commentEntity.getFacilityGrade();
				rdcServiceScore += commentEntity.getServiceGrade();
				rdcHealthScore += commentEntity.getSanitaryGrade();
				if (commentEntity.getGrade() >= 4) {
					recommendCnt++;
				}
			}
			score = (float) (Math.round(totalScore / userCommentCnt * 10)) / 10;
			userRecommendPercent = (recommendCnt * 100) / userCommentCnt;
			rdcAddDTO.setRecommentCount(recommendCnt);
		}
		rdcAddDTO.setScore(score);
		rdcAddDTO.setUserCommentCount(userCommentCnt);
		rdcAddDTO.setUserRecommendPercent(userRecommendPercent);
		rdcAddDTO.setRdcPositionScore((float) (Math.round(rdcPositionScore / userCommentCnt * 10)) / 10);
		rdcAddDTO.setRdcFacilityScore((float) (Math.round(rdcFacilityScore / userCommentCnt * 10)) / 10);
		rdcAddDTO.setRdcServiceScore((float) (Math.round(rdcServiceScore / userCommentCnt * 10)) / 10);
		rdcAddDTO.setRdcHealthScore((float) (Math.round(rdcHealthScore / userCommentCnt * 10)) / 10);

		result.add(rdcAddDTO);

		return result;
	}

	@Override
	public List<RdcEntityDTO> findRdcDTOList() {
		List<RdcEntity> rdcList = rdcDao.findRdcList();
		List<RdcEntityDTO> result = Lists.newArrayList();
		if (!CollectionUtils.isEmpty(rdcList)) {
			for (RdcEntity rdcEntity : rdcList) {
				RdcEntityDTO dto = new RdcEntityDTO();
				BeanUtils.copyProperties(rdcEntity, dto);
				float score = 0.0f;
				int userCommentCnt = 0;
				int userRecommendPercent = 0;
				// 计算RDC的评分/用户推荐数/评论数
				List<CommentEntity> commentsByRdcId = commentDao.findCommentsByRdcId(rdcEntity.getId());
				if (!CollectionUtils.isEmpty(commentsByRdcId)) {
					userCommentCnt = commentsByRdcId.size();
					float totalScore = 0;
					int recommendCnt = 0;
					for (CommentEntity commentEntity : commentsByRdcId) {
						totalScore += commentEntity.getGrade();
						if (commentEntity.getGrade() >= 4) {
							recommendCnt++;
						}
					}
					score = (float) (Math.round(totalScore / userCommentCnt * 10)) / 10;
					userRecommendPercent = (recommendCnt * 100) / userCommentCnt;
				}
				dto.setScore(score);
				dto.setUserCommentCount(userCommentCnt);
				dto.setUserRecommendPercent(userRecommendPercent);
				result.add(dto);
			}
		}
		return result;
	}

}
