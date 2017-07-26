package com.smartcold.bgzigbee.manage.controller;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.FileDataMapper;
import com.smartcold.bgzigbee.manage.dao.RdcMapper;
import com.smartcold.bgzigbee.manage.dao.RdcShareInfoMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.UploadFileEntity;
import com.smartcold.bgzigbee.manage.entity.FileDataEntity;
import com.smartcold.bgzigbee.manage.entity.RdcShareDTO;
import com.smartcold.bgzigbee.manage.entity.RdcSharedInfoEntity;
import com.smartcold.bgzigbee.manage.entity.UserEntity;
import com.smartcold.bgzigbee.manage.service.FtpService;
import com.smartcold.bgzigbee.manage.util.ResponseData;
import com.smartcold.bgzigbee.manage.util.StringUtil;
import com.smartcold.bgzigbee.manage.util.TableData;
import com.smartcold.bgzigbee.manage.util.TimeUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * Created by qiangzi on 2017/5/24.
 */
@Controller
@RequestMapping(value = "/rdcShareInfo")
public class RdcShareInfoController {
	@Autowired
	private RdcMapper rdcDao;
    @Resource
    private RdcShareInfoMapper rdcShareInfoMapper;
    
    private static String baseDir = "sharepicture";
    @Autowired
    private FtpService ftpService;
    @Autowired
    private FileDataMapper fileDataDao;
    
	@RequestMapping(value = "/findRdcBykeyword")
	@ResponseBody
	public Object findRdcBykeyword(String  keyword) {
		return rdcDao.findRdcListbyName(keyword,10);
	}

    @RequestMapping(value = "/getRdcShareInfo", method = RequestMethod.POST)
    @ResponseBody
    public TableData getRdcShareInfo(
            String startTime,
            String endTime,
            String  keyword,
            String type,
            String stauts,
            int     page,
            int     rows) {
        if(StringUtil.isnotNull(keyword)){
            keyword = "%" + keyword + "%";
        }else{
            keyword=null;
        }
        Date sTime=null;
        Date eTime=null;
        if (StringUtil.isnotNull(startTime)){
            sTime= TimeUtil.parseYMD(startTime);
        }
        if (StringUtil.isnotNull(endTime)){
            eTime= TimeUtil.parseYMD(endTime);
        }
        PageHelper.startPage(page, rows);
        List<RdcSharedInfoEntity> shareInfo = rdcShareInfoMapper.findShareInfo(type,stauts,keyword,sTime,eTime);
        PageInfo pageInfo=new PageInfo(shareInfo);
        return TableData.newSuccess(pageInfo);
    }

    @RequestMapping(value = "/getRdcShareInfoById", method = RequestMethod.POST)
    @ResponseBody
    public Object getRdcShareInfoById(Integer id){
        RdcSharedInfoEntity shareInfoById = rdcShareInfoMapper.findShareInfoById(id);
        return shareInfoById;
    }

    @RequestMapping(value = "/delRdcShareInfoById", method = RequestMethod.POST)
    @ResponseBody
    public void delRdcShareInfoById(Integer id){
        rdcShareInfoMapper.delShareInfoById(id);
    }

    @RequestMapping(value = "/delRdcShareInfoByIds", method = RequestMethod.POST)
    @ResponseBody
    public Object delRdcShareInfoByIds(int[] rdcShares){
        for (int rdcShare:rdcShares){
            rdcShareInfoMapper.delShareInfoById(rdcShare);
        }
        return new BaseDto(0);
    }
    
    
    
    /**
	 * 免费发布消息
	 * @param request
	 * @param datatype
	 * @param dataid
	 * @RequestParam("files") CommonsMultipartFile[] files
	 * @return
	 */
	@RequestMapping(value="shareFreeRelease")
	@ResponseBody
	public ResponseData<RdcShareDTO> shareFreeRelease(HttpServletRequest request,String  data,Integer uid){
		try {
			if(StringUtil.isNull(data)){return  ResponseData.newFailure("数据不能包含特殊字符~");}
			RdcShareDTO	rdcShareDTO= JSON.parseObject(data, RdcShareDTO.class);//页面数据/ /1.获得表单数据
			if("".equals(rdcShareDTO.getUnitPrice())||"undefined".equals(rdcShareDTO.getUnitPrice())){rdcShareDTO.setUnitPrice("0");}
			Integer loguid = rdcShareDTO.getUid();
			if(uid==null&&loguid==null){
			    UserEntity user =(UserEntity) request.getSession().getAttribute("user");//警告 ->调用该方法必须登录
				if(user!=null&&user.getId()!=0){
					uid=user.getId();
				}else{
					return ResponseData.newFailure("会话超时，请重新登录！~");
				}
			}
			if(uid==null){uid=loguid;}
			if(rdcShareDTO.getId()==0){
				rdcShareDTO.setReleaseID(uid);//设置发布消id//user.getId()
				rdcShareDTO.setStauts(1);
	            this.rdcShareInfoMapper.addshareInfo(rdcShareDTO);//免费发布消息
			}else{
				rdcShareDTO.setUpdatetime(TimeUtil.getDateTime());
				this.rdcShareInfoMapper.updateshareInfo(rdcShareDTO);//修改发布消息
			}
			this.handleFile(rdcShareDTO.getId(), "sharePic", null, request);
		    return ResponseData.newSuccess("发布成功~");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure("发布失败~请稍后重试~");
	}
    /**
     * ????  ????
     */
    public List<FileDataEntity> handleFile(int dataID, String type, UserEntity user, HttpServletRequest request) throws IOException {
    	List<MultipartFile> files = new ArrayList<MultipartFile>();
    	List<FileDataEntity> storageFiles = new ArrayList<FileDataEntity>();
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession() .getServletContext());
       if (multipartResolver.isMultipart(request)) {
	        MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
	        Iterator<String> iter = multiRequest.getFileNames();
	        while (iter.hasNext()) {
	            String para = iter.next();
	            MultipartFile file = multiRequest.getFile(para);
	            files.add(file);
	        }
	        String dir = String.format("%s/share/%s", baseDir,  dataID);
	        for (MultipartFile file : files) {
	            if (file == null) {  continue; }
	            String fileName = String.format("share%s_%s.%s", dataID, new Date().getTime(), "jpg");
	            UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
	            this.ftpService.uploadFile(uploadFileEntity);
	            FileDataEntity fileDataEntity = new FileDataEntity(file.getContentType(),  dir + "/" + fileName, type, dataID, fileName);
	            storageFiles.add(fileDataEntity);
	        }
	        if (!storageFiles.isEmpty()) {
	            this.fileDataDao.saveFileDatas(storageFiles); //??????
	        }
    	 }
     return storageFiles;
    }
}
