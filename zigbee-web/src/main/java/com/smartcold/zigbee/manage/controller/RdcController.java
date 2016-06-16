package com.smartcold.zigbee.manage.controller;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.smartcold.zigbee.manage.dao.CompanyDeviceMapper;
import com.smartcold.zigbee.manage.dao.RdcExtMapper;
import com.smartcold.zigbee.manage.dao.RdcMapper;
import com.smartcold.zigbee.manage.dao.StorageManageTypeMapper;
import com.smartcold.zigbee.manage.dao.StorageRefregMapper;
import com.smartcold.zigbee.manage.dao.StorageTemperTypeMapper;
import com.smartcold.zigbee.manage.dao.StorageTypeMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.NgRemoteValidateDTO;
import com.smartcold.zigbee.manage.dto.RdcAddDTO;
import com.smartcold.zigbee.manage.dto.UploadFileEntity;
import com.smartcold.zigbee.manage.entity.RdcEntity;
import com.smartcold.zigbee.manage.entity.RdcExtEntity;
import com.smartcold.zigbee.manage.service.FtpService;
import com.smartcold.zigbee.manage.service.RdcService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/rdc")
public class RdcController {

	private static String baseDir = "picture";

	@Autowired
	private RdcMapper rdcMapper;

	@Autowired
	private RdcExtMapper rdcExtDao;

	@Autowired
	private RdcService rdcService;

	@Autowired
	private StorageManageTypeMapper storageManageTypeDao;

	@Autowired
	private StorageTemperTypeMapper storageTemperTypeDao;

	@Autowired
	private StorageTypeMapper storageTypeDao;

	@Autowired
	private StorageRefregMapper storageRefregDao;

	@Autowired
	private CompanyDeviceMapper companyDeviceDao;

	@Autowired
	private FtpService ftpService;

	@RequestMapping(value = "/findRdcList", method = RequestMethod.GET)
	@ResponseBody
	public Object findRdcList() {
		return rdcMapper.findRdcList();
	}

	@RequestMapping(value = "/findRdcDTOList", method = RequestMethod.GET)
	@ResponseBody
	public Object findRdcDTOList() {
		return rdcService.findRdcDTOList();
	}

