package com.smartcold.zigbee.manage.controller;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.CompanyDeviceMapper;
import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dao.RdcExtMapper;
import com.smartcold.zigbee.manage.dao.RdcMapper;
import com.smartcold.zigbee.manage.dao.StorageManageTypeMapper;
import com.smartcold.zigbee.manage.dao.StorageRefregMapper;
import com.smartcold.zigbee.manage.dao.StorageTemperTypeMapper;
import com.smartcold.zigbee.manage.dao.StorageTypeMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.NgRemoteValidateDTO;
import com.smartcold.zigbee.manage.dto.RdcAddDTO;
import com.smartcold.zigbee.manage.dto.RdcEntityDTO;
import com.smartcold.zigbee.manage.dto.UploadFileEntity;
import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.entity.RdcEntity;
import com.smartcold.zigbee.manage.entity.RdcExtEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.CommonService;
import com.smartcold.zigbee.manage.service.FtpService;
import com.smartcold.zigbee.manage.service.RdcService;
import com.smartcold.zigbee.manage.util.ResponseData;
import com.smartcold.zigbee.manage.util.StringUtil;
import com.smartcold.zigbee.manage.util.VerifyUtil;

@Controller
@RequestMapping(value = "/rdc")
public class RdcController {

	private static String baseDir = "picture";

	private int pageNum;

	private int pageSize;

	@Autowired
	private RdcMapper rdcMapper;

	@Autowired
	private RdcExtMapper rdcExtDao;

	@Autowired
	private RdcService rdcService;

	@Resource(name="commonService")
	private CommonService commonService;
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

	@RequestMapping(value = "/findHotRdcDTOList", method = RequestMethod.GET)
	@ResponseBody
	public Object findHotRdcDTOList(@RequestParam int npoint) {
		return rdcService.findHotRdcDTOList(npoint);
	}

	@RequestMapping(value = "/findScoreRdcDTOList", method = RequestMethod.GET)
	@ResponseBody
	public Object findScoreRdcDTOList(@RequestParam int npoint) {
		return rdcService.findScoreRdcDTOList(npoint);
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
		rdcEntity.setUserId(user.getId());
		rdcEntity.setType(0);
		rdcEntity.setStoragetype("");
		rdcEntity.setColdtype("");
		rdcEntity.setContact("");
		rdcEntity.setPosition("");
		rdcEntity.setPowerConsume(0);

		rdcMapper.insertRdc(rdcEntity);

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
//		rdcExtEntity.setStoragepiclocation(new Gson().toJson(storagepicLocations));
		

		// save arrangePic
		if (arrangePic != null) {
			String fileName = String.format("rdc%s_%s.%s", rdcExtEntity.getRDCID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, arrangePic, dir);
			// uploadFileEntities.add(uploadFileEntity);
			ftpService.uploadFile(uploadFileEntity);
//			rdcExtEntity.setArrangepiclocation(dir + "/" + fileName);
			FileDataEntity arrangeFile = new FileDataEntity(arrangePic.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_ARRANGE_PIC, rdcEntity.getId(), fileName);
			fileDataDao.saveFileData(arrangeFile);
		}

		rdcExtDao.insertRdcExt(rdcExtEntity);

		return new BaseDto(0);
	}

