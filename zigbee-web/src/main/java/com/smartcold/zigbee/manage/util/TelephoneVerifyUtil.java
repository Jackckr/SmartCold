package com.smartcold.zigbee.manage.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.taobao.api.ApiException;
import com.taobao.api.DefaultTaobaoClient;
import com.taobao.api.TaobaoClient;
import com.taobao.api.request.AlibabaAliqinFcSmsNumSendRequest;
import com.taobao.api.response.AlibabaAliqinFcSmsNumSendResponse;

public class TelephoneVerifyUtil {
	// 链库
		public final static String url = "http://gw.api.taobao.com/router/rest";
		public final static String appkey = "23406243";
		public final static String secret = "13872806b7fe94689eda5ffaf2d2bd9e";
		TaobaoClient client = null;

		public TelephoneVerifyUtil() {
			super();
			client = new DefaultTaobaoClient(url, appkey, secret);
		}

		/*
		 * TaobaoClient client = new
		 * DefaultTaobaoClient("http://gw.api.tbsandbox.com/router/rest",
		 * "23403710", "bc0977e92f79fa23c1d5f1cc28ef8953");
		 */
		
		/**
		 * 告警通知
		 * @param rdc
		 * @param rdctype
		 * @param dev
		 * @throws ApiException 
		 */
		public List<String> warninginform(String rdc,String rdctype,String dev,String telephone) throws ApiException {
			List<String> msglist=new ArrayList<String>();
			if (StringUtil.isnotNull(telephone)) {
				AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
				req.setExtend("123456");
				req.setSmsType("normal");
				req.setSmsFreeSignName("链库网");
				req.setSmsParamString("{ \"rdc\":" + "\"" + rdc + "\"" + ",\"rdctype\":" + "\"" + rdctype+ "\"" + ",\"dev\":" + "\"" + dev+ "\"}");
			 	req.setSmsTemplateCode("SMS_16370250");//Warning: ${rdc}-${rdctype}-${dev}已经超过30分钟未上报数据，请注意检查。
			    String[] telephoness = StringUtil.splitString(telephone);
			    for (String sutelephone : telephoness) {
				if(StringUtil.isnotNull(sutelephone)){
					req.setRecNum(sutelephone);
					AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
					msglist.add(rsp.getMsg());
				}
			  }
			}
			return msglist;
		}
		
		/**
		 * 身份验证
		 * @param telephone
		 * @return
		 * @throws ApiException
		 */
		public String identityVerify(String telephone) throws ApiException {
//			AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
//			req.setExtend("123456");
//			req.setSmsType("normal");
//			req.setSmsFreeSignName("链库网");
			String code = generateCode();
			 System.out.println("{\"code\":"+code+"}");
			// System.out.println("{\"code\":" + "\"" + code + "\"" +",\"product\":\"lianku\"}");
//			req.setSmsParamString("{\"code\":" + "\"" + code + "\"" +",\"product\":\"lianku\"}");
//			req.setRecNum(telephone);
//			req.setSmsTemplateCode("SMS_12145753"); //【链库网】验证码3GZ9，您正在进行链库身份验证，打死不要告诉别人哦！
//			AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
//			System.out.println(rsp.getBody());
			return code;
		}
		
		/**
		 * 注册验证
		 * @param telephone
		 * @return
		 * @throws ApiException
		 */
		public String signUpVerify(String telephone) throws ApiException {
			AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
			req.setExtend("123456");
			req.setSmsType("normal");
			req.setSmsFreeSignName("链库网");
			String code = generateCode();
			// System.out.println("{\"code\":\"123\"}");
			// System.out.println("{\"code\":" + "\"" + code + "\"" +",\"product\":\"lianku\"}");
			req.setSmsParamString("{\"code\":" + "\"" + code + "\"" +",\"product\":\"lianku\"}");
			req.setRecNum(telephone);
			req.setSmsTemplateCode("SMS_12145749");//【链库网】验证码Q6C4，您正在注册成为lianku用户，感谢您的支持！
			AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
			System.out.println(rsp.getBody());
			return code;
		}
		
		/**
		 * 向下单者发送订单通知
		 * @param userTele
		 * @param username
		 * @param ownerTele
		 * @param ownername
		 * @throws ApiException
		 */
		public void callUser(String userTele,String username,String ownerTele,String ownername) throws ApiException {
			AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
			req.setExtend("123456");
			req.setSmsType("normal");
			req.setSmsFreeSignName("链库网");
			req.setSmsParamString("{\"name\":" + "\"" + ownername + "\"" +",\"telephone\":" + "\"" + ownerTele+ "\"}");
			req.setRecNum(userTele);
			req.setSmsTemplateCode("SMS_12461024");//买家模板内容：您已经抢到来自${name}的订单，手机号为${telephone}，请及时联系。
			AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
			System.out.println(rsp.getBody());
		}
		
		/**
		 * 向冷库所有者发送订单通知
		 * @param userTele
		 * @param username
		 * @param ownerTele
		 * @param ownername
		 * @throws ApiException
		 */
		public void callOwner(String userTele,String username,String ownerTele,String ownername) throws ApiException {
			AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
			req.setExtend("123456");
			req.setSmsType("normal");
			req.setSmsFreeSignName("链库网");
			req.setSmsParamString("{\"name\":" + "\"" + username + "\"" +",\"telephone\":" + "\"" + userTele+ "\"}");
			req.setRecNum(ownerTele);
			req.setSmsTemplateCode("SMS_12496126");//卖家：　您的订单已经被${name}抢到，手机号为${telephone}，请及时联系。
			AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
			System.out.println(rsp.getBody());
		}
		
		/**
		 * 产生验证码
		 * @return
		 */
		public String generateCode() {
			String[] beforeShuffle = new String[] { "0", "1", "2", "3", "4", "5", "6", "7","8", "9" };
			List<String> list = Arrays.asList(beforeShuffle);
			Collections.shuffle(list);
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < list.size(); i++) {
				sb.append(list.get(i));
			}
			String afterShuffle = sb.toString();
			String code = afterShuffle.substring(5, 9);
			return code;
		}

}