	@RequestMapping(value = "/findRDCByRDCId", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCByRDCId(@RequestParam int rdcID) {
		return rdcMapper.findRDCByRDCId(rdcID);
	}

	@RequestMapping(value = "/findRDCDTOByRDCId", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCDTOByRDCId(@RequestParam int rdcID) {
		return rdcService.findRDCDTOByRDCId(rdcID);
	}

	@RequestMapping(value = "/findAllRdcDtos", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllRdcDtos() {
		return rdcService.findAllRdcDtos();
	}

	@RequestMapping(value = "/findAllManageType", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllManageType() {
		return storageManageTypeDao.findAll();
	}

	@RequestMapping(value = "/findAllTemperType", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllTemperType() {
		return storageTemperTypeDao.findAll();
	}

	@RequestMapping(value = "/findAllStorageType", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllStorageType() {
		return storageTypeDao.findAll();
	}

	@RequestMapping(value = "/findAllStorageRefreg", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllStorageRefreg() {
		return storageRefregDao.findAll();
	}

	@RequestMapping(value = "/findAllCompanyDevice", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllCompanyDevice() {
		return companyDeviceDao.findAll();
	}

	@RequestMapping(value = "/addRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object add(@RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			@RequestParam(required = false) MultipartFile arrangePic, RdcAddDTO rdcAddDTO) throws Exception {
//		MultipartFile[] files = { file0, file1, file2, file3, file4, arrangePic };
		MultipartFile[] files = { file4, file3, file2, file1, file0 };
		RdcEntity rdcEntity = new RdcEntity();
		rdcEntity.setName(URLDecoder.decode(rdcAddDTO.getName(), "UTF-8"));
		rdcEntity.setAddress(URLDecoder.decode(rdcAddDTO.getAddress(), "UTF-8"));
		rdcEntity.setSqm(rdcAddDTO.getArea());
		rdcEntity.setStruct(URLDecoder.decode(rdcAddDTO.getStructure(), "UTF-8"));
		rdcEntity.setCapacity(rdcAddDTO.getTonnage());
		rdcEntity.setProvinceid(rdcAddDTO.getProvinceId());
		rdcEntity.setCityid(rdcAddDTO.getCityId());
		rdcEntity.setCellphone(rdcAddDTO.getPhoneNum());
		// rdcEntity.setPhone(rdcAddDTO.getTelphoneNum());
		rdcEntity.setCommit(URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8"));

		rdcEntity.setType(0);
		rdcEntity.setStoragetype("");
		rdcEntity.setColdtype("");
		rdcEntity.setContact("");
		rdcEntity.setPosition("");
		rdcEntity.setPowerConsume(0);

		rdcMapper.insertRdc(rdcEntity);

		// 插入rdc表,返回对应的ID
		RdcExtEntity rdcExtEntity = new RdcExtEntity();
		String dir = String.format("%s/rdc/%s", baseDir, rdcEntity.getId());
		rdcExtEntity.setRDCID(rdcEntity.getId()); // 由上面返回
		rdcExtEntity.setManagetype((byte) rdcAddDTO.getManageType());
		rdcExtEntity.setStoragetype((byte) rdcAddDTO.getStorageType());
		rdcExtEntity.setStorageplatform((byte) rdcAddDTO.getPlatform());
		rdcExtEntity.setStorageplatformtype((byte) 1); // 后续添加
		rdcExtEntity.setStorageislihuo((byte) rdcAddDTO.getLihuoRoom());
		rdcExtEntity.setStoragelihuocontrol((byte) rdcAddDTO.getLihuoTemperCtr());
		rdcExtEntity.setStoragelihuoarea(rdcAddDTO.getLihuoArea());
		rdcExtEntity.setStoragerefreg((byte) rdcAddDTO.getStorageRefreg());
		rdcExtEntity.setStoragetempmonitor((byte) rdcAddDTO.getTemperRecord());
		String capacity = "1:" + rdcAddDTO.getCapacity1() + ",2:" + rdcAddDTO.getCapacity2() + ",3:"
				+ rdcAddDTO.getCapacity3() + ",4:" + rdcAddDTO.getCapacity4() + ",5:" + rdcAddDTO.getCapacity4();
		rdcExtEntity.setStoragecapacity(capacity);
		String truck = "1:" + rdcAddDTO.getColdTruck1() + ",2:" + rdcAddDTO.getColdTruck2() + ",3:"
				+ rdcAddDTO.getColdTruck3() + ",4:" + rdcAddDTO.getColdTruck4();
		rdcExtEntity.setStoragetruck(truck);
		rdcExtEntity.setStoragetempertype((byte) rdcAddDTO.getTemperType());
		rdcExtEntity.setFacility(URLDecoder.decode(rdcAddDTO.getFacility(), "UTF-8"));
		rdcExtEntity.setCompanydevice((byte) rdcAddDTO.getCompanyDevice());

		rdcExtEntity.setCompanystaff((byte) 0);
		rdcExtEntity.setStorageheight((byte) 0);
		rdcExtEntity.setStoragestruct((byte) 0);

		List<String> storagepicLocations = new ArrayList<String>();
		// List<UploadFileEntity> uploadFileEntities = new
		// ArrayList<UploadFileEntity>();
		for (MultipartFile file : files) {
			if (file == null) {
				continue;
			}
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
			// uploadFileEntities.add(uploadFileEntity);
			ftpService.uploadFile(uploadFileEntity);
			storagepicLocations.add(dir + "/" + fileName);
		}
		// ftpService.uploadFileList(uploadFileEntities);
		rdcExtEntity.setStoragepiclocation(new Gson().toJson(storagepicLocations));
		
		// save arrangePic
		if (arrangePic != null) {
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, arrangePic, dir);
			// uploadFileEntities.add(uploadFileEntity);
			ftpService.uploadFile(uploadFileEntity);
			rdcExtEntity.setArrangepiclocation(dir + "/" + fileName);
		}
		
		rdcExtDao.insertRdcExt(rdcExtEntity);

		return new BaseDto(0);
	}

	@RequestMapping(value = "/updateRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object update(@RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			@RequestParam(required = false) MultipartFile arrangePic, RdcAddDTO rdcAddDTO) throws Exception {
//		MultipartFile[] files = { file0, file1, file2, file3, file4, arrangePic };
		MultipartFile[] files = { file4, file3, file2, file1, file0 };
		String dir = String.format("%s/rdc/%s", baseDir, rdcAddDTO.getRdcId());

		int rdcId = rdcAddDTO.getRdcId();
		RdcEntity rdcEntity = rdcMapper.findRDCByRDCId(rdcId).get(0);

		// rdcEntity.setName(URLDecoder.decode(rdcAddDTO.getName(), "UTF-8"));
		rdcEntity.setAddress(URLDecoder.decode(rdcAddDTO.getAddress(), "UTF-8"));
		rdcEntity.setSqm(rdcAddDTO.getArea());
		rdcEntity.setStruct(URLDecoder.decode(rdcAddDTO.getStructure(), "UTF-8"));
		rdcEntity.setCapacity(rdcAddDTO.getTonnage());
		// rdcEntity.setProvinceid(rdcAddDTO.getProvinceId());
		// rdcEntity.setCityid(rdcAddDTO.getCityId());
		rdcEntity.setCellphone(rdcAddDTO.getPhoneNum());
		// rdcEntity.setPhone(rdcAddDTO.getTelphoneNum());
		rdcEntity.setCommit(URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8"));
		/*
		 * rdcEntity.setType(0); rdcEntity.setStoragetype("");
		 * rdcEntity.setColdtype(""); rdcEntity.setContact("");
		 * rdcEntity.setPosition(""); rdcEntity.setPowerConsume(0);
		 */

		rdcMapper.updateRdc(rdcEntity);
		RdcExtEntity rdcExtEntity = null;
		boolean haveRdcExt = false;
		if (rdcExtDao.findRDCExtByRDCId(rdcId).isEmpty()) {
			rdcExtEntity = new RdcExtEntity();
			rdcExtEntity.setRDCID(rdcEntity.getId()); // 由上面返回
		} else {
			haveRdcExt = true;
			rdcExtEntity = rdcExtDao.findRDCExtByRDCId(rdcId).get(0);
		}

		// 插入rdc表,返回对应的ID
		rdcExtEntity.setManagetype((byte) rdcAddDTO.getManageType());
		rdcExtEntity.setStoragetype((byte) rdcAddDTO.getStorageType());
		rdcExtEntity.setStorageplatform((byte) rdcAddDTO.getPlatform());
		rdcExtEntity.setStorageplatformtype((byte) 1); // 后续添加
		rdcExtEntity.setStorageislihuo((byte) rdcAddDTO.getLihuoRoom());
		rdcExtEntity.setStoragelihuocontrol((byte) rdcAddDTO.getLihuoTemperCtr());
		rdcExtEntity.setStoragelihuoarea(rdcAddDTO.getLihuoArea());
		rdcExtEntity.setStoragerefreg((byte) rdcAddDTO.getStorageRefreg());
		rdcExtEntity.setStoragetempmonitor((byte) rdcAddDTO.getTemperRecord());
		String capacity = "1:" + rdcAddDTO.getCapacity1() + ",2:" + rdcAddDTO.getCapacity2() + ",3:"
				+ rdcAddDTO.getCapacity3() + ",4:" + rdcAddDTO.getCapacity4() + ",5:" + rdcAddDTO.getCapacity4();
		rdcExtEntity.setStoragecapacity(capacity);
		String truck = "1:" + rdcAddDTO.getColdTruck1() + ",2:" + rdcAddDTO.getColdTruck2() + ",3:"
				+ rdcAddDTO.getColdTruck3() + ",4:" + rdcAddDTO.getColdTruck4();
		rdcExtEntity.setStoragetruck(truck);
		rdcExtEntity.setStoragetempertype((byte) rdcAddDTO.getTemperType());
		rdcExtEntity.setFacility(URLDecoder.decode(rdcAddDTO.getFacility(), "UTF-8"));
		rdcExtEntity.setCompanydevice((byte) rdcAddDTO.getCompanyDevice());

		/*
		 * rdcExtEntity.setCompanystaff((byte)0);
		 * rdcExtEntity.setStorageheight((byte)0);
		 * rdcExtEntity.setStoragestruct((byte)0);
		 */

		List<String> storagepicLocations = new ArrayList<String>();
		for (MultipartFile file : files) {
			if (file == null) {
				continue;
			}
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
			try {
				ftpService.uploadFile(uploadFileEntity);
				storagepicLocations.add(dir + "/" + fileName);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		rdcExtEntity.setStoragepiclocation(new Gson().toJson(storagepicLocations));
		// save arrangePic
		if (arrangePic != null) {
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, arrangePic, dir);
			// uploadFileEntities.add(uploadFileEntity);
			ftpService.uploadFile(uploadFileEntity);
			rdcExtEntity.setArrangepiclocation(dir + "/" + fileName);
		}
		if (haveRdcExt)
			rdcExtDao.updateRdcExt(rdcExtEntity);
		else
			rdcExtDao.insertRdcExt(rdcExtEntity);

		return new BaseDto(0);
	}

	@ResponseBody
	@RequestMapping(value = "/checkName", method = RequestMethod.GET)
	public Object checkName(@RequestParam("value") String name) {
		name = StringUtils.trimAllWhitespace(name);
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(rdcService.checkName(name));
		return ngRemoteValidateDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/checkCellphone", method = RequestMethod.GET)
	public Object checkCellphone(@RequestParam("value") String cellphone) {
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(!rdcMapper.checkCellphone(cellphone));
		return ngRemoteValidateDTO;
	}
	
	@ResponseBody
	@RequestMapping(value="/deleteStoragePic", method=RequestMethod.POST)
	public Object deleteStoragePic(String url){
		boolean deleted = ftpService.deleteFile(url);
		return new BaseDto(deleted?0:-1);
	}
}
