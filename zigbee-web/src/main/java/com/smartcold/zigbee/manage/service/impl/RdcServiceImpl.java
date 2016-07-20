package com.smartcold.zigbee.manage.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Ordering;
import com.google.common.primitives.Ints;
import com.smartcold.zigbee.manage.dao.*;
import com.smartcold.zigbee.manage.dto.*;
import com.smartcold.zigbee.manage.entity.*;
import com.smartcold.zigbee.manage.service.FtpService;
import com.smartcold.zigbee.manage.service.RdcService;
import com.smartcold.zigbee.manage.util.BaiduMapUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:14)
 */
@Service
public class RdcServiceImpl implements RdcService {

    private static final int goodCommentGrade = 4;

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
    private FileDataMapper fileDataDao;

    @Autowired
    private CityListMapper cityListDao;

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
            rdcAddDTO.setPageview(rdcExtEntity.getPageview() + 1);
            rdcExtDao.increasePageView(rdcID);
            List<FileDataEntity> arrangeFiles = fileDataDao.findByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_ARRANGE_PIC);
            if (!arrangeFiles.isEmpty()) {
                FileDataEntity arrangeFile = arrangeFiles.get(0);
                arrangeFile.setLocation(String.format("http://%s:%s/%s", FtpService.PUB_HOST, FtpService.READPORT, arrangeFile.getLocation()));
                rdcAddDTO.setArrangePic(arrangeFile);
            }

            List<FileDataEntity> storageFiles = fileDataDao.findByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_STORAGE_PIC);
            for (FileDataEntity item : storageFiles) {
                item.setLocation(String.format("http://%s:%s/%s", FtpService.PUB_HOST, FtpService.READPORT, item.getLocation()));
            }
            rdcAddDTO.setStoragePics(storageFiles);
