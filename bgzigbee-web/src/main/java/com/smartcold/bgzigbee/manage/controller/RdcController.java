package com.smartcold.bgzigbee.manage.controller;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.smartcold.bgzigbee.manage.dao.CompanyDeviceMapper;
import com.smartcold.bgzigbee.manage.dao.FileDataMapper;
import com.smartcold.bgzigbee.manage.dao.OperationLogMapper;
import com.smartcold.bgzigbee.manage.dao.RdcExtMapper;
import com.smartcold.bgzigbee.manage.dao.RdcMapper;
import com.smartcold.bgzigbee.manage.dao.SpiderCollectionConfigMapper;
import com.smartcold.bgzigbee.manage.dao.StorageManageTypeMapper;
import com.smartcold.bgzigbee.manage.dao.StorageRefregMapper;
import com.smartcold.bgzigbee.manage.dao.StorageTemperTypeMapper;
import com.smartcold.bgzigbee.manage.dao.StorageTypeMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.NgRemoteValidateDTO;
import com.smartcold.bgzigbee.manage.dto.RdcAddDTO;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.dto.UploadFileEntity;
import com.smartcold.bgzigbee.manage.entity.AdminEntity;
import com.smartcold.bgzigbee.manage.entity.FileDataEntity;
import com.smartcold.bgzigbee.manage.entity.OperationLog;
import com.smartcold.bgzigbee.manage.entity.RdcEntity;
import com.smartcold.bgzigbee.manage.entity.RdcExtEntity;
import com.smartcold.bgzigbee.manage.entity.SpiderCollectionConfigEntity;
import com.smartcold.bgzigbee.manage.entity.UserEntity;
import com.smartcold.bgzigbee.manage.service.FtpService;
import com.smartcold.bgzigbee.manage.service.RdcService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/rdc")
public class RdcController {
	private static final Logger log = LoggerFactory.getLogger(RdcController.class);
	private static String baseDir = "picture";

	private Gson gson = new Gson();

	@Autowired
	private RdcMapper rdcDao;

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

	@Autowired
	private FileDataMapper fileDataDao;

	@Autowired
	private SpiderCollectionConfigMapper spiderCollectionConfigDao;


	@RequestMapping(value = "/findRdcList", method = RequestMethod.GET)
	@ResponseBody
	public Object findRdcList() {
		return rdcService.findRdcList();
	}

	@RequestMapping(value = "/findRdcDTOByPage", method = RequestMethod.POST)
	@ResponseBody
	public Object findRdcDTOByPage(@RequestParam(value = "pageNum", required = false) Integer pageNum,
			@RequestParam(value = "pageSize") Integer pageSize,
			@RequestParam(value = "audit", required = false) Integer audit,
			@RequestParam(value = "keyword", required = false) String keyword) {
		if (!(audit == -1 || audit == 1 || audit == 0)) {
			audit = null;
		}
		pageNum = pageNum == null ? 1 : pageNum;
		pageSize = pageSize == null ? 12 : pageSize;
		return rdcService.findRdcDTOByPage(pageNum, pageSize, audit, keyword);
	}

