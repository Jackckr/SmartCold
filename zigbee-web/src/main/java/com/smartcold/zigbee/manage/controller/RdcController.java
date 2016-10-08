package com.smartcold.zigbee.manage.controller;

import java.io.File;
import java.net.URLDecoder;
import java.util.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.CompanyDeviceMapper;
import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dao.RdcExtMapper;
import com.smartcold.zigbee.manage.dao.RdcMapper;
import com.smartcold.zigbee.manage.dao.StorageManageTypeMapper;
import com.smartcold.zigbee.manage.dao.StorageRefregMapper;
import com.smartcold.zigbee.manage.dao.StorageStructureTypeMapper;
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
import com.smartcold.zigbee.manage.util.APP;
import com.smartcold.zigbee.manage.util.ResponseData;
import com.smartcold.zigbee.manage.util.SetUtil;
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
	private StorageStructureTypeMapper storageStructureDao;
	
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

	@RequestMapping(value = "/findRdcAddressList", method = RequestMethod.GET)
	@ResponseBody
	public Object findRdcAddressList() {
		return rdcService.findAllRdcAddressDtos();
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

	@RequestMapping(value = "/findRDCEntityDtoByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCEntityDtoByRdcId(@RequestParam int rdcID) {
		return rdcMapper.findRDCEntityDtoByRdcId(rdcID);
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
	
	@RequestMapping(value = "/findAllStorageStructureType", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllStorageStructureType() {
		return storageStructureDao.findAll();
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
	

	 @RequestMapping(value = "/addRdcForIos",method = RequestMethod.POST)
	    @ResponseBody
	    public void addRdcForIos(MultipartHttpServletRequest muiltRequest,RdcAddDTO rdcAddDTO,HttpServletRequest request) throws Exception{
		 System.out.println(rdcAddDTO.getAddress());
		 System.out.println("enter");
		 System.out.println(muiltRequest.getFile("honor0").getSize());
		/* List<MultipartFile> mulFileList = new ArrayList<MultipartFile>();
		 for (int i = 0; i < muiltRequest.getFiles(muiltRequest.getFileNames().next()).size(); i++) {
			 mulFileList.add(muiltRequest.getFiles(muiltRequest.getFileNames().next()).get(i));
		}
		 System.out.println(muiltRequest.getFiles(muiltRequest.getFileNames().next()));*/
		 add(request, muiltRequest.getFile("honor0"), muiltRequest.getFile("honor0"), muiltRequest.getFile("honor0"),
				 muiltRequest.getFile("honor0"),muiltRequest.getFile("honor0") ,muiltRequest.getFile("honor0"), 
				 muiltRequest.getFile("honor0"),muiltRequest.getFile("honor0"),muiltRequest.getFile("honor0"),
				 muiltRequest.getFile("honor0"), muiltRequest.getFile("honor0"),muiltRequest.getFile("honor0"), muiltRequest.getFile("honor0"),
				 muiltRequest.getFile("honor0"),  rdcAddDTO);
		/* add(request, mulFileList.get(0), mulFileList.get(1), mulFileList.get(2),
				 mulFileList.get(3),mulFileList.get(4) ,mulFileList.get(5), 
				 mulFileList.get(6),mulFileList.get(7),muiltRequest.getFile("file0"),
	        		muiltRequest.getFile("file1"), muiltRequest.getFile("file2"),muiltRequest.getFile("file3"), muiltRequest.getFile("file4"),
	        		muiltRequest.getFile("arrangePics"),  rdcAddDTO);*/
	        /*add(request, muiltRequest.getFile("honor0"), muiltRequest.getFile("honor1"), muiltRequest.getFile("honor2"),
	        		muiltRequest.getFile("honor3"),muiltRequest.getFile("honor4"), muiltRequest.getFile("honor5"), 
	        		muiltRequest.getFile("honor6"),muiltRequest.getFile("honor7"),muiltRequest.getFile("file0"),
	        		muiltRequest.getFile("file1"), muiltRequest.getFile("file2"),muiltRequest.getFile("file3"), muiltRequest.getFile("file4"),
	        		muiltRequest.getFile("arrangePics"),  rdcAddDTO);*/
	 }
	
	@RequestMapping(value = "/addRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object add(HttpServletRequest request,
					  @RequestParam(required = false) MultipartFile honor0, @RequestParam(required = false) MultipartFile honor1,
					  @RequestParam(required = false) MultipartFile honor2, @RequestParam(required = false) MultipartFile honor3,
					  @RequestParam(required = false) MultipartFile honor4, @RequestParam(required = false) MultipartFile honor5,
					  @RequestParam(required = false) MultipartFile honor6, @RequestParam(required = false) MultipartFile honor7,
					  @RequestParam(required = false) MultipartFile file0,
					  @RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
					  @RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
					  @RequestParam(required = false) MultipartFile arrangePics, RdcAddDTO rdcAddDTO) throws Exception {

		MultipartFile[] files = {file4, file3, file2, file1, file0};
		MultipartFile[] honorfiles = {honor7, honor6,honor5, honor4,honor3, honor2,honor1, honor0};
		MultipartFile arrangePic = arrangePics;
		RdcEntity rdcEntity = new RdcEntity();
		rdcEntity.setName(URLDecoder.decode(rdcAddDTO.getName(), "UTF-8"));
		String address = URLDecoder.decode(rdcAddDTO.getAddress(), "UTF-8");
		rdcEntity.setAddress(address);
		rdcEntity.setSqm(rdcAddDTO.getArea());
		rdcEntity.setCapacity(rdcAddDTO.getTonnage());
		rdcEntity.setProvinceid(rdcAddDTO.getProvinceId());
		rdcEntity.setCityid(rdcAddDTO.getCityId());
		rdcEntity.setCellphone(rdcAddDTO.getPhoneNum());
		if (rdcAddDTO.getRemark()!=null) {
			rdcEntity.setCommit(URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8"));
		}
		/*UserEntity user = (UserEntity) request.getSession().getAttribute("user");
		rdcEntity.setUserId(user.getId());*/
		rdcEntity.setUserId(24);
		rdcEntity.setType(0);
		rdcEntity.setStoragetype("");
		rdcEntity.setColdtype("");
		rdcEntity.setContact("");
		rdcEntity.setPosition("");
		rdcEntity.setPowerConsume(0);
		Map<String, String> lngLatMap = rdcService.geocoderLatitude(rdcEntity);
		if(!SetUtil.isNullMap(lngLatMap)){
			rdcEntity.setLongitude(Double.parseDouble(lngLatMap.get("lng")));
			rdcEntity.setLatitude(Double.parseDouble(lngLatMap.get("lat")));
		}

		rdcMapper.insertRdc(rdcEntity);

		// 插入rdc表,返回对应的ID
		RdcExtEntity rdcExtEntity = new RdcExtEntity();
		rdcExtEntity.setRDCID(rdcEntity.getId()); // 由上面返回
		rdcExtEntity.setStoragestruct((byte)rdcAddDTO.getStructure());
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
		String capacityheight = "1:" + rdcAddDTO.getHeight1() + ",2:" + rdcAddDTO.getHeight2() + ",3:"
				+ rdcAddDTO.getHeight3() + ",4:" + rdcAddDTO.getHeight4() + ",5:" + rdcAddDTO.getHeight5();
		rdcExtEntity.setStoragecapacity(capacity);
		rdcExtEntity.setStoragecapacityheight(capacityheight);
		String truck = "1:" + rdcAddDTO.getColdTruck1() + ",2:" + rdcAddDTO.getColdTruck2() + ",3:"
				+ rdcAddDTO.getColdTruck3() + ",4:" + rdcAddDTO.getColdTruck4();
		rdcExtEntity.setStoragetruck(truck);
		rdcExtEntity.setStoragetempertype((byte) rdcAddDTO.getTemperType());
		if (rdcAddDTO.getFacility()!=null) {
			rdcExtEntity.setFacility(URLDecoder.decode(rdcAddDTO.getFacility(), "UTF-8"));
		}
		
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

	@RequestMapping(value = "/updateRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object update(
			@RequestParam(required = false) MultipartFile honor0, @RequestParam(required = false) MultipartFile honor1,
			@RequestParam(required = false) MultipartFile honor2, @RequestParam(required = false) MultipartFile honor3,
			@RequestParam(required = false) MultipartFile honor4, @RequestParam(required = false) MultipartFile honor5,
			@RequestParam(required = false) MultipartFile honor6, @RequestParam(required = false) MultipartFile honor7,
			@RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			@RequestParam(required = false) MultipartFile arrangePics, RdcAddDTO rdcAddDTO) throws Exception {

		MultipartFile[] files = { file4, file3, file2, file1, file0 };
		MultipartFile[] honorfiles = {honor7, honor6,honor5, honor4,honor3, honor2,honor1, honor0};
		MultipartFile arrangePic = arrangePics;

		int rdcId = rdcAddDTO.getRdcId();
		RdcEntity rdcEntity = rdcMapper.findRDCByRDCId(rdcId).get(0);

		String address = URLDecoder.decode(rdcAddDTO.getAddress(), "UTF-8");
		rdcEntity.setAddress(address);
		rdcEntity.setSqm(rdcAddDTO.getArea());
		rdcEntity.setCapacity(rdcAddDTO.getTonnage());
		rdcEntity.setCellphone(rdcAddDTO.getPhoneNum());
		rdcEntity.setCommit(URLDecoder.decode(rdcAddDTO.getRemark(), "UTF-8"));
		Map<String, String> lngLatMap = rdcService.geocoderLatitude(rdcEntity);
		if(SetUtil.isNotNullMap(lngLatMap)){
			rdcEntity.setLongitude(Double.parseDouble(lngLatMap.get("lng")));
			rdcEntity.setLatitude(Double.parseDouble(lngLatMap.get("lat")));
		}
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
		rdcExtEntity.setStoragestruct((byte)rdcAddDTO.getStructure());
		rdcExtEntity.setStorageplatformtype((byte) 1); // 后续添加
		rdcExtEntity.setStorageislihuo((byte) rdcAddDTO.getLihuoRoom());
		rdcExtEntity.setStoragelihuocontrol((byte) rdcAddDTO.getLihuoTemperCtr());
		rdcExtEntity.setStoragelihuoarea(rdcAddDTO.getLihuoArea());
		rdcExtEntity.setStoragerefreg((byte) rdcAddDTO.getStorageRefreg());
		rdcExtEntity.setStoragetempmonitor((byte) rdcAddDTO.getTemperRecord());
		String capacity = "1:" + rdcAddDTO.getCapacity1() + ",2:" + rdcAddDTO.getCapacity2() + ",3:"
				+ rdcAddDTO.getCapacity3() + ",4:" + rdcAddDTO.getCapacity4() + ",5:" + rdcAddDTO.getCapacity4();
		String capacityheight = "1:" + rdcAddDTO.getHeight1() + ",2:" + rdcAddDTO.getHeight2() + ",3:"
				+ rdcAddDTO.getHeight3() + ",4:" + rdcAddDTO.getHeight4() + ",5:" + rdcAddDTO.getHeight5();
		rdcExtEntity.setStoragecapacity(capacity);
		rdcExtEntity.setStoragecapacityheight(capacityheight);
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
	@RequestMapping(value = "/deleteStoragePic", method = RequestMethod.DELETE)
	public Object deleteStoragePic(FileDataEntity filedata) {
		boolean deleted = ftpService.deleteFile(filedata.getLocation());
		if (deleted) {
			fileDataDao.deleteById(filedata.getId());
		}
		return new BaseDto(deleted ? 0 : -1);
	}

	/**
	 * 获得冷库信息
	 * @param rdcID
	 * @return
	 */
	 @APP(value="app")
	 @RequestMapping(value = "/findRDCByID")
	 @ResponseBody
	 public ResponseData<HashMap<String, Object>> findRDCByID(Integer rdcID){
		 if(rdcID==null){return ResponseData.newFailure("无效id");}
		 List<HashMap<String, Object>> list = this.rdcService.findRDCById(rdcID);
		 if (SetUtil.isnotNullList(list)) { 
			 for (HashMap<String, Object> data : list) {
				 List<FileDataEntity> files = this.fileDataDao.findByBelongIdAndCategory(Integer.parseInt(data.get("id").toString()), FileDataMapper.CATEGORY_STORAGE_PIC);
				 if(SetUtil.isnotNullList(files)){
						List<String> filelist =new ArrayList<String>();
						for (FileDataEntity file : files) {
							filelist.add(FtpService.READ_URL+file.getLocation());
						}
						data.put("files", filelist);
				} 
				 if(data.get("storagetruck")!=null){//设置车辆信息
					 String[] splitfhString = StringUtil.splitfhString(data.get("storagetruck")+"");
					 for (int i = 0; i < splitfhString.length; i++) {
						 data.put("storagetruck"+i,  splitfhString[i].split(":")[1]);
					 }
				 }
			}
			return ResponseData.newSuccess(list);
		} else {
           return ResponseData.newFailure("没有数据");
		}
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
				String betsmdata[]=  betdata.split("~");
				if(betsmdata.length==2){
					sqlfilter.append(" r.sqm BETWEEN "+betsmdata[0]+" AND "+betsmdata[1] +" or");
				}else{
					if(sqm.indexOf("<")!=-1||sqm.indexOf(">")!=-1){
						sqlfilter.append(" r.sqm  "+betsmdata[0]+" or");
					}else{
						return "";
					}
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
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("dt", this.commonService.getBaseData("storagetype", "id", "type"));// 商品存放形式
		data.put("mt", this.commonService.getBaseData("storagemanagetype", "id", "type"));// 经营类型
		data.put("te", this.commonService.getBaseData("storagetempertype", "id", "type"));// 温度类型
		result.setEntity(data);
		return result;
	}

	@RequestMapping(value = "/findRDCDTOByUserId")
	@ResponseBody
	public Object findRDCDTOByUserId(@RequestParam int userID,int pageNum, int pageSize, 
			@RequestParam(value = "keyword", required = false) String keyword) {
		PageHelper.startPage(pageNum, pageSize);
		if (keyword!=null) {
			keyword = keyword.equals("")? null:keyword ;
		}
		Page<RdcEntityDTO> rdcsList = rdcMapper.findRDCByUserId(userID,keyword);
		PageInfo<RdcEntityDTO> data = new PageInfo<RdcEntityDTO>(rdcsList);
		return ResponseData.newSuccess(data);
	}
	
	@ResponseBody
	@RequestMapping(value = "/deleteByRdcID")
	public Object deleteByRdcID(Integer rdcID) {
		if (rdcID==null||rdcID <= 0) {return new BaseDto(-1);}
		rdcService.deleteByRdcId(rdcID);
		return new BaseDto(0);
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
		if(StringUtil.isnotNull(isKey)){managementType=storageType= storagetempertype=sqm=hasCar=null;}
		filter.put("hasCar", hasCar);
		filter.put("orderBy", orderBy);
		filter.put("keyword", keyword);
		filter.put("provinceid", provinceid);
		filter.put("sqm", getSqmFilter(sqm));
		filter.put("storageType", storageType);//存放类型
		filter.put("managementType", managementType);//经营类型
		filter.put("storagetempertype", storagetempertype);//温度类型
		PageInfo<RdcEntityDTO> data = this.rdcService.getRDCList(this.pageNum, this.pageSize, filter);
		return ResponseData.newSuccess(data);
	}

	@RequestMapping(value = "/runLngLat", method = RequestMethod.GET)
	@ResponseBody
	public void runLngLat() {
		rdcService.calculateLngLat();
	}


	@RequestMapping(value = "/authRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object authRdc(HttpServletRequest request, @RequestParam(required = false) MultipartFile authfile0, int rdcId) throws Exception {
		MultipartFile authfile = authfile0;

		RdcEntity rdcEntity = rdcMapper.findRDCByRDCId(rdcId).get(0);
		String dir = String.format("%s/rdc/%s", baseDir, rdcId);
		UserEntity user = (UserEntity) request.getSession().getAttribute("user");
		if (authfile != null) {
			String fileName = String.format("rdc%s_%s_%s.%s", rdcId, user.getId(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, authfile, dir);
			ftpService.uploadFile(uploadFileEntity);
			FileDataEntity arrangeFile = new FileDataEntity(authfile.getContentType(), dir + "/" + fileName,
					FileDataMapper.CATEGORY_AUTH_PIC, rdcEntity.getId(), fileName);
			fileDataDao.saveFileData(arrangeFile);
		}
		// 上传认证后更改冷库审核状态为待审核
		rdcEntity.setAudit(0);
		rdcMapper.updateRdc(rdcEntity);
		return new BaseDto(0);
	}
}