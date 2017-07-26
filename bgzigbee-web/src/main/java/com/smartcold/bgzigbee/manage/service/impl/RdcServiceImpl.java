package com.smartcold.bgzigbee.manage.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.smartcold.bgzigbee.manage.dao.*;
import com.smartcold.bgzigbee.manage.dto.RdcAddDTO;
import com.smartcold.bgzigbee.manage.dto.RdcAuthDTO;
import com.smartcold.bgzigbee.manage.dto.RdcDTO;
import com.smartcold.bgzigbee.manage.dto.RdcEntityDTO;
import com.smartcold.bgzigbee.manage.entity.*;
import com.smartcold.bgzigbee.manage.service.FtpService;
import com.smartcold.bgzigbee.manage.service.RdcService;
import com.smartcold.bgzigbee.manage.util.BaiduMapUtil;
import com.smartcold.bgzigbee.manage.util.StringUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:14)
 */
@Service
public class RdcServiceImpl implements RdcService {
	private final static Logger log = LoggerFactory.getLogger(RdcServiceImpl.class);
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
	
	@Autowired
	private FtpService ftpService;

	@Autowired
	private FileDataMapper fileDataDao;

	@Autowired
	private CityListMapper cityListDao;

	@Autowired
	private UserMapper userDao;

	@Override
	public List<RdcEntity> findRdcList() {
		return rdcDao.findRdcList(null, null);
	}

	@Override
	public List<RdcDTO> findAllRdcDtos() {
		List<RdcDTO> rdcDTOs = Lists.newArrayList();

		List<RdcEntity> rdcList = findRdcList();
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
    public List<RdcAddDTO> findRDCDTOByRDCId(int rdcID) {
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
            rdcAddDTO.setTelphoneNum(rdcEntity.getPhone());
            rdcAddDTO.setTonnage(rdcEntity.getCapacity());
            rdcAddDTO.setHeight(rdcEntity.getHeight());
            rdcAddDTO.setRentSqm(rdcEntity.getRentSqm());
            List<FileDataEntity> authFiles = fileDataDao.findByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_AUTH_PIC);
			if (authFiles!=null&&!CollectionUtils.isEmpty(authFiles)) {
				List<RdcAuthDTO> rdcAuthDTOs = Lists.newArrayList();
				RdcAuthDTO rdcAuthDTO;
				for (FileDataEntity item : authFiles) {
					item.setLocation(String.format("http://%s:%s/%s", FtpService.PUB_HOST, FtpService.READPORT, item.getLocation()));
					rdcAuthDTO = new RdcAuthDTO();
					rdcAuthDTO.setAuthPics(Lists.newArrayList(item));
					String location = item.getLocation();
					if (!StringUtils.isEmpty(location)) {
						String[] temps = location.split("_");
						int userId = Integer.parseInt(temps[1]);
						rdcAuthDTO.setUserId(userId);
						UserEntity userById = userDao.findUserById(userId);
						if(userById!=null){
							rdcAuthDTO.setUserName(userById.getUsername());
						}
					}
					rdcAuthDTOs.add(rdcAuthDTO);
				}
				rdcAddDTO.setAuthPics(rdcAuthDTOs);
			}
        }

