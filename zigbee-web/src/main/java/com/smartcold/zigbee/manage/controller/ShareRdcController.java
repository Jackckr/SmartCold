 package com.smartcold.zigbee.manage.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.CommonService;
import com.smartcold.zigbee.manage.service.DocLibraryService;
import com.smartcold.zigbee.manage.service.RdcShareService;
import com.smartcold.zigbee.manage.service.impl.WebvistsService;
import com.smartcold.zigbee.manage.util.ResponseData;
import com.smartcold.zigbee.manage.util.StringUtil;
import com.smartcold.zigbee.manage.util.TelephoneVerifyUtil;
import com.smartcold.zigbee.manage.util.TimeUtil;

@Controller
@RequestMapping(value = "/ShareRdcController")
public class ShareRdcController  {
	
	private int pageNum;//当前页数
	private int pageSize;//每页数量
	
	@Resource(name="commonService")
	private CommonService commonService;
	
	@Resource(name="rdcShareService")
	private RdcShareService rdcShareService;
	
	@Resource(name="docLibraryService")
	private DocLibraryService docLibraryService;
	

	/**
	 * @author MaQiang
	 * @date 2016年6月28日16:00:58
	 */
	private void getPageInfo(HttpServletRequest request) {
		this.pageNum  = Integer.parseInt(request.getParameter("pageNum") == null ? "1" : request.getParameter("pageNum"));
		this.pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "10" : request.getParameter("pageSize")); // 每页数据量
	}
	
	//-----------------------------------------------------------------------------辅助查询条件------------------------------------------------------------
	/**
	 * 查询下拉框数据  Description: ui_getSeleectData
	 * Description: ui_getSeleectData
	 * @author MaQiang
	 * @date 2016年4月25日下午3:32:25
	 * @param tb：对应数据库表明
	 * @param cl：对应数据库列名
	 * @param vl：保存数据库值
	 * @param txt：下拉框显示值
	 * @param cs  对应实体类 ：默认- com.farmen.core.entities.CommMataData
	 * @return
	 */
	@RequestMapping(value = "/ui_getSeleectData")
	@ResponseBody
	public ResponseData<Map<String, Object>> ui_getSeleectData(String data,String value,String text,String cs,String parentCode,String filter) {
				if(data==null||"".equals(data)){
					return ResponseData.newFailure("请设置完整信息");
				}else{
					 try {
						 List<Map<String, Object>> objdata = this.commonService.getBaseData(data+filter, value, text);
						 return ResponseData.newSuccess(objdata);
					} catch (Exception e) {
							e.printStackTrace();
							return ResponseData.newFailure("网络异常~稍后重试~");
					}
				}
	}
	
	/**
	 * 获得睿库共享过滤信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getSEFilterData")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getSEFilterData(HttpServletRequest request) {
		HashMap<String, Object> data = new HashMap<String, Object>();
		ResponseData<HashMap<String, Object>> result = ResponseData.getInstance();
		data.put("mt", this.commonService.getBaseData("storagemanagetype", "id", "type"));// 经营类型
		data.put("st", this.commonService.getBaseData("storagetempertype", "id", "type"));// 温度类型
		result.setEntity(data);
		return result;
	}
	/**
	 * 获得睿库商品过滤信息
	 * 
	 * @return
	 */

	@RequestMapping(value = "/getGDFilterData")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getGDFilterData(HttpServletRequest request) {
		ResponseData<HashMap<String, Object>> result = ResponseData.getInstance();
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("gt", this.commonService.getCommData("good_type"));// 经营类型
		result.setEntity(data);
		return result;
	}
	
	/**
	 * 获得配送过滤信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getPSFilterData")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getPSFilterData(HttpServletRequest request) {
		ResponseData<HashMap<String, Object>> result = ResponseData.getInstance();
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("fm", this.commonService.getCommData("ps_fm_type"));//业务类型
		data.put("cl", this.commonService.getCommData("ps_cl_type"));//温度类型
		data.put("sk", this.commonService.getBaseData("storagetruck", "id", "type"));// 车型//
		result.setEntity(data);
		return result;
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
			    	sqlfilter.append(" s.sqm BETWEEN "+betsmdata[0]+" AND "+betsmdata[1] +" or");
			    }else{
			    	sqlfilter.append(" s.sqm  "+betsmdata[0]+" or");
			    }
			}
			return sqlfilter.substring(0, sqlfilter.length()-2)+")";
	   }
		return "";
	}
	//-------------------------------------------------2->数据展示 1：货品 2：配送  3：仓库具有公共属性,可重用方法，但为了后期维护和程序健壮性----采用3个公共方法,方便分库分表---------------------------------------------------
	/**
	 * 获得修改发布信息详细信息
	 * @param request
	
	 * @return
	 */
	@RequestMapping(value = "/getSEByIDForEdit")
	@ResponseBody
	public ResponseData<RdcShareDTO> getSEByIDForEdit(HttpServletRequest request,String id) {
		if(StringUtil.isnotNull(id)){
			RdcShareDTO data = this.rdcShareService.getSEByIDForEdit(id);
			return ResponseData.newSuccess(data);
		}
	    return ResponseData.newFailure("无效请求~");
	}
	
	
	/**
	 * 获得发布信息详细信息
	 * @param request
	
	 * @return
	 */
	@RequestMapping(value = "/getSEByID")
	@ResponseBody
	public ResponseData<RdcShareDTO> getSEByID(HttpServletRequest request,String id) {
		if(StringUtil.isnotNull(id)){
			RdcShareDTO data = this.rdcShareService.getSEByID(id);
			return ResponseData.newSuccess(data);
		}
	    return ResponseData.newFailure("无效请求~");
	}
	/**
	 * 根据用户id获得关联发布信息
	 * @param request
	 * @param type  出售求购
	 * @param datatype 数据类型  1：货品 2：配送  3：仓库
	 * @param goodtype 过滤条件
	 * @param keyword  关键字
	 * @param provinceid 地域
	 * @param orderBy 排序
	 * @return
	 */
	@RequestMapping(value = "/getSEListByUID")
	@ResponseBody
	public ResponseData<RdcShareDTO> getSEListByUID(HttpServletRequest request,Integer uid) {
		if(uid==null||uid==0){
		    UserEntity user =(UserEntity) request.getSession().getAttribute("user");//警告 ->调用该方法必须登录
			if(user!=null&&user.getId()!=0){
				uid=user.getId();
			}else{
				return ResponseData.newFailure("会话超时，请重新登录！~");
			}
		}
		this.getPageInfo(request);
		HashMap<String, Object> filter=new HashMap<String, Object>();
		filter.put("sstauts", 1);//必须
		filter.put("releaseID", uid);//必须
		PageInfo<RdcShareDTO> data = this.rdcShareService.getSEGDList(this.pageNum, this.pageSize, filter);
		return ResponseData.newSuccess(data);
	}
	
	
	/**
	 * 根据冷库id获得关联发布信息
	 * @param request
	 * @param type  出售求购
	 * @param datatype 数据类型  1：货品 2：配送  3：仓库
	 * @param goodtype 过滤条件
	 * @param keyword  关键字
	 * @param provinceid 地域
	 * @param orderBy 排序
	 * @return
	 */
	@RequestMapping(value = "/getSEListByRdcID")
	@ResponseBody
	public ResponseData<RdcShareDTO> getSEListByRdcID(HttpServletRequest request,String rdcID,String type,String datatype, String keyword,String orderBy) {
		this.getPageInfo(request);
		HashMap<String, Object> filter=new HashMap<String, Object>();
		filter.put("sstauts", 1);//必须
		filter.put("type", type);
		filter.put("rdcID", rdcID);
		filter.put("keyword", keyword);
		filter.put("datatype", datatype);
		filter.put("orderBy", orderBy);
		PageInfo<RdcShareDTO> data = this.rdcShareService.getSEListByRdcID(this.pageNum, this.pageSize, filter);
		return ResponseData.newSuccess(data);
	}
	
	
    /**
     * 获得货品信息
     * @param request
     * @param type  出售求购
     * @param datatype 数据类型  1：货品 2：配送  3：仓库
     * @param goodtype 过滤条件
     * @param keyword  关键字
     * @param provinceid 地域
     * @param orderBy 排序
     * @return
     */
	@RequestMapping(value = "/getSEGDList")
	@ResponseBody
	public ResponseData<RdcShareDTO> getSEGDList(HttpServletRequest request,String rdcID,String type,String datatype,String goodtype, String keyword,String provinceid,String orderBy) {
		this.getPageInfo(request);
		WebvistsService.addCount(4);
		HashMap<String, Object> filter=new HashMap<String, Object>();
		filter.put("type", type);
		filter.put("sstauts", 1);//必须
		filter.put("rdcID", rdcID);
		filter.put("datatype", datatype);//必须
		filter.put("goodtype", goodtype);
		filter.put("keyword", keyword);
		filter.put("provinceid", provinceid);
		filter.put("orderBy", orderBy);
		PageInfo<RdcShareDTO> data = this.rdcShareService.getSEGDList(this.pageNum, this.pageSize, filter);
		return ResponseData.newSuccess(data);
	}
	/**
	 * 获得配送信息
	 * @param request
	 * @param type 出租、求车？1:2
	 * @param datatype 数据类型  1：货品 2：配送  3：仓库->3
	 * @param keyword  关键字
	 * @param stprovinceID->stcityID:出发地
	 * @param toprovinceID->tocityID:目的地
	 * @param validStartTime->validEndTime:发货时间 
	 * @param carType 车型
	 * @param businessType 业务类型
	 * @param storagetempertype 温度类型
	 * @param provincefwID 配送范围 -》app专用
	 * @param orderBy 排序
	 * @return
	 */
	@RequestMapping(value = "/getSEPSList")
	@ResponseBody
	public ResponseData<RdcShareDTO> getSEPSList(HttpServletRequest request,String rdcID,String type,String datatype, String keyword,String stprovinceID,String stcityID,String toprovinceID,String tocityID,String validStartTime ,String validEndTime,String storagetempertype,String businessType,String carType,String provincefwID,String orderBy) {
		WebvistsService.addCount(5);
		this.getPageInfo(request);
		HashMap<String, Object> filter=new HashMap<String, Object>();
		filter.put("type", type);//OK
		filter.put("sstauts", 1);//必须
		filter.put("rdcID", rdcID);
		filter.put("datatype", datatype);//必须 OK
		filter.put("keyword", keyword);//OK
		filter.put("stprovinceID", stprovinceID);//
		filter.put("stcityID", stcityID);//
		filter.put("toprovinceID", toprovinceID);//
		filter.put("tocityID", tocityID);//
		filter.put("validStartTime", validStartTime);//
		filter.put("validEndTime", validEndTime);//
		filter.put("carType", carType);//车型->ok
		filter.put("businessType", businessType);//业务类型->OK
		filter.put("provincefwID", provincefwID);//
		filter.put("storagetempertype", storagetempertype);//storagetempertype->OK
		filter.put("orderBy", orderBy);//
		PageInfo<RdcShareDTO> data = this.rdcShareService.getSEPSList(this.pageNum, this.pageSize, filter);
		return ResponseData.newSuccess(data);
	}
	
	/**
	 * 获得睿库共享列表
	 * @param request
	 * @param type->  null：不限  1：出租/出售 2：求租/求购
	 * @param orderBy 排序
	 * @param datatype 数据类型  1：货品 2：配送  3：仓库
	 * @param sqm 面积-> rcd r
	 * @param provinceid 区域 -> rcd r
	 * @param keyword 支持关键字搜索-> rcd r
	 * @param managetype 经营类型  -> rdcext t
	 * @param storagetempertype 温度类型 -> rdcext t
	 * @return
	 */
	@RequestMapping(value = "/getSERDCList")
	@ResponseBody
	public ResponseData<RdcShareDTO> getSERDCList(HttpServletRequest request,String rdcID,String datatype,String goodtype, String keyword,String type,String provinceid, String managetype,String storagetempertype,String sqm,String orderBy) {
		WebvistsService.addCount(3);
		this.getPageInfo(request);
		HashMap<String, Object> filter=new HashMap<String, Object>();
		filter.put("type", type);
		filter.put("sstauts", 1);//必须：是否有效  --级别1->有效时间：级别2  
		filter.put("rdcID", rdcID);
		filter.put("datatype",datatype);//必须
		filter.put("goodtype", goodtype);
		filter.put("sqm", getSqmFilter(sqm));//  "<1000,1000~3000,3000~6000,6000~12000,12000~20000"
		filter.put("keyword", keyword);
		filter.put("provinceid", provinceid);
		filter.put("managetype", managetype);
		filter.put("storagetempertype", storagetempertype);
		filter.put("orderBy", orderBy);
		PageInfo<RdcShareDTO> data = this.rdcShareService.getSERDCList(this.pageNum, this.pageSize, filter);
		return ResponseData.newSuccess(data);
	}
	

	
	//------------------------------------------------------------------------------------免费发布消息-------------------------------------------------------
	/**
	 *获得用户关联的冷库信息
	 * @param request
	 * @param datatype
	 * @param dataid
	 * @return
	 */
	@RequestMapping(value="getRdcByUid")
	@ResponseBody
	public ResponseData<RdcShareDTO> getRdcByUid(HttpServletRequest request,Integer uid,Integer rdcId){
		this.getPageInfo(request);//
		if(uid==null||uid==0){
		    UserEntity user =(UserEntity) request.getSession().getAttribute( "user");if(user!=null&&user.getId()!=0){uid=user.getId();}else{return ResponseData.newFailure("回话超时，请重新登录！~");}
		}
		HashMap<String, Object> parameters=new HashMap<String, Object>();
		parameters.put("rdcId",rdcId);//
		parameters.put("userid",uid);// 
		parameters.put("audit",2);//
		PageInfo<RdcShareDTO> rdcList = this.rdcShareService.getRdcList(this.pageNum, this.pageSize, parameters);
		return ResponseData.newSuccess(rdcList);
	}
	/**
	 * 删除用户关联的信息
	 * @param request
	 * @param id
	 * @return
	 */
	@RequestMapping(value="delShareInfoByUid")
	@ResponseBody
	public ResponseData<String> delShareInfoByUid(HttpServletRequest request,Integer id,Integer uid){
//		UserEntity user =(UserEntity) SessionUtil.getSessionAttbuter(request, "user");//警告 ->调用该方法必须登录
		if(uid!=null&&uid!=0){
			this.rdcShareService.delShareInfoByid(id, uid);
			return ResponseData.newSuccess();
		}else{
			return ResponseData.newFailure("非法操作~");
		}
	    
	}
	
	@RequestMapping(value="shareFreeReleaseForIos")
	@ResponseBody
	public ResponseData<RdcShareDTO> shareFreeReleaseForIos(HttpServletRequest request, RdcShareDTO	rdcShareDTO,Integer uid){
		 String data = JSON.toJSONString(rdcShareDTO);
		 return shareFreeRelease(request, data, uid);
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
	            this.rdcShareService.addShareMsg(rdcShareDTO);//免费发布消息
			}else{
				rdcShareDTO.setUpdatetime(TimeUtil.getDateTime());
				this.rdcShareService.updateshareInfo(rdcShareDTO);//修改发布消息
			}
			this.docLibraryService.handleFile(rdcShareDTO.getId(), FileDataMapper.CATEGORY_SHARE_PIC, null, request);
		    return ResponseData.newSuccess("发布成功~");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure("发布失败~请稍后重试~");
	}
	//------------------------------------------------------------------------------------验证码-------------------------------------------------------
	/**
	 * 
	 * @return
	 */
	@RequestMapping(value="sharvistPhone")
	@ResponseBody
	public ResponseData<String> sharvistPhone(HttpServletRequest request,String key,String dataid,String telephone){
		try {
			if(StringUtil.isnotNull(telephone)){
				key= key+"";
				TelephoneVerifyUtil teleVerify = new TelephoneVerifyUtil();
				String signUpCode =teleVerify.identityVerify(telephone);
//				request.getSession().setAttribute(key+"shear_id", dataid);
				request.getSession().setAttribute(key+"shear_yzm", signUpCode);
//				request.getSession().setAttribute(key+"shear_telephone", telephone);
				ResponseData<String> instance = ResponseData.getInstance();
				instance.setSuccess(true);
				instance.setEntity(signUpCode);
				instance.setMessage("验证码已发送到您的手机~请注意查收~");
				return instance;
			}
			return  ResponseData.newFailure("请输入有效的手机号码~");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure("未知异常~");
	}
	
	
	/**
	 * 
	 * @return
	 */
	@RequestMapping(value="sharvistCode")
	@ResponseBody
	public boolean sharvistCode(HttpServletRequest request,String key,String dataid,String telephone,String yzm){
	  if(StringUtil.isnotNull(yzm)){
		  key= key+"";
		  String sysyzm=	(String) request.getSession().getAttribute(key+"shear_yzm");
		  return yzm.equalsIgnoreCase(sysyzm); 
	  }
	  return false;
	}
	/**
	 * 
	 * @return
	 */
	@RequestMapping(value="delvistCode")
	@ResponseBody
	public void delvistCode(HttpServletRequest request,String key){
		if(StringUtil.isnotNull(key)){
		  request.getSession().removeAttribute(key+"shear_yzm");
		}
	}
}
