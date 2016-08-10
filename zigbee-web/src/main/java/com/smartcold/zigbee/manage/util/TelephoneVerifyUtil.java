package com.smartcold.zigbee.manage.util;

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
		public String url = "http://gw.api.taobao.com/router/rest";
		public String appkey = "23406243";
		public String secret = "13872806b7fe94689eda5ffaf2d2bd9e";
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
		public String verifyMessage(String telephone) throws ApiException {
			AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
			req.setExtend("123456");
			req.setSmsType("normal");
			req.setSmsFreeSignName("链库网");
			String code = generateCode();
			// System.out.println("{\"code\":\"123\"}");
			 System.out.println("{\"code\":" + "\"" + code + "\"" +",\"product\":\"lianku\"}");
			req.setSmsParamString("{\"code\":" + "\"" + code + "\"" +",\"product\":\"lianku\"}");
			req.setRecNum(telephone);
			//req.setSmsTemplateCode("SMS_12145753"); //【链库网】验证码3GZ9，您正在进行链库身份验证，打死不要告诉别人哦！
			req.setSmsTemplateCode("SMS_12145749");//【链库网】验证码Q6C4，您正在注册成为lianku用户，感谢您的支持！
			AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
			System.out.println(rsp.getBody());
			return code;
		}
		
		public String identityVerify(String telephone) throws ApiException {
			AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
			req.setExtend("123456");
			req.setSmsType("normal");
			req.setSmsFreeSignName("链库网");
			String code = generateCode();
			// System.out.println("{\"code\":\"123\"}");
			// System.out.println("{\"code\":" + "\"" + code + "\"" +",\"product\":\"lianku\"}");
			req.setSmsParamString("{\"code\":" + "\"" + code + "\"" +",\"product\":\"lianku\"}");
			req.setRecNum(telephone);
			req.setSmsTemplateCode("SMS_12145753"); //【链库网】验证码3GZ9，您正在进行链库身份验证，打死不要告诉别人哦！
			AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
			System.out.println(rsp.getBody());
			return code;
		}
		
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
		
		
		public String generateCode() {
			String[] beforeShuffle = new String[] { "2", "3", "4", "5", "6", "7",
					"8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
					"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
					"W", "X", "Y", "Z" };
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