	@RequestMapping(value = "/findRDCByRDCId", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCByRDCId(@RequestParam int rdcID) {
		return rdcDao.findRDCByRDCId(rdcID);
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
	public Object add(HttpServletRequest request, @RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			@RequestParam(required = false) MultipartFile arrangePics, RdcAddDTO rdcAddDTO) throws Exception {
		// MultipartFile[] files = { file0, file1, file2, file3, file4,
		// arrangePic };
		MultipartFile[] files = { file4, file3, file2, file1, file0 };
		MultipartFile arrangePic = arrangePics;
		RdcEntity rdcEntity = new RdcEntity();
		rdcEntity.setName(URLDecoder.decode(rdcAddDTO.getName(), "UTF-8"));
		if (!rdcService.isNameUnique(rdcEntity.getName())) {
			return null;
		}
		rdcEntity.setAddress(URLDecoder.decode(rdcAddDTO.getAddress(), "UTF-8"));
		rdcEntity.setSqm(rdcAddDTO.getArea());
		rdcEntity.setStruct(URLDecoder.decode(rdcAddDTO.getStructure(), "UTF-8"));
		rdcEntity.setCapacity(rdcAddDTO.getTonnage());
		rdcEntity.setProvinceid(rdcAddDTO.getProvinceId());
		rdcEntity.setCityid(rdcAddDTO.getCityId());
		rdcEntity.setCellphone(rdcAddDTO.getPhoneNum());
		// rdcEntity.setPhone(rdcAddDTO.getTelphoneNum());
		rdcEntity.setCommit(URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8"));
		UserEntity user = (UserEntity) request.getSession().getAttribute("user");
		rdcEntity.setType(0);
		rdcEntity.setStoragetype("");
		rdcEntity.setColdtype("");
		rdcEntity.setContact("");
		rdcEntity.setPosition("");
		rdcEntity.setPowerConsume(0);

		rdcDao.insertRdc(rdcEntity);

		// 插入rdc表,返回对应的ID
		RdcExtEntity rdcExtEntity = new RdcExtEntity();
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

		// 图片上传
		String dir = String.format("%s/rdc/%s", baseDir, rdcEntity.getId());
		List<FileDataEntity> storageFiles = new ArrayList<FileDataEntity>();
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
			FileDataEntity fileDataEntity = new FileDataEntity(file.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_STORAGE_PIC, rdcEntity.getId(), fileName);
			storageFiles.add(fileDataEntity);
		}
		if (!storageFiles.isEmpty()) {
			fileDataDao.saveFileDatas(storageFiles);
		}
		// ftpService.uploadFileList(uploadFileEntities);
		// rdcExtEntity.setStoragepiclocation(new
		// Gson().toJson(storagepicLocations));

		// save arrangePic
		if (arrangePic != null) {
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, arrangePic, dir);
			// uploadFileEntities.add(uploadFileEntity);
			ftpService.uploadFile(uploadFileEntity);
			// rdcExtEntity.setArrangepiclocation(dir + "/" + fileName);
			FileDataEntity arrangeFile = new FileDataEntity(arrangePic.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_ARRANGE_PIC, rdcEntity.getId(), fileName);
			fileDataDao.saveFileData(arrangeFile);
		}

		rdcExtDao.insertRdcExt(rdcExtEntity);
		
		return new BaseDto(0);
	}

	@RequestMapping(value = "/updateRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object update(HttpServletRequest request, @RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			@RequestParam(required = false) MultipartFile arrangePics, RdcAddDTO rdcAddDTO	) throws Exception {
		// System.out.println(URLDecoder.decode(rdcAddDTO.getRemark(),
		// "UTF-8").length());
		/*
		 * if (URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8").length()>125) {
		 * return new BaseDto(-1); }
		 */
		// MultipartFile[] files = { file0, file1, file2, file3, file4,
		// arrangePic };
		MultipartFile[] files = { file4, file3, file2, file1, file0 };
		MultipartFile arrangePic = arrangePics;

		int rdcId = rdcAddDTO.getRdcId();
		RdcEntity rdcEntity = rdcDao.findRDCByRDCId(rdcId).get(0);

		rdcEntity.setName(URLDecoder.decode(rdcAddDTO.getName(), "UTF-8"));
		rdcEntity.setAddress(URLDecoder.decode(rdcAddDTO.getAddress(), "UTF-8"));
		rdcEntity.setSqm(rdcAddDTO.getArea());
		rdcEntity.setStruct(URLDecoder.decode(rdcAddDTO.getStructure(), "UTF-8"));
		rdcEntity.setCapacity(rdcAddDTO.getTonnage());
		rdcEntity.setProvinceid(rdcAddDTO.getProvinceId());
		rdcEntity.setCityid(rdcAddDTO.getCityId());
		rdcEntity.setCellphone(rdcAddDTO.getPhoneNum());
		rdcEntity.setPhone(rdcAddDTO.getTelphoneNum());
		rdcEntity.setCommit(URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8"));

		rdcDao.updateRdc(rdcEntity);
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

		String dir = String.format("%s/rdc/%s", baseDir, rdcAddDTO.getRdcId());
		List<FileDataEntity> storageFiles = new ArrayList<FileDataEntity>();
		for (MultipartFile file : files) {
			if (file == null) {
				continue;
			}
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
			// uploadFileEntities.add(uploadFileEntity);
			ftpService.uploadFile(uploadFileEntity);
			FileDataEntity fileDataEntity = new FileDataEntity(file.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_STORAGE_PIC, rdcEntity.getId(), fileName);
			storageFiles.add(fileDataEntity);
		}
		if (!storageFiles.isEmpty()) {
			fileDataDao.saveFileDatas(storageFiles);
		}
		// save arrangePic
		if (arrangePic != null) {
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, arrangePic, dir);
			ftpService.uploadFile(uploadFileEntity);
			FileDataEntity arrangeFile = new FileDataEntity(arrangePic.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_ARRANGE_PIC, rdcEntity.getId(), fileName);
			fileDataDao.saveFileData(arrangeFile);
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
		ngRemoteValidateDTO.setValid(rdcService.isNameUnique(name));
		return ngRemoteValidateDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/checkCellphone", method = RequestMethod.GET)
	public Object checkCellphone(@RequestParam("value") String cellphone) {
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(!rdcDao.checkCellphone(cellphone));
		return ngRemoteValidateDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/deleteStoragePic", method = RequestMethod.DELETE)
	public Object deleteStoragePic(FileDataEntity filedata) {
		boolean deleted = ftpService.deleteFile(filedata.getLocation());
		if (deleted) {
			fileDataDao.deleteById(filedata.getId());
		}
		return new BaseDto(deleted ? 0 : -1);
	}

	@RequestMapping(value = "/updateMapping", method = RequestMethod.POST)
	@ResponseBody
	public Object updateMapping(int rdcId, String mapping) {
		try {
			gson.fromJson(mapping, new TypeToken<Map<String, Object>>() {
			}.getType());
		} catch (JsonParseException e) {
			return new ResultDto(-1, "参数不是合法的json map");
		}

		rdcDao.updateMappingById(rdcId, mapping);

		return new ResultDto(0, "修改成功");
	}

	@RequestMapping(value = "/findSpiderConfig", method = RequestMethod.GET)
	@ResponseBody
	public Object findSpiderConfig(int rdcId) {
		return spiderCollectionConfigDao.findConfigByRdcid(rdcId);
	}

	@ResponseBody
	@RequestMapping(value = "/deleteByRdcID", method = RequestMethod.DELETE)
	public Object deleteByRdcID(Integer rdcID) {
		if (rdcID <= 0) {
			return new BaseDto(-1);
		}
		rdcService.deleteByRdcId(rdcID);
		return new BaseDto(0);
	}

	@ResponseBody
	@RequestMapping(value = "/deleteByRdcIDs", method = RequestMethod.DELETE)
	public Object deleteByRdcIDs(Integer[] rdcIDs) {
		log.info("delete rdcID in:" + Arrays.toString(rdcIDs));
		for (Integer rdcID : rdcIDs) {
			rdcService.deleteByRdcId(rdcID);
		}
		return new BaseDto(0);
	}

	@ResponseBody
	@RequestMapping(value = "/changeAudit", method = RequestMethod.POST)
	public Object changeAudit(int rdcID, int audit) {
		rdcDao.changeAudit(rdcID, audit);
		return new BaseDto(0);
	}

	@ResponseBody
	@RequestMapping(value = "/changeAudits", method = RequestMethod.POST)
	public Object changeAudits(int[] rdcIDs, int audit) {
		for (int rdcID : rdcIDs)
			rdcDao.changeAudit(rdcID, audit);
		return new BaseDto(0);
	}

	@RequestMapping(value = "/updateSpiderConfig", method = RequestMethod.POST)
	@ResponseBody
	public Object updateSpiderConfig(@RequestBody SpiderCollectionConfigEntity entity) {
		if (spiderCollectionConfigDao.findConfigByRdcid(entity.getRdcid()) != null) {
			spiderCollectionConfigDao.updateConfig(entity);
			return new ResultDto(0, "修改成功");
		} else {
			spiderCollectionConfigDao.addConfig(entity);
			return new ResultDto(0, "添加成功");
		}
	}

	@RequestMapping(value = "/deleteSpiderConfig", method = RequestMethod.POST)
	@ResponseBody
	public Object deleteSpiderConfig(int rdcid) {
		spiderCollectionConfigDao.deleteConfig(rdcid);

		return new ResultDto(0, "删除成功");
	}

}