	@RequestMapping(value = "/updateRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object update(@RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			@RequestParam(required = false) MultipartFile arrangePics, RdcAddDTO rdcAddDTO) throws Exception {
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
		ngRemoteValidateDTO.setValid(rdcService.checkName(name));
		return ngRemoteValidateDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/checkArea", method = RequestMethod.GET)
	public Object checkArea(@RequestParam("value") String area) {
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(VerifyUtil.isNumeric(area));
		return ngRemoteValidateDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/checkCellphoneFormat", method = RequestMethod.GET)
	public Object checkCellphoneFormat(@RequestParam("value") String phoneNum) {
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(VerifyUtil.checkCellphone(phoneNum));
		return ngRemoteValidateDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/checkRemark", method = RequestMethod.GET)
	public Object checkRemark(@RequestParam("value") String remark) {
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(VerifyUtil.checkRemark(remark));
		return ngRemoteValidateDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/checkCellphone", method = RequestMethod.GET)
	public Object checkCellphone(@RequestParam("value") String phoneNum) {
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(!rdcMapper.checkCellphone(phoneNum));
		return ngRemoteValidateDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/deleteStoragePic", method = RequestMethod.POST)
	public Object deleteStoragePic(String url) {
		boolean deleted = ftpService.deleteFile(url);
		return new BaseDto(deleted ? 0 : -1);
	}

	/**
	 * 提供筛选条件
	 * @param sqm
	 * @return
	 */
	private static String getSqmFilter(String sqm)
	{  
		StringBuffer sqlfilter=new StringBuffer("(");
		if(StringUtil.isnotNull(sqm)){
			String filter[]=sqm.split(",");
			for (String betdata : filter) {
			  String betsmdata[]=	betdata.split("~");
			    if(betsmdata.length==2){
			    	sqlfilter.append(" r.sqm BETWEEN "+betsmdata[0]+" AND "+betsmdata[1] +" or");
			    }else{
			    	sqlfilter.append(" r.sqm  "+betsmdata[0]+" or");
			    }
			}
			return sqlfilter.substring(0, sqlfilter.length()-2)+")";
	   }
		return "";
	}
	/**
	 * 获得RDC过滤信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getRDCFilterData")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getRDCFilterData(HttpServletRequest request) {
		ResponseData<HashMap<String, Object>> result = ResponseData.getInstance();
//			String key="getRDCFilterData";
			HashMap<String, Object> data = new HashMap<String, Object>();
//			if(CacheTool.hasCache(key)){
//				data= (HashMap<String, Object>) CacheTool.getdate(key);
//				result.setEntity(data);
//			}else{
				data.put("mt", this.commonService.getBaseData("storagemanagetype", "id", "type"));// 经营类型
				data.put("dt", this.commonService.getBaseData("storagetype", "id", "type"));// 商品存放形式
				data.put("te", this.commonService.getBaseData("storagetempertype", "id", "type"));// 温度类型
				result.setEntity(data);
//				CacheTool.setData(key, data);  
//			}
		return result;
	}
	
	
	/**
	 * findRdcDTOList
	 * 获得配送信息
	 * @param request
	 * @param isKey 主动搜索
	 * @param keyword  关键字
	 * @param managementType  经营类型
	 * @param storageType 存放类型
	 * @param storagetempertype 温度类型
	 * @param sqm 面积
	 * @param hasCar 有无车辆
	 * @param orderBy 排序
	 * @return
	 */
	@RequestMapping(value = "/getRDCList")
	@ResponseBody
	public ResponseData<RdcEntityDTO> getRDCList(HttpServletRequest request,String isKey, String keyword,String provinceid,String managementType,String storageType,String storagetempertype,String sqm,String hasCar,String orderBy) {
		this.pageNum  = Integer.parseInt(request.getParameter("pageNum") == null ? "1" : request.getParameter("pageNum"));
		this.pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "10" : request.getParameter("pageSize")); // 每页数据量
		HashMap<String, Object> filter=new HashMap<String, Object>();
		if(StringUtil.isnotNull(isKey)){
			managementType=storageType= storagetempertype=sqm=hasCar=null; 
		}
		filter.put("hasCar", hasCar);
		filter.put("orderBy", orderBy);
		filter.put("keyword", keyword);
		filter.put("provinceid", provinceid);
		filter.put("sqm", getSqmFilter(sqm));
		filter.put("storageType", storageType);//存放类型
		filter.put("managementType", managementType);//经营类型
		filter.put("storagetempertype", storagetempertype);//温度类型
		System.err.println(filter);
		PageInfo<RdcEntityDTO> data = this.rdcService.getRDCList(this.pageNum, this.pageSize, filter);
		return ResponseData.newSuccess(data);
	}
}
