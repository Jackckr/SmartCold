package com.smartcold.bgzigbee.manage.controller;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSONObject;
import com.smartcold.bgzigbee.manage.dao.*;
import com.smartcold.bgzigbee.manage.dto.*;
import com.smartcold.bgzigbee.manage.entity.*;
import com.smartcold.bgzigbee.manage.entity.OperationLog;
import com.smartcold.bgzigbee.manage.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.smartcold.bgzigbee.manage.enums.UserVersion;
import com.smartcold.bgzigbee.manage.service.FtpService;
import com.smartcold.bgzigbee.manage.service.RdcService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/rdc")
public class RdcController {
	private static String baseDir = "picture";

	

	@Autowired
	private RdcMapper rdcDao;

	@Autowired
	private UserMapper userDao;
	@Autowired
	private ACLMapper aclMapper;

	
	@Autowired
	private RdcExtMapper rdcExtDao;
	

	@Autowired
	private StorageStructureTypeMapper storageStructureDao;

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

	@Autowired
	private StorageHonorMapper storageHonorDao;

	@Autowired
	private RdcUserMapper rdcUserDao;

	@Autowired
	private RdcAuthLogMapper rdcAuthLogDao;

	@Autowired
	private RoleUserMapper roleUserDao;

	@Autowired
	private OperationLogMapper operationLogMapper;
	@Autowired
	private RdcAuthMapper rdcAuthMapper;
	
	private Gson gson = new Gson();
	
	private static final Logger log = LoggerFactory.getLogger(RdcController.class);


	
	@RequestMapping(value = "/findRdcList", method = RequestMethod.GET)
	@ResponseBody
	public Object findRdcList() {
		 List<RdcEntity> findRdcList = rdcService.findRdcList();
		 return findRdcList;
	}
	
	@RequestMapping(value = "/findRdcBykeyword", method = RequestMethod.GET)
	@ResponseBody
	public Object findRdcBykeyword(String  keyword) {
		return rdcDao.findRdcListbyName(keyword,10);
	}