        if (!CollectionUtils.isEmpty(rdcByRDCId) && rdcByRDCId.size() > 0 && !CollectionUtils.isEmpty(rdcExtByRDCId)
                && rdcExtByRDCId.size() > 0) {
            RdcExtEntity rdcExtEntity = rdcExtByRDCId.get(0);
            rdcAddDTO.setCompanyDevice(rdcExtEntity.getCompanydevice());
            rdcAddDTO.setFacility(rdcExtEntity.getFacility());
            rdcAddDTO.setLihuoArea(rdcExtEntity.getStoragelihuoarea());
            rdcAddDTO.setStructure(rdcExtEntity.getStoragestruct());
            rdcAddDTO.setLihuoRoom(rdcExtEntity.getStorageislihuo());
            rdcAddDTO.setLihuoTemperCtr(rdcExtEntity.getStoragelihuocontrol());
            rdcAddDTO.setManageType(rdcExtEntity.getManagetype());
            rdcAddDTO.setPlatform(rdcExtEntity.getStorageplatform());
            rdcAddDTO.setStorageRefreg(rdcExtEntity.getStoragerefreg());
            rdcAddDTO.setStorageType(rdcExtEntity.getStoragetype());
            rdcAddDTO.setTemperRecord(rdcExtEntity.getStoragetempmonitor());
            rdcAddDTO.setTemperType(rdcExtEntity.getStoragetempertype());
            List<FileDataEntity> arrangeFiles = fileDataDao.findByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_ARRANGE_PIC);
            if (!arrangeFiles.isEmpty()) {
                FileDataEntity arrangeFile = arrangeFiles.get(0);
                arrangeFile.setLocation(String.format("http://%s:%s/%s", FtpService.PUB_HOST, FtpService.READPORT, arrangeFile.getLocation()));
                rdcAddDTO.setArrangePic(arrangeFile);
            }

            List<FileDataEntity> storageFiles = fileDataDao.findByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_STORAGE_PIC);
            if (!CollectionUtils.isEmpty(storageFiles)){
				for (FileDataEntity item : storageFiles) {
					item.setLocation(String.format("http://%s:%s/%s", FtpService.PUB_HOST, FtpService.READPORT, item.getLocation()));
				}
				rdcAddDTO.setStoragePics(storageFiles);
			}

			List<FileDataEntity> honorFiles = fileDataDao.findByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_HONOR_PIC);
			if (!CollectionUtils.isEmpty(honorFiles)) {
				for (FileDataEntity item : honorFiles) {
					item.setLocation(String.format("http://%s:%s/%s", FtpService.PUB_HOST, FtpService.READPORT, item.getLocation()));
				}
				rdcAddDTO.setHonorPics(honorFiles);
			}

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
                    rdcAddDTO.setCapacity1(Float.parseFloat(capacityItem[1]));
                } else if (capacityItem[0].equalsIgnoreCase("2")) {
                    rdcAddDTO.setCapacity2(Float.parseFloat(capacityItem[1]));
                } else if (capacityItem[0].equalsIgnoreCase("3")) {
                    rdcAddDTO.setCapacity3(Float.parseFloat(capacityItem[1]));
                } else if (capacityItem[0].equalsIgnoreCase("4")) {
                    rdcAddDTO.setCapacity4(Float.parseFloat(capacityItem[1]));
                } else if (capacityItem[0].equalsIgnoreCase("5")) {
                    rdcAddDTO.setCapacity5(Float.parseFloat(capacityItem[1]));
                }
            }
            if(StringUtil.isnotNull( rdcExtEntity.getStoragecapacityheight())){
				String[] capacityheight = rdcExtEntity.getStoragecapacityheight().split(",");// 1:2,2:2,3:2,4:1,5:1
				if (capacityheight.length > 0){
					for (int i = 0; i < capacityheight.length; i++) {
						String[] capacityheightItem = capacityheight[i].split(":");
						if (capacityheightItem[0].equalsIgnoreCase("1")) {
							rdcAddDTO.setHeight1(Float.parseFloat(capacityheightItem[1]));
						} else if (capacityheightItem[0].equalsIgnoreCase("2")) {
							rdcAddDTO.setHeight2(Float.parseFloat(capacityheightItem[1]));
						} else if (capacityheightItem[0].equalsIgnoreCase("3")) {
							rdcAddDTO.setHeight3(Float.parseFloat(capacityheightItem[1]));
						} else if (capacityheightItem[0].equalsIgnoreCase("4")) {
							rdcAddDTO.setHeight4(Float.parseFloat(capacityheightItem[1]));
						} else if (capacityheightItem[0].equalsIgnoreCase("5")) {
							rdcAddDTO.setHeight5(Float.parseFloat(capacityheightItem[1]));
						}
					}
				}
			}
