package com.smartcold.manage.cold.controller;

import java.io.File;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.smartcold.manage.cold.dao.olddb.ACLMapper;
import com.smartcold.manage.cold.dao.olddb.ColdstorageTempsetMapper;
import com.smartcold.manage.cold.dao.olddb.FileDataMapper;
import com.smartcold.manage.cold.dao.olddb.MessageMapper;
import com.smartcold.manage.cold.dao.olddb.MessageRecordMapping;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.dao.olddb.RdcauthMapping;
import com.smartcold.manage.cold.dao.olddb.RoleUserMapper;
import com.smartcold.manage.cold.dao.olddb.UserMapper;
import com.smartcold.manage.cold.dto.ResultDto;
import com.smartcold.manage.cold.dto.UploadFileEntity;
import com.smartcold.manage.cold.entity.olddb.FileDataEntity;
import com.smartcold.manage.cold.entity.olddb.MessageRecord;
import com.smartcold.manage.cold.entity.olddb.Rdc;
import com.smartcold.manage.cold.entity.olddb.RdcAuthEntity;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.entity.olddb.RoleUser;
import com.smartcold.manage.cold.entity.olddb.SystemInformEntity;
import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.FtpService;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * Created by qiangzi on 2017/5/14.
 * 
 * 认证冷库信息
 * 
 */
@Controller
@RequestMapping(value = "/authenUser")
public class AuthenUserController {
    private static String baseDir = "picture";
    
    
    @Autowired
    private RdcMapper rdcMapper;
    @Autowired
    private  ACLMapper aclMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private FtpService ftpService;
    @Autowired
    private MessageMapper sysMessageMapper;//向后台管理员通知管理信息
    @Autowired
    private FileDataMapper fileDataDao;
    @Autowired
    private  RoleUserMapper roleUserDao;
    @Autowired
    private  RdcUserMapper rdcUserMapper;
    @Autowired
    private RdcauthMapping rdcauthMapping;
    @Autowired
    private MessageRecordMapping messageRecordMapping;//用户消息
    @Autowired
    private  ColdstorageTempsetMapper coldstorageTempsetMapper;

    
    
    

    @RequestMapping(value = "/attestationRdc",method = RequestMethod.POST)
    @ResponseBody
    public Object attestationRdc(int userId,String userName, int rdcId,  int type, MultipartFile authfile) {
    	try {
    		String msg="";
    		Rdc rdc = this.rdcMapper.selectByPrimaryKey(rdcId);
			if (type==0){
				String dir =null;String fileName=null;
				if (authfile != null) {//
					    dir = String.format("%s/rdc/%s", baseDir, rdcId);
						fileName = String.format("rdc%s_%s_%s.%s", rdcId,userId, new Date().getTime(), "jpg");
						UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, authfile, dir);
						this.ftpService.uploadFile(uploadFileEntity);
						FileDataEntity arrangeFile = new FileDataEntity(authfile.getContentType(), dir + "/" + fileName,FileDataMapper.CATEGORY_AUTH_PIC, rdcId, fileName);
						arrangeFile.setDescription(type+"");
						this.fileDataDao.saveFileData(arrangeFile);
					}
			        RdcAuthEntity auchedata = new RdcAuthEntity();
			        auchedata.setType(type);
			        auchedata.setUid(userId);
			        auchedata.setRdcid(rdcId);
			        auchedata.setMsg(userName+"认证冷库"+rdc.getName()+"!请及时处理！");
			        if(authfile!=null){
			         auchedata.setImgurl(dir + File.separator + fileName);
			        }
			        this.rdcauthMapping.insertCertification(auchedata);//插入认证信息
			        msg="尊敬的用户，您的申请已提交成功，受理编号为<span id=\"proNo\">"+auchedata.getId()+"</span>。";
			}else {
				
			    MessageRecord msgMessageRecord = new MessageRecord();
			    if(rdc!=null&&rdc.getUserid()!=0){
			    	msgMessageRecord.setTid(rdc.getUserid());
			    }
			    msgMessageRecord.setType(1);
			    msgMessageRecord.setsType(type);
			    msgMessageRecord.setUid(userId);
			    msgMessageRecord.setRdcId(rdcId);
			    msgMessageRecord.setTitle("请求冷库认证");
			    msgMessageRecord.setMessage(userName+"请求成为您的"+(type==1?"货主":"维修商")+",请及时处理！");
			    msgMessageRecord.setAddTime(TimeUtil.getDateTime());
			    this.messageRecordMapping.insertMessageRecord(msgMessageRecord);
			    msg="您的申请已提交成功！请耐心等待！";
			}
			this.userMapper.updateTypeById(new UserEntity(userId,type));
			return new ResultDto(1,msg);	
    	} catch (Exception e) {
			e.printStackTrace();
			return new ResultDto(0,"");
		}
    }
    
    /**
     * 授权
     * @param userId
     * @param rdcId
     * @param status
     * @return
     */
    //id=1&oid=212,213&rdcId=1911&status=1&userId=8
    @RequestMapping(value = "/authorUserByRdcId",method = RequestMethod.POST)
    @ResponseBody
    public boolean authorUserByRdcId(int id,int userId,int stype, int rdcId, int status,String oids) {
    	try {
			if(status==1&&(stype==1||stype==2)){
					UserEntity user = this.userMapper.findById(userId);
					if(user==null){return false; }//用户被删除
					if(stype==1){//申请温度版
						String item = this.coldstorageTempsetMapper.getItem(rdcId, userId);
						if(StringUtil.isnotNull(item)){
							this.coldstorageTempsetMapper.upItem(rdcId, userId, oids);
						}else{
							this.coldstorageTempsetMapper.addItem(rdcId, userId, oids);
						}
					}
					RoleUser roleUserByUserId = roleUserDao.getRoleUserByUserId(userId); // 默认用户账号与管理员账号不会重复
					if (roleUserByUserId == null) {
						RoleUser roleUser = new RoleUser();
						roleUser.setRoleid(1); // op
						roleUser.setUserid(userId);
						roleUser.setAddtime(new Date());
						this.roleUserDao.insertSelective(roleUser);
					}
					RdcUser byRdcId = rdcUserMapper.findByUserId(userId);
					if (byRdcId == null) {
						RdcUser rdcUser = new RdcUser();
						rdcUser.setRdcid(rdcId);
						rdcUser.setUserid(userId);
						rdcUser.setAddtime(new Date());
						this.rdcUserMapper.insertSelective(rdcUser);
					} 
					if(stype==1||stype==2){
						int rolid=stype==1?10:9;
						List<HashMap<String, Object>> useracl = this.aclMapper.getNACLByID("ACL_USER","UID",userId);
					   if(SetUtil.isnotNullList(useracl)){
						   this.aclMapper.upuserAcl(userId, rolid, null);
					   }else{
						   this.aclMapper.adduserAcl(userId, rolid, null);//采用默认权限。。。
					   }
					}
					Rdc rdc = this.rdcMapper.selectByPrimaryKey(rdcId);
					String title=stype==1?"冷库绑定货主通知":"冷库认证服务商通知";
				    String msg="用户:"+user.getUsername()+"绑定冷库:"+rdc.getName();
					SystemInformEntity sysWarningsInfo=new SystemInformEntity(0, stype, rdcId, null, 0, 0, 0, title, msg);
					this.sysMessageMapper.addsystemInform(sysWarningsInfo);
					this.messageRecordMapping.updateState(id, 1,1);
				
			}else{
				this.messageRecordMapping.updateState(id, 1, status);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return true;
    }
    
    
}