	@RequestMapping(value = "/getRdcDTOByPage", method = RequestMethod.POST)
	@ResponseBody
	public TableData getRdcDTOByPage(
			String  keyword,
			Integer audit,
			int     page,
			int     rows) {
		if(!StringUtil.isnotNull(keyword)){keyword=null;}
		if(audit!=null&&audit==8){audit=null;}
		PageInfo pageInfo = rdcService.findRdcDTOByPage(page, rows, audit, keyword);
		return TableData.newSuccess(pageInfo);
	}
/*框架完毕后需要删除*/
	@RequestMapping(value = "/findRdcDTOByPage", method = RequestMethod.POST)
	@ResponseBody
	public Object findRdcDTOByPage(@RequestParam(value = "pageNum", required = false) Integer pageNum,
			@RequestParam(value = "pageSize", required = false) Integer pageSize,
			@RequestParam(value = "audit", required = false) Integer audit,
			@RequestParam(value = "keyword", required = false) String keyword) {
		if (audit != null && !(audit == -1 || audit == 1 || audit == 0 || audit == 2)) {
			audit = null;
		}
		// System.out.println(keyword);
		pageNum = pageNum == null ? 1 : pageNum;
		pageSize = pageSize == null ? 10 : pageSize;
		keyword = keyword.equals("") ? null : keyword;
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
	

	@RequestMapping(value = "/getAuthenticationByRDCId", method = RequestMethod.GET)
	@ResponseBody
	public Object getAuthenticationByRDCId(@RequestParam int rdcID) {
		HashMap<String, Object>  autherMap=null;
		List<Object> resDataList=new ArrayList<Object>();
		List<FileDataEntity> authFiles = fileDataDao.findByBelongIdAndCategory(rdcID, FileDataMapper.CATEGORY_AUTH_PIC);
		if (authFiles!=null&&!CollectionUtils.isEmpty(authFiles)) {
			for (FileDataEntity item : authFiles) {
				String location = item.getLocation();
				if (!StringUtils.isEmpty(location)) {
					item.setLocation(String.format("http://%s:%s/%s", FtpService.PUB_HOST, FtpService.READPORT, location));
					autherMap=new HashMap<String, Object>();
					String[] temps = location.split("_");
					int userId = Integer.parseInt(temps[1]);
					Long timeLong=Long.parseLong(temps[temps.length-1].substring(0, 13));
					autherMap.put("time", TimeUtil.getDateTime(new Date(timeLong)));
					autherMap.put("file", item);
					autherMap.put("user", userDao.findUserById(userId));
					resDataList.add(autherMap);
				}
			}				
		}
		return resDataList;
	}
	
	@RequestMapping(value = "/getAllAuthentication", method = RequestMethod.POST)
	@ResponseBody
	public Object getAllAuthentication(Integer pageNum,Integer pageSize, String keyword, String description) {
		HashMap<String, Object>  autherMap=null;
		PageInfo<Object> resDataList=new PageInfo<Object>();
		List<Object> ListObj=new ArrayList<Object>();
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 12:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		Page<FileDataEntity> authFiles= this.fileDataDao.getAuthByFile(null, FileDataMapper.CATEGORY_AUTH_PIC, description);
		if (authFiles!=null&&!CollectionUtils.isEmpty(authFiles)) {
			for (FileDataEntity item : authFiles) {
				String location = item.getLocation();
				if (!StringUtils.isEmpty(location)) {
					item.setLocation(String.format("http://%s:%s/%s", FtpService.PUB_HOST, FtpService.READPORT, location));
					autherMap=new HashMap<String, Object>();
					String[] temps = location.split("_");
					int userId = Integer.parseInt(temps[1]);
					Long timeLong=Long.parseLong(temps[temps.length-1].substring(0, 13));
					autherMap.put("time", TimeUtil.getDateTime(new Date(timeLong)));
					autherMap.put("file", item);
					autherMap.put("isHandle", false);
					autherMap.put("user", userDao.findUserById(userId));
					List<RdcEntity> findRDCByRDCId = rdcDao.findRDCByRDCId(item.getBelongid());
					if(SetUtil.isnotNullList(findRDCByRDCId)){
						RdcUser roleUserByUserId = this.rdcUserDao.findByRUID(userId, findRDCByRDCId.get(0).getId());
						autherMap.put("isHandle", roleUserByUserId!=null);
					}
					autherMap.put("rdc", findRDCByRDCId);
					ListObj.add(autherMap);
				}
			}				
		}
		resDataList.setList(ListObj);
		resDataList.setTotal(authFiles.getTotal());
		return ResponseData.newSuccess(resDataList);
		
	}
	

	@RequestMapping(value = "/findAllRdcDtos", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllRdcDtos() {
		return rdcService.findAllRdcDtos();
	}
	

	/**
	 * 导出请求。。。
	 * 
	 * @param request
	 * @param response
	 * @param fileName
	 * @param title
	 * @param sid
	 * @param index
	 * @param type
	 */
	@RequestMapping(value = "/expedcList")
	@ResponseBody
	public void expedcList(HttpServletRequest request, HttpServletResponse response,  String startTime, String endTime,String fileName, String title ) {
		try {
		    List<RdcEntity> list = this.rdcDao.findRDCByFilter(startTime, endTime);
			String mode[][]={{"id","冷库名称","冷库面积","冷库地址","联系人","联系电话","备注","添加时间"},{"id","name","sqm","address","contact","cellphone","commit","addtime"},{"1","20","5","20","5","5","5","10"}};
			ExportExcelUtil.expExcel(response, fileName, title, mode, list);
		} catch (Exception e) {
			e.printStackTrace();
		}
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

	@RequestMapping(value = "/findAllStorageStructureType", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllStorageStructureType() {
		return storageStructureDao.findAll();
	}

	@RequestMapping(value = "/findrdcMaagerConfig")
	@ResponseBody
	public Object findrdcMaagerConfig(Integer rdcid) {
		if (rdcid == null) {
			return null;
		}
		return this.rdcDao.getRdcMangConfig(rdcid);
	}

	@RequestMapping(value = "/adupRdcMangConfig")
	@ResponseBody
	public ResponseData<String> adupRdcMangConfig(Integer id, Integer rdcid, String muid, String uuid,
			String mtelephone, String uTelephone, String aTelephone) {
		try {
			if (rdcid == null) {
				return ResponseData.newFailure("必要参数不能为空！");
			}
			if (id == null) {
				this.rdcDao.addRdcMangConfig(rdcid, muid, uuid, mtelephone, uTelephone, aTelephone);
			} else {
				this.rdcDao.upRdcMangConfig(id, rdcid, muid, uuid, mtelephone, uTelephone, aTelephone);
			}
			return ResponseData.newSuccess("修改成功！");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure("修改失败！请稍后重试！");
	}

	@RequestMapping(value = "/addRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object add(HttpServletRequest request, @RequestParam(required = false) MultipartFile honor0,
			@RequestParam(required = false) MultipartFile honor1, @RequestParam(required = false) MultipartFile honor2,
			@RequestParam(required = false) MultipartFile honor3, @RequestParam(required = false) MultipartFile honor4,
			@RequestParam(required = false) MultipartFile honor5, @RequestParam(required = false) MultipartFile honor6,
			@RequestParam(required = false) MultipartFile honor7, @RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			@RequestParam(required = false) MultipartFile arrangePics, RdcAddDTO rdcAddDTO, String empStr) throws Exception {
		if (!StringUtils.isEmpty(empStr)) {
			rdcAddDTO= JSONObject.parseObject(empStr, RdcAddDTO.class);
		}
		MultipartFile[] files = { file4, file3, file2, file1, file0 };
		MultipartFile[] honorfiles = { honor7, honor6, honor5, honor4, honor3, honor2, honor1, honor0 };
		MultipartFile arrangePic = arrangePics;
		RdcEntity rdcEntity = new RdcEntity();
		int rdcInfoIntegrity = getRdcInfoIntegrity(rdcAddDTO);
		rdcEntity.setInfoIntegrity(rdcInfoIntegrity);
		rdcEntity.setName(URLDecoder.decode(rdcAddDTO.getName(), "UTF-8"));
		if (!rdcService.isNameUnique(rdcEntity.getName())) {
			return null;
		}
		rdcEntity.setAddress(URLDecoder.decode(rdcAddDTO.getAddress(), "UTF-8"));
		rdcEntity.setSqm(rdcAddDTO.getArea());
		rdcEntity.setCapacity(rdcAddDTO.getTonnage());
		rdcEntity.setProvinceid(rdcAddDTO.getProvinceId());
		rdcEntity.setCityid(rdcAddDTO.getCityId());
		rdcEntity.setCellphone(rdcAddDTO.getPhoneNum());
		rdcEntity.setHeight(rdcAddDTO.getHeight());
		rdcEntity.setRentSqm(rdcAddDTO.getRentSqm());
		// rdcEntity.setPhone(rdcAddDTO.getTelphoneNum());
		rdcEntity.setCommit(URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8"));
		AdminEntity user = (AdminEntity) request.getSession().getAttribute("admin");
		rdcEntity.setUserId(user.getId());
		rdcEntity.setType(0);
		rdcEntity.setStoragetype("");
		rdcEntity.setColdtype("");
		rdcEntity.setContact("");
		rdcEntity.setPosition("");
		rdcEntity.setPowerConsume(0);
		rdcEntity.setTotalcapacity(rdcAddDTO.getTotalcapacity());
		rdcEntity.setCapacityunit(rdcAddDTO.getCapacityunit());
		rdcEntity.setRentcapacityunit(rdcAddDTO.getRentcapacityunit());
		rdcEntity.setProductcategory(rdcAddDTO.getProductcategory());
		rdcEntity.setBuildtype(rdcAddDTO.getBuildtype());
		rdcEntity.setBuildfloors(rdcAddDTO.getBuildfloors());
		rdcEntity.setWebsite(rdcAddDTO.getWebsite());
		Map<String, String> lngLatMap = rdcService.geocoderLatitude(rdcEntity);
		if (!SetUtil.isNullMap(lngLatMap)) {
			rdcEntity.setLongitude(Double.parseDouble(lngLatMap.get("lng")));
			rdcEntity.setLatitude(Double.parseDouble(lngLatMap.get("lat")));
		}
		rdcDao.insertRdc(rdcEntity);

		// 插入rdc表,返回对应的ID
		RdcExtEntity rdcExtEntity = new RdcExtEntity();
		rdcExtEntity.setRDCID(rdcEntity.getId()); // 由上面返回
		rdcExtEntity.setManagetype((byte) rdcAddDTO.getManageType());
		rdcExtEntity.setStoragetype((byte) rdcAddDTO.getStorageType());
		rdcExtEntity.setStoragestruct((byte) rdcAddDTO.getStructure());
		rdcExtEntity.setStorageplatform((byte) rdcAddDTO.getPlatform());
		rdcExtEntity.setStorageplatformtype((byte) 1); // 后续添加
		rdcExtEntity.setStorageislihuo((byte) rdcAddDTO.getLihuoRoom());
		rdcExtEntity.setStoragelihuocontrol((byte) rdcAddDTO.getLihuoTemperCtr());
		rdcExtEntity.setStoragelihuoarea(rdcAddDTO.getLihuoArea());
		rdcExtEntity.setStoragerefreg((byte) rdcAddDTO.getStorageRefreg());
		rdcExtEntity.setStoragetempmonitor((byte) rdcAddDTO.getTemperRecord());
		String capacity = rdcAddDTO.getCapacity1()+":"+rdcAddDTO.getHeight1() + ","+rdcAddDTO.getCapacity2()+":"
				+ rdcAddDTO.getHeight2()+ "," + rdcAddDTO.getCapacity3()+":"+rdcAddDTO.getHeight3() + ","
				+ rdcAddDTO.getCapacity4()+":"+rdcAddDTO.getHeight4();
		rdcExtEntity.setStoragecapacity(capacity);
		String truck = "1:" + rdcAddDTO.getColdTruck1() + ",2:" + rdcAddDTO.getColdTruck2() + ",3:"
				+ rdcAddDTO.getColdTruck3() + ",4:" + rdcAddDTO.getColdTruck4();
		rdcExtEntity.setStoragetruck(truck);
		rdcExtEntity.setStoragetempertype((byte) rdcAddDTO.getTemperType());
		rdcExtEntity.setFacility(URLDecoder.decode(rdcAddDTO.getFacility(), "UTF-8"));
		rdcExtEntity.setCompanydevice((byte) rdcAddDTO.getCompanyDevice());

		rdcExtEntity.setCompanystaff((byte) 0);
		rdcExtEntity.setStorageheight((byte) 0);
		// 图片上传
		String dir = String.format("%s/rdc/%s", baseDir, rdcEntity.getId());
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
		// save honorPic
		List<FileDataEntity> honorFiles = new ArrayList<FileDataEntity>();
		for (MultipartFile file : honorfiles) {
			if (file == null) {
				continue;
			}
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
			ftpService.uploadFile(uploadFileEntity);
			FileDataEntity fileDataEntity = new FileDataEntity(file.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_HONOR_PIC, rdcEntity.getId(), fileName);
			honorFiles.add(fileDataEntity);
		}
		if (!honorFiles.isEmpty()) {
			fileDataDao.saveFileDatas(honorFiles);
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

		rdcExtDao.insertRdcExt(rdcExtEntity);

		return new BaseDto(0);
	}

	@RequestMapping(value = "/newUpdateRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object newUpdate(HttpServletRequest request, @RequestParam(required = false) MultipartFile file0,
						 @RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
						 @RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
						 @RequestParam(required = false) MultipartFile honor0, @RequestParam(required = false) MultipartFile honor1,
						 @RequestParam(required = false) MultipartFile honor2, @RequestParam(required = false) MultipartFile honor3,
						 @RequestParam(required = false) MultipartFile honor4, @RequestParam(required = false) MultipartFile honor5,
						 @RequestParam(required = false) MultipartFile honor6, @RequestParam(required = false) MultipartFile honor7,
							RdcAddDTO rdcAddDTO, String empStr,String ids) throws Exception {
		if (!StringUtils.isEmpty(empStr)) {
			rdcAddDTO= JSONObject.parseObject(empStr, RdcAddDTO.class);
		}

		MultipartFile[] files = { file4, file3, file2, file1, file0 };
		MultipartFile[] honorfiles = { honor7, honor6, honor5, honor4, honor3, honor2, honor1, honor0 };
		if(!StringUtils.isEmpty(ids)){
			String[] delIds=ids.split(",");
			for (String delId:delIds){
				FileDataEntity fileDataEntity = fileDataDao.selectById(Integer.parseInt(delId));
				ftpService.deleteByLocation(fileDataEntity.getLocation());
				fileDataDao.deleteById(Integer.parseInt(delId));
			}
		}

		int rdcId = rdcAddDTO.getRdcId();
		RdcEntity rdcEntity = rdcDao.findRDCByRDCId(rdcId).get(0);
		int rdcInfoIntegrity = getRdcInfoIntegrity(rdcAddDTO);
		rdcEntity.setInfoIntegrity(rdcInfoIntegrity);
		rdcEntity.setName(URLDecoder.decode(rdcAddDTO.getName(), "UTF-8"));
		rdcEntity.setAddress(URLDecoder.decode(rdcAddDTO.getAddress(), "UTF-8"));
		rdcEntity.setSqm(rdcAddDTO.getArea());
		rdcEntity.setCapacity(rdcAddDTO.getTonnage());
		rdcEntity.setProvinceid(rdcAddDTO.getProvinceId());
		rdcEntity.setCityid(rdcAddDTO.getCityId());
		rdcEntity.setCellphone(rdcAddDTO.getPhoneNum());
		rdcEntity.setPhone(rdcAddDTO.getTelphoneNum());
		rdcEntity.setHeight(rdcAddDTO.getHeight());
		rdcEntity.setRentSqm(rdcAddDTO.getRentSqm());
		rdcEntity.setTotalcapacity(rdcAddDTO.getTotalcapacity());
		rdcEntity.setCapacityunit(rdcAddDTO.getCapacityunit());
		rdcEntity.setRentcapacityunit(rdcAddDTO.getRentcapacityunit());
		rdcEntity.setProductcategory(rdcAddDTO.getProductcategory());
		rdcEntity.setBuildtype(rdcAddDTO.getBuildtype());
		rdcEntity.setBuildfloors(rdcAddDTO.getBuildfloors());
		rdcEntity.setWebsite(rdcAddDTO.getWebsite());
		rdcEntity.setCommit(URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8"));
		Map<String, String> lngLatMap = rdcService.geocoderLatitude(rdcEntity);
		if (SetUtil.isNotNullMap(lngLatMap)) {
			rdcEntity.setLongitude(Double.parseDouble(lngLatMap.get("lng")));
			rdcEntity.setLatitude(Double.parseDouble(lngLatMap.get("lat")));
		}
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
		rdcExtEntity.setStoragestruct((byte) rdcAddDTO.getStructure());
		rdcExtEntity.setStorageplatform((byte) rdcAddDTO.getPlatform());
		rdcExtEntity.setStorageplatformtype((byte) 1); // 后续添加
		rdcExtEntity.setStorageislihuo((byte) rdcAddDTO.getLihuoRoom());
		rdcExtEntity.setStoragelihuocontrol((byte) rdcAddDTO.getLihuoTemperCtr());
		rdcExtEntity.setStoragelihuoarea(rdcAddDTO.getLihuoArea());
		rdcExtEntity.setStoragerefreg((byte) rdcAddDTO.getStorageRefreg());
		rdcExtEntity.setStoragetempmonitor((byte) rdcAddDTO.getTemperRecord());
		String capacity = rdcAddDTO.getCapacity1()+":"+rdcAddDTO.getHeight1() + ","+rdcAddDTO.getCapacity2()+":"
				+ rdcAddDTO.getHeight2()+ "," + rdcAddDTO.getCapacity3()+":"+rdcAddDTO.getHeight3() + ","
				+ rdcAddDTO.getCapacity4()+":"+rdcAddDTO.getHeight4();
		rdcExtEntity.setStoragecapacity(capacity);
		String truck = "1:" + rdcAddDTO.getColdTruck1() + ",2:" + rdcAddDTO.getColdTruck2() + ",3:"
				+ rdcAddDTO.getColdTruck3() + ",4:" + rdcAddDTO.getColdTruck4();
		rdcExtEntity.setStoragetruck(truck);
		rdcExtEntity.setStoragetempertype((byte) rdcAddDTO.getTemperType());
		rdcExtEntity.setFacility(URLDecoder.decode(rdcAddDTO.getFacility(), "UTF-8"));
		rdcExtEntity.setCompanydevice((byte) rdcAddDTO.getCompanyDevice());

		String dir = String.format("%s/rdc/%s", baseDir, rdcAddDTO.getRdcId());
		List<FileDataEntity> storageFiles = new ArrayList<FileDataEntity>();
		for (MultipartFile file : files) {
			if (file == null) {
				continue;
			}
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
			ftpService.uploadFile(uploadFileEntity);
			FileDataEntity fileDataEntity = new FileDataEntity(file.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_STORAGE_PIC, rdcEntity.getId(), fileName);
			storageFiles.add(fileDataEntity);
		}
		if (!storageFiles.isEmpty()) {
			fileDataDao.saveFileDatas(storageFiles);
		}
		// save honorPic
		List<FileDataEntity> honorFiles = new ArrayList<FileDataEntity>();
		for (MultipartFile file : honorfiles) {
			if (file == null) {
				continue;
			}
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
			ftpService.uploadFile(uploadFileEntity);
			FileDataEntity fileDataEntity = new FileDataEntity(file.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_HONOR_PIC, rdcEntity.getId(), fileName);
			honorFiles.add(fileDataEntity);
		}
		if (!honorFiles.isEmpty()) {
			fileDataDao.saveFileDatas(honorFiles);
		}
		if (haveRdcExt)
			rdcExtDao.updateRdcExt(rdcExtEntity);
		else
			rdcExtDao.insertRdcExt(rdcExtEntity);

		return new BaseDto(0);
	}


	@RequestMapping(value = "/updateRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object update(HttpServletRequest request, @RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			@RequestParam(required = false) MultipartFile arrangePics, RdcAddDTO rdcAddDTO,
			@RequestParam(required = false) MultipartFile honor0, @RequestParam(required = false) MultipartFile honor1,
			@RequestParam(required = false) MultipartFile honor2, @RequestParam(required = false) MultipartFile honor3,
			@RequestParam(required = false) MultipartFile honor4, @RequestParam(required = false) MultipartFile honor5,
			@RequestParam(required = false) MultipartFile honor6, @RequestParam(required = false) MultipartFile honor7
			, String empStr)
					throws Exception {
		if (!StringUtils.isEmpty(empStr)) {
			rdcAddDTO= JSONObject.parseObject(empStr, RdcAddDTO.class);
		}
		MultipartFile[] files = { file4, file3, file2, file1, file0 };
		MultipartFile[] honorfiles = { honor7, honor6, honor5, honor4, honor3, honor2, honor1, honor0 };
		MultipartFile arrangePic = arrangePics;

		int rdcId = rdcAddDTO.getRdcId();
		RdcEntity rdcEntity = rdcDao.findRDCByRDCId(rdcId).get(0);

		rdcEntity.setName(URLDecoder.decode(rdcAddDTO.getName(), "UTF-8"));
		rdcEntity.setAddress(URLDecoder.decode(rdcAddDTO.getAddress(), "UTF-8"));
		rdcEntity.setSqm(rdcAddDTO.getArea());
		rdcEntity.setCapacity(rdcAddDTO.getTonnage());
		rdcEntity.setProvinceid(rdcAddDTO.getProvinceId());
		rdcEntity.setCityid(rdcAddDTO.getCityId());
		rdcEntity.setCellphone(rdcAddDTO.getPhoneNum());
		rdcEntity.setPhone(rdcAddDTO.getTelphoneNum());
		rdcEntity.setCommit(URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8"));
		Map<String, String> lngLatMap = rdcService.geocoderLatitude(rdcEntity);
		if (SetUtil.isNotNullMap(lngLatMap)) {
			rdcEntity.setLongitude(Double.parseDouble(lngLatMap.get("lng")));
			rdcEntity.setLatitude(Double.parseDouble(lngLatMap.get("lat")));
		}
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
		rdcExtEntity.setStoragestruct((byte) rdcAddDTO.getStructure());
		rdcExtEntity.setStorageplatform((byte) rdcAddDTO.getPlatform());
		rdcExtEntity.setStorageplatformtype((byte) 1); // 后续添加
		rdcExtEntity.setStorageislihuo((byte) rdcAddDTO.getLihuoRoom());
		rdcExtEntity.setStoragelihuocontrol((byte) rdcAddDTO.getLihuoTemperCtr());
		rdcExtEntity.setStoragelihuoarea(rdcAddDTO.getLihuoArea());
		rdcExtEntity.setStoragerefreg((byte) rdcAddDTO.getStorageRefreg());
		rdcExtEntity.setStoragetempmonitor((byte) rdcAddDTO.getTemperRecord());
		String capacity = rdcAddDTO.getCapacity1()+":"+rdcAddDTO.getHeight1() + ","+rdcAddDTO.getCapacity2()+":"
				+ rdcAddDTO.getHeight2()+ "," + rdcAddDTO.getCapacity3()+":"+rdcAddDTO.getHeight3() + ","
				+ rdcAddDTO.getCapacity4()+":"+rdcAddDTO.getHeight4();
		rdcExtEntity.setStoragecapacity(capacity);
		String truck = "1:" + rdcAddDTO.getColdTruck1() + ",2:" + rdcAddDTO.getColdTruck2() + ",3:"
				+ rdcAddDTO.getColdTruck3() + ",4:" + rdcAddDTO.getColdTruck4();
		rdcExtEntity.setStoragetruck(truck);
		rdcExtEntity.setStoragetempertype((byte) rdcAddDTO.getTemperType());
		rdcExtEntity.setFacility(URLDecoder.decode(rdcAddDTO.getFacility(), "UTF-8"));
		rdcExtEntity.setCompanydevice((byte) rdcAddDTO.getCompanyDevice());

		String dir = String.format("%s/rdc/%s", baseDir, rdcAddDTO.getRdcId());
		List<FileDataEntity> storageFiles = new ArrayList<FileDataEntity>();
		for (MultipartFile file : files) {
			if (file == null) {
				continue;
			}
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
			ftpService.uploadFile(uploadFileEntity);
			FileDataEntity fileDataEntity = new FileDataEntity(file.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_STORAGE_PIC, rdcEntity.getId(), fileName);
			storageFiles.add(fileDataEntity);
		}
		if (!storageFiles.isEmpty()) {
			fileDataDao.saveFileDatas(storageFiles);
		}
		// save honorPic
		List<FileDataEntity> honorFiles = new ArrayList<FileDataEntity>();
		for (MultipartFile file : honorfiles) {
			if (file == null) {
				continue;
			}
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
			ftpService.uploadFile(uploadFileEntity);
			FileDataEntity fileDataEntity = new FileDataEntity(file.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_HONOR_PIC, rdcEntity.getId(), fileName);
			honorFiles.add(fileDataEntity);
		}
		if (!honorFiles.isEmpty()) {
			fileDataDao.saveFileDatas(honorFiles);
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
	@RequestMapping(value = "/deleteStoragePic")
	public Object deleteStoragePic(FileDataEntity filedata) {
		boolean deleted = ftpService.deleteFile(filedata.getLocation());
		if (deleted) {
			fileDataDao.deleteById(filedata.getId());
		}
		return new BaseDto(deleted ? 0 : -1);
	}

	@RequestMapping(value = "/updateMapping", method = RequestMethod.POST)
	@ResponseBody
	public Object updateMapping(@RequestBody MappingDto dto) {
		try {
			gson.fromJson(dto.getMapping(), new TypeToken<Map<String, Object>>() {
			}.getType());
		} catch (JsonParseException e) {
			return new ResultDto(-1, "参数不是合法的json map");
		}

		rdcDao.updateMappingById(dto.getId(), dto.getMapping());

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


	@RequestMapping(value = "/delByRdcIDs")
	@ResponseBody
	public Object delByRdcIDs(Integer[] rdcIDs,HttpSession session) {
		ArrayList<Integer> donotDel=new ArrayList<Integer>();
		ArrayList<RdcEntity> rdcEntities = new ArrayList<RdcEntity>();
		for (Integer rdcID : rdcIDs) {
			List<RdcUser> byRdcID = rdcUserDao.getByRdcID(rdcID);
			if (byRdcID.size()==0){
				RdcEntity rdc = rdcDao.getRdcById(rdcID);
				rdcEntities.add(rdc);
				rdcService.deleteByRdcId(rdcID);
			}else {
				donotDel.add(rdcID);
			}
		}
		if(rdcEntities.size()!=0){
			String delRdcJson = gson.toJson(rdcEntities);
			AdminEntity admin = (AdminEntity) session.getAttribute("admin");
			OperationLog operationLog = new OperationLog();
			operationLog.setName("删除冷库");
			operationLog.setAddtime(new Date());
			operationLog.setAdminId(admin.getId());
			operationLog.setContent("删除冷库");
			operationLog.setType(3);
			operationLog.setStype(1);
			operationLog.setMapper(delRdcJson);
			operationLogMapper.insert(operationLog);
		}
		if(donotDel.size()!=0){
			return new ResultDto(0,"冷库id为"+donotDel.toString()+"的有关联用户，不能删除，请确认！");
		}
		return new ResultDto(1,"删除成功！");
	}

	/*改版完成后删除*/
	@ResponseBody
	@RequestMapping(value = "/deleteByRdcIDs")
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
	@RequestMapping(value = "/changeStand", method = RequestMethod.POST)
	public Object changeStand(int rdcID, int stand) {
		rdcDao.changeStand(rdcID, stand);
		rdcAuthMapper.delStandByRdcId(rdcID);
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

	@RequestMapping(value = "/findAllColdStorageHonor", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllColdStorageHonor() {
		return storageHonorDao.findAll();
	}

	@RequestMapping(value = "/findExtByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public RdcExtEntity findExtByRdcId(Integer rdcId) {
		return rdcExtDao.findRDCExtByRDCId(rdcId).get(0);
	}

	@RequestMapping(value = "/updateHonorPic", method = RequestMethod.POST)
	@ResponseBody
	public Object updateHonorPic(int rdcId, int[] honorPic) {
		List<RdcExtEntity> rdcExtByRDCId = rdcExtDao.findRDCExtByRDCId(rdcId);
		if (!CollectionUtils.isEmpty(rdcExtByRDCId)) {
			String honorPics = "";
			if (honorPic != null && honorPic.length > 0) {
				for (int i = 0, size = honorPic.length; i < size; i++) {
					honorPics = honorPics + honorPic[i];
					if (i != size - 1)
						honorPics = honorPics + ",";
				}
			}
			rdcExtByRDCId.get(0).setHonorpiclocation(honorPics);
			rdcExtDao.updateRdcExt(rdcExtByRDCId.get(0));
		}
		return new ResultDto(0, "资质荣誉审核成功");
	}

	/**
	 * 冷库认证
	 * @param request
	 * @param rdcId
	 * @param authUserId
	 * @return
	 */
	@RequestMapping(value = "/updateRdcAuth", method = RequestMethod.POST)
	@ResponseBody
	public Object updateRdcAuth(HttpServletRequest request, int rdcId, int authUserId) {
		try {
			RdcEntity rdcEntity = rdcDao.findRDCByRDCId(rdcId).get(0);
			rdcEntity.setUserId(authUserId);
			rdcEntity.setAudit(2); // 已认证
			rdcDao.updateRdc(rdcEntity);

			RdcAuthLogEntity rdcAuthLogEntity = new RdcAuthLogEntity();
			AdminEntity admin = (AdminEntity) request.getSession().getAttribute("admin");
			rdcAuthLogEntity.setType("认证审核");
			rdcAuthLogEntity.setAuthuserid(admin.getId()); // 审核人
			rdcAuthLogEntity.setApplyuserid(authUserId); // 申请人
			rdcAuthLogEntity.setChangeduserid(rdcEntity.getUserId()); // 被替换人
			rdcAuthLogEntity.setDesc("审核通过,更新冷库库主");
			rdcAuthLogDao.insert(rdcAuthLogEntity);

			RoleUser roleUserByUserId = roleUserDao.getRoleUserByUserId(authUserId); // 默认用户账号与管理员账号不会重复
			if (roleUserByUserId == null) {
				RoleUser roleUser = new RoleUser();
				roleUser.setRoleid(1); // op
				roleUser.setUserid(authUserId);
				roleUser.setAddtime(new Date());
				roleUserDao.insertSelective(roleUser);
			}
//
			RdcUser byRdcId = rdcUserDao.findByRdcId(rdcId);//邏輯修改
			if (byRdcId == null) {
				RdcUser rdcUser = new RdcUser();
				rdcUser.setRdcid(rdcId);
				rdcUser.setUserid(authUserId);
				rdcUser.setAddtime(new Date());
				rdcUserDao.insertSelective(rdcUser);
			} else {
				byRdcId.setUserid(authUserId);
				rdcUserDao.updateByPrimaryKeySelective(byRdcId);
			}
			UserEntity user = this.userDao.findUserById(authUserId);
			if(user.getType()==UserVersion.MaintVERSION.getType()){//维修商
			   List<HashMap<String, Object>> useracl = this.aclMapper.getNACLByID("ACL_USER","UID",authUserId);
			   if(SetUtil.isnotNullList(useracl)){
				 this.aclMapper.upuserAcl(authUserId, 9, null);
			   }else{
				   this.aclMapper.adduserAcl(authUserId, 9, null);//采用默认权限。。。
			   }
			}
			return new ResultDto(0, "冷库认证审核成功！");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ResultDto(-1, "冷库认证审核失败！请稍后重试！");
		}
	}
	//new sys 获得热电厂Tree
	@RequestMapping(value = "/getRdcTree")
	@ResponseBody
	public List<HashMap<String, Object>> getRdcTree(String keyword){
		return this.rdcDao.getRdcByName(keyword);
	}


	private int getRdcInfoIntegrity(RdcAddDTO rdcAddDTO){
		int infoIntegrity=56;
		if (rdcAddDTO.getColdTruck1()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getColdTruck2()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getColdTruck3()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getColdTruck4()!=0){infoIntegrity+=2;}
		if (!StringUtil.isNull(rdcAddDTO.getRemark())){infoIntegrity+=2;}
		if (rdcAddDTO.getStructure()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getPlatform()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getLihuoRoom()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getLihuoArea()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getLihuoTemperCtr()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getStorageRefreg()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getTemperRecord()!=0){infoIntegrity+=2;}
		if (!StringUtil.isNull(rdcAddDTO.getFacility())){infoIntegrity+=2;}
		if (rdcAddDTO.getCapacity1()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getCapacity2()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getCapacity3()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getCapacity4()!=0){infoIntegrity+=2;}
		if (rdcAddDTO.getHeight1()!=null && !rdcAddDTO.getHeight1().trim().equals("")){infoIntegrity+=2;}
		if (rdcAddDTO.getHeight2()!=null && !rdcAddDTO.getHeight2().trim().equals("")){infoIntegrity+=2;}
		if (rdcAddDTO.getHeight3()!=null && !rdcAddDTO.getHeight3().trim().equals("")){infoIntegrity+=2;}
		if (rdcAddDTO.getHeight4()!=null && !rdcAddDTO.getHeight4().trim().equals("")){infoIntegrity+=2;}
		if (rdcAddDTO.getWebsite()!=null && !rdcAddDTO.getWebsite().trim().equals("")){infoIntegrity+=2;}
		return infoIntegrity;
	}
	
}