//			result.add(rdcAddDTO);
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
	public PageInfo<RdcEntityDTO> findRdcDTOByPage(int pageNum, int pageSize, Integer audit, String keyword) {
		PageHelper.startPage(pageNum, pageSize);
		Page<RdcEntity> rdcList = rdcDao.findRdcList(audit, keyword);
		Page<RdcEntityDTO> result = new Page<RdcEntityDTO> ();
		BeanUtils.copyProperties(rdcList,result);
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
				
				//取出仓库平面图
				List<RdcExtEntity> rdcExtEntities  = rdcExtDao.findRDCExtByRDCId(rdcEntity.getId());
				if (!rdcExtEntities.isEmpty() && rdcExtEntities.get(0).getArrangepiclocation() != null) {
					dto.setArrangePic( FtpService.READ_URL + rdcExtEntities.get(0).getArrangepiclocation() );
				}else {
					dto.setArrangePic("app/img/rdcHeader.jpg");
				}
				result.add(dto);
			}
		}
		return new PageInfo<RdcEntityDTO>(result);
	}

	@Override
	public boolean isNameUnique(String name) {
		int count = rdcDao.checkName(name);
		return count==0;
	}

	@Override
	public Map<String, String> geocoderLatitude(RdcEntity rdc) {
		Map<String, String> result = Maps.newHashMap();
		if (!StringUtils.isEmpty(rdc.getAddress())) {
			String cityName = "";
			if (rdc.getCityid() > 0) {
				CityListEntity cityInfo = cityListDao.findCityById(rdc.getCityid());
				if (cityInfo != null) {
					cityName = cityInfo.getCityName();
				}
			}
			Map<String, String> geocoderLatitude = new BaiduMapUtil().getGeocoderLatitude(cityName + rdc.getAddress());
			String lng = geocoderLatitude.get("lng");
			String lat = geocoderLatitude.get("lat");
			if (!StringUtils.isEmpty(lng) && !StringUtils.isEmpty(lat)) {
				result.put("lng", lng);
				result.put("lat", lat);
				System.out.println("地址解析成功: " + rdc.getId() + "," + rdc.getName());
				return result;
			} else {
				System.out.println("地址解析失败,无法定位: " + rdc.getId() + "," + rdc.getName());
			}
		} else {
			System.out.println("详细地址Address为空,无法解析: " + rdc.getId() + "," + rdc.getName());
		}
		return null;
	}

	@Override
	public boolean deleteByRdcId(int rdcID) {
		//删除rdcext表中的数据
		int nums = rdcExtDao.deleteByRdcID(rdcID);
		log.info("delete "+nums+" rows rdcExt by rdcID:"+rdcID);
		nums = rdcDao.deleteByRdcID(rdcID);
		log.info("delete "+nums+" rows rdc by rdcID:"+rdcID);
		//删除图片
		List<FileDataEntity> fileDataEntities = fileDataDao.findByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_STORAGE_PIC);
		List<FileDataEntity> arrangePic = fileDataDao.findByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_ARRANGE_PIC);
		if (!CollectionUtils.isEmpty(arrangePic)) {
			fileDataEntities.addAll(arrangePic);
		}
		for(FileDataEntity item: fileDataEntities){
			ftpService.deleteByLocation(item.getLocation());
		}
		nums = fileDataDao.deleteByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_STORAGE_PIC);
		nums += fileDataDao.deleteByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_ARRANGE_PIC);
		log.info("delete "+nums+" rows FileData by rdcID:"+rdcID);
		return true;
	}

	@Override
	public List<HashMap<String,Object>> findRdcListbyName(String keyword, int rows) {
		return this.rdcDao.findRdcListbyName(keyword, rows);
	}

}