//			rdcAddDTO.setStoragePicLocation(gson.toJson(locationList));

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
    public List<RdcEntityDTO> findRdcDTOList() {
        List<RdcEntity> rdcList = rdcDao.findRdcList();
        List<RdcExtEntity> rdcExtList = rdcExtDao.findRdcExtList();
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

                List<FileDataEntity> storagePics = fileDataDao.findByBelongIdAndCategory(rdcEntity.getId(), FileDataMapper.CATEGORY_STORAGE_PIC);
                if (!storagePics.isEmpty()) {
                    FileDataEntity storagePic = storagePics.get(0);
                    storagePic.setLocation(FtpService.READ_URL + storagePics.get(0).getLocation());
                    dto.setStoragePic(storagePic);
                }

                if (!CollectionUtils.isEmpty(rdcExtList)) {
                    for (RdcExtEntity rdcExt : rdcExtList) {
                        if (rdcExt.getRDCID() == rdcEntity.getId()) {
                            dto.setPageview(rdcExt.getPageview());
                        }
                    }
                }
                result.add(dto);
            }
        }
        return result;
    }

    @Override
    public boolean checkName(String name) {
        int count = rdcDao.checkName(name);
        return count == 0;
    }

    @Override
    public List<RdcScoreDTO> findHotRdcDTOList(@RequestParam int npoint) {
        List<RdcScoreDTO> rdcScoreDTOs = rdcExtDao.findHotRdcDTOList(npoint);
        return addFileData(rdcScoreDTOs);
    }

    private List<RdcScoreDTO> addFileData(List<RdcScoreDTO> rdcScoreDTOs) {
        if (!CollectionUtils.isEmpty(rdcScoreDTOs)) {
            for (RdcScoreDTO rdcScoreDTO : rdcScoreDTOs) {
                List<FileDataEntity> storagePics = fileDataDao.findByBelongIdAndCategory(rdcScoreDTO.getId(), FileDataMapper.CATEGORY_STORAGE_PIC);
                if (!storagePics.isEmpty()) {
                    FileDataEntity storagePic = storagePics.get(0);
                    storagePic.setLocation(FtpService.READ_URL + storagePics.get(0).getLocation());
                    rdcScoreDTO.setStoragePic(storagePic);
                }
            }
        }
        return rdcScoreDTOs;
    }

    @Override
    public List<RdcScoreDTO> findScoreRdcDTOList(@RequestParam int npoint) {
        List<RdcScoreDTO> rdcScoreDTOs = rdcExtDao.findScoreRdcDTOList(npoint);
        return addFileData(rdcScoreDTOs);
    }

    @Scheduled(cron = "0 */10 * * * ?")
    @Override
    public void sumRdcsScore() {
        List<RdcEntity> rdcList = rdcDao.findRdcList();
        if (!CollectionUtils.isEmpty(rdcList)) {
            for (RdcEntity rdcEntity : rdcList) {
                List<CommentEntity> commentsByRdcId = commentDao.findCommentsByRdcId(rdcEntity.getId());
                if (!CollectionUtils.isEmpty(commentsByRdcId)) {
                    int userCommentCnt = commentsByRdcId.size();
                    float totalScore = 0;
                    int recommendCnt = 0;
                    for (CommentEntity commentEntity : commentsByRdcId) {
                        totalScore += commentEntity.getGrade();
                        if (commentEntity.getGrade() >= goodCommentGrade) {
                            recommendCnt++;
                        }
                    }
                    float score = (float) (Math.round(totalScore / userCommentCnt * 10)) / 10;
                    int userRecommendPercent = (recommendCnt * 100) / userCommentCnt;

                    List<RdcExtEntity> rdcExtList = rdcExtDao.findRDCExtByRDCId(rdcEntity.getId());
                    if (!CollectionUtils.isEmpty(rdcExtList)) {
                        RdcExtEntity rdcExt = rdcExtList.get(0);
                        int flag = 0;
                        if (rdcExt.getRdcscore() != score){
                            rdcExt.setRdcscore(score);
                            flag ++;
                        }
                        if (rdcExt.getRdccommentcnt() != userCommentCnt){
                            rdcExt.setRdccommentcnt(userCommentCnt);
                            flag ++;
                        }
                        if (rdcExt.getRdcrecommendpercent() != userRecommendPercent){
                            rdcExt.setRdcrecommendpercent(userRecommendPercent);
                            flag ++;
                        }
                        if (flag != 0){
                            rdcExtDao.updateRdcExt(rdcExt);
                            System.out.println(new Date() + ",分数变化,更新RDC: " + rdcExt.getRDCID());
                        } else {
                            System.out.println(new Date() + ",不更新未发生变化的RDC: " + rdcExt.getRDCID());
                        }
                    }
                }
            }
        }
    }

	@Override
	public PageInfo<RdcEntityDTO> getRDCList(int pageNum, int pageSize,HashMap<String, Object> filter) {
		PageHelper.startPage(pageNum, pageSize);
		Page<RdcEntityDTO> serdcList = this.rdcDao.getRDCList(filter);
		return new PageInfo<RdcEntityDTO>(serdcList);
	}

    @Override
    public List<RdcAddressDTO> findAllRdcAddressDtos() {
        List<RdcEntity> rdcList = rdcDao.findRdcList();
        List<RdcAddressDTO> result = Lists.newArrayList();
        RdcAddressDTO dto;
        for (RdcEntity rdc : rdcList) {
            dto = new RdcAddressDTO();
            BeanUtils.copyProperties(rdc, dto);
            //Map<String, String> geocoderLatitude = new BaiduMapUtil().getGeocoderLatitude(rdc.getAddress());
            //dto.setLng(geocoderLatitude.get("lng"));
            //dto.setLat(geocoderLatitude.get("lat"));
//            dto.setLng(String.valueOf(Math.random() * 120));
//            dto.setLat(String.valueOf(Math.random() * 120));
            result.add(dto);
        }
        return result;
    }

    // 上线后更新一遍数据库,后续可关闭此Job
    @Scheduled(cron = "0 */10 * * * ?")
    @Override
    public void calculateLngLat() {
        List<RdcEntity> rdcList = rdcDao.findRdcList();
        if (!CollectionUtils.isEmpty(rdcList)) {
            for (RdcEntity rdc : rdcList) {
                if (rdc.getLatitude() == 0.0 && rdc.getLongitude() == 0.0) {
                    Map<String, String> lngLatMap = geocoderLatitude(rdc);
                    if (!CollectionUtils.isEmpty(lngLatMap)) {
                        String lng = lngLatMap.get("lng");
                        String lat = lngLatMap.get("lat");
                        if (!StringUtils.isEmpty(lng) && !StringUtils.isEmpty(lat)){
                            rdc.setLongitude(Double.parseDouble(lng));
                            rdc.setLatitude(Double.parseDouble(lat));
                            rdcDao.updateRdc(rdc);
                            System.out.println("calculateLngLat: " + rdc.getId() + "," + rdc.getName());
                        }
                    } else {
                        System.out.println("calculateLngLat dislocate: " + rdc.getId() + "," + rdc.getName());
                    }
                } else {
                    System.out.println("NotcalculateLngLat: " + rdc.getId());
                }
            }
        }
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

}
