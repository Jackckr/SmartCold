package com.smartcold.zigbee.manage.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.MessageMapper;
import com.smartcold.zigbee.manage.entity.MessageEntity;
import com.smartcold.zigbee.manage.util.CometUtil;
import com.smartcold.zigbee.manage.util.ResponseData;
import com.smartcold.zigbee.manage.util.StringUtil;
import com.smartcold.zigbee.manage.util.TelephoneVerifyUtil;
import com.taobao.api.ApiException;
/**
 * 360报警短信通知及消息推送服务
 * @author kaiqiang jiang
 * @version 创建时间：2016-9-27 上午10:33:18
 *
 */
@Controller
@RequestMapping(value = "/warning")
public class WarningController {
	@Autowired
	private MessageMapper messageDao;
	@Autowired
	private PushController pushController;
	/**
	 * 短信报警通知
	 * @param rdc：报警的冷库
	 * @param rdctype：报警的二级冷库
	 * @param dev：报警的设备
	 * @param telephone：短信接受的手机号（多个），一般是冷库所有者
	 * @return
	 */
	@RequestMapping(value = "/warningTele")
	@ResponseBody
	public Object warningTele(
			@RequestParam(value="rdc",required=false) String rdc,
			@RequestParam(value="rdctype") String rdctype, 
			@RequestParam(value="dev", required=false) String dev,
			@RequestParam(value="telephone", required=false) String telephone) {
		TelephoneVerifyUtil telephoneVerify = new TelephoneVerifyUtil();
		try {
			return ResponseData.newSuccess(telephoneVerify.warninginform(rdc, rdctype, dev, telephone));
		} catch (ApiException e) {
			e.printStackTrace();
		}
		//System.out.println(telephone+":"+rdc+"-"+rdctype+"-"+dev+"已经超过30分钟未上报数据，请注意检查。");
		return ResponseData.newFailure();
	}
	/**
	 * 
	 * @param rdc：报警的冷库
	 * @param rdctype：报警的二级冷库
	 * @param dev：报警的设备
	 * @param msgurl:通知发出地址，即当用户点击这条通知时，需要跳出的界面链接
	 * @param userid:需要通知的用户(多个)，一般是冷库所有者
	 * @return
	 */
	@RequestMapping(value = "warningMsg")
	@ResponseBody
	public Object warningMsg(
			@RequestParam(value="rdc",required=false) String rdc,
			@RequestParam(value="rdctype") String rdctype, 
			@RequestParam(value="dev", required=false) String dev,
			@RequestParam(value="msgurl", required=false) String msgurl,
			@RequestParam(value="userid", required=false) String userid) {
		String[] userids = userid.split(",");
		MessageEntity msg = new MessageEntity();
		msg.setMsgcategory(2);
		msg.setMsgdata(rdc+"-"+rdctype+"-"+dev+"已经超过30分钟未上报数据，请注意检查。");//
		msg.setMsgurl(msgurl);
		for (int i = 0; i < userids.length; i++) {
			msg.setUserid(Integer.parseInt(userids[i]));
			CometUtil cometUtil = new CometUtil();
			cometUtil.pushTo(msg);
			messageDao.insertMessage(msg);
		}
		return ResponseData.newSuccess();
	}

	@RequestMapping(value = "/waringNotice")
	@ResponseBody
	public void waringNotice(String userIds, String rdcid,String rdcName,String coldStorageName,String basTemp,String diffTemp,String ovtTempTime,String overTemp,String starttime,String token) throws Exception {
//		new TelephoneVerifyUtil().waringNotice(rdc,coldStorageName,level,basTemp,diffTemp,ovtTempTime,telephone);//短信告警
		//if(StringUtil.checkToken(token)){
			String summary="冷库"+rdcName+"-"+coldStorageName+"在"+starttime+"发生超温告警,超基准温度（"+basTemp+"）:+"+overTemp+" ℃, 超温时长："+ovtTempTime+"分钟";
			pushController.push360Alarm("冷库超温告警",summary,token,userIds,"1",rdcid,rdcName);
			String[] useIdArr = userIds.split(",");
			for (String id:useIdArr){
				pushController.pushWXAlarm(id,starttime,"冷库"+rdcName+"-"+coldStorageName,"超温告警","超基准温度（"+basTemp+"）:+"+overTemp+" ℃, 超温时长："+ovtTempTime+"分钟");
			}
		//}
	}
}
