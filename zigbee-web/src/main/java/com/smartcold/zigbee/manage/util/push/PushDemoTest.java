package com.smartcold.zigbee.manage.util.push;

import com.aliyuncs.http.MethodType;
import com.aliyuncs.http.ProtocolType;
import com.aliyuncs.push.model.v20150827.*;
import com.smartcold.zigbee.manage.entity.PushEntity;

import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * 推送的OpenAPI文档 https://help.aliyun.com/document_detail/30074.html
 */
public class PushDemoTest extends BaseTest {
    /**
     * 推送通知给android
     * <p>
     * 参见文档 https://help.aliyun.com/document_detail/30082.html
     */
    public void testPushNoticeToAndroid_toAll() throws Exception {
        PushNoticeToAndroidRequest androidRequest = new PushNoticeToAndroidRequest();
        //推送内容需要保护，请使用HTTPS协议
        androidRequest.setProtocol(ProtocolType.HTTPS);
        //推送内容较长，请使用POST请求
        androidRequest.setMethod(MethodType.POST);
        androidRequest.setAppKey(appKey);
        androidRequest.setTarget("all");
        androidRequest.setTargetValue("all");
        androidRequest.setTitle("Hello OpenAPI!");
        androidRequest.setSummary("你好, PushNoticeToAndroid from OpenAPI!");
        androidRequest.setAndroidExtParameters("{\"key1\":\"value1\",\"api_name\":\"PushNoticeToAndroidRequest\"}");

        PushNoticeToAndroidResponse pushNoticeToAndroidResponse = client.getAcsResponse(androidRequest);
        System.out.printf("RequestId: %s, ResponseId: %s\n",
                pushNoticeToAndroidResponse.getRequestId(), pushNoticeToAndroidResponse.getResponseId());
    }

    /**
     * 推送通知给android
     * <p>
     * 参见文档 https://help.aliyun.com/document_detail/30082.html
     */
    public void pushByAccountToAndroid(PushEntity pushEntity) throws Exception {

        PushNoticeToAndroidRequest androidRequest = new PushNoticeToAndroidRequest();
        //推送内容需要保护，请使用HTTPS协议
        androidRequest.setProtocol(ProtocolType.HTTPS);
        //推送内容较长，请使用POST请求
        androidRequest.setMethod(MethodType.POST);
        androidRequest.setAppKey(pushEntity.getAppKey());
        androidRequest.setTarget("account");
        androidRequest.setTargetValue(pushEntity.getUserIds());
        androidRequest.setTitle(pushEntity.getTitle());
        androidRequest.setSummary(pushEntity.getSummary());

        PushNoticeToAndroidResponse pushNoticeToAndroidResponse = client.getAcsResponse(androidRequest);
        System.out.printf("RequestId: %s, ResponseId: %s\n",
                pushNoticeToAndroidResponse.getRequestId(), pushNoticeToAndroidResponse.getResponseId());
    }

    /*
    * 账户推送消息至ios
    * */
    public void pushByAccountToIos(PushEntity pushEntity) throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM-dd HH:mm:ss");

        PushNoticeToiOSRequest iOSRequest = new PushNoticeToiOSRequest();
        //推送内容需要保护，请使用HTTPS协议
        iOSRequest.setProtocol(ProtocolType.HTTPS);
        //推送内容较长，请使用POST请求
        iOSRequest.setMethod(MethodType.POST);
        iOSRequest.setAppKey(pushEntity.getAppKey());
        // iOS的通知是通过APNS中心来发送的，需要填写对应的环境信息. DEV:表示开发环境, PRODUCT: 表示生产环境
        iOSRequest.setEnv("PRODUCT");
        iOSRequest.setTarget("account");
        iOSRequest.setTargetValue(pushEntity.getUserIds());
        iOSRequest.setSummary(pushEntity.getSummary());
        iOSRequest.setiOSExtParameters("{\"rdcId\":\""+pushEntity.getRdcId()+"\",\"type\":\""+pushEntity.getType()+"\",\"rdcName\":\"" + pushEntity.getRdcName() + "\"}");
        iOSRequest.setExt("{\"sound\":\"default\", \"badge\":\"0\"}");

        PushNoticeToiOSResponse pushNoticeToiOSResponse = client.getAcsResponse(iOSRequest);
        System.out.printf("RequestId: %s, ResponseId: %s\n",
                pushNoticeToiOSResponse.getRequestId(), pushNoticeToiOSResponse.getResponseId());
    }


    /**
     * 推送通知给android
     * <p>
     * 参见文档 https://help.aliyun.com/document_detail/30082.html
     */
    public void testPushNoticeToAndroid_toAccount() throws Exception {
        PushNoticeToAndroidRequest androidRequest = new PushNoticeToAndroidRequest();
        //推送内容需要保护，请使用HTTPS协议
        androidRequest.setProtocol(ProtocolType.HTTPS);
        //推送内容较长，请使用POST请求
        androidRequest.setMethod(MethodType.POST);
        androidRequest.setAppKey(appKey);
        androidRequest.setTarget("account");
        androidRequest.setTargetValue(accounts);
        androidRequest.setTitle("Hello OpenAPI!");
        androidRequest.setSummary("你好, PushNoticeToAndroid from OpenAPI!");

        PushNoticeToAndroidResponse pushNoticeToAndroidResponse = client.getAcsResponse(androidRequest);
        System.out.printf("RequestId: %s, ResponseId: %s\n",
                pushNoticeToAndroidResponse.getRequestId(), pushNoticeToAndroidResponse.getResponseId());
    }

    /**
     * 推送消息给android
     * <p>
     * 参见文档 https://help.aliyun.com/document_detail/30081.html
     */
    public void testPushMessageToAndroid_toAll() throws Exception {
        PushMessageToAndroidRequest androidRequest = new PushMessageToAndroidRequest();
        //推送内容需要保护，请使用HTTPS协议
        androidRequest.setProtocol(ProtocolType.HTTPS);
        //推送内容较长，请使用POST请求
        androidRequest.setMethod(MethodType.POST);
        androidRequest.setAppKey(appKey);
        androidRequest.setTarget("all");
        androidRequest.setTargetValue("all");
        androidRequest.setMessage("PushMessageToAndroid from OpenAPI!");

        PushMessageToAndroidResponse pushMessageToAndroidResponse = client.getAcsResponse(androidRequest);
        System.out.printf("RequestId: %s, ResponseId: %s\n",
                pushMessageToAndroidResponse.getRequestId(), pushMessageToAndroidResponse.getResponseId());
    }

    /**
     * 推送通知给iOS
     * <p>
     * 参见文档 https://help.aliyun.com/document_detail/30084.html
     */
    public void testPushNoticeToIOS_toAll(String target,String targetValue,String summary) throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM-dd HH:mm:ss");

        PushNoticeToiOSRequest iOSRequest = new PushNoticeToiOSRequest();
        //推送内容需要保护，请使用HTTPS协议
        iOSRequest.setProtocol(ProtocolType.HTTPS);
        //推送内容较长，请使用POST请求
        iOSRequest.setMethod(MethodType.POST);
        iOSRequest.setAppKey(appKey);
        // iOS的通知是通过APNS中心来发送的，需要填写对应的环境信息. DEV:表示开发环境, PRODUCT: 表示生产环境
        iOSRequest.setEnv("DEV");
        iOSRequest.setTarget(target);
        iOSRequest.setTargetValue(targetValue);
        iOSRequest.setSummary(summary);
        iOSRequest.setiOSExtParameters("{\"k1\":\"v1\",\"k2\":\"v2\"}");
        iOSRequest.setExt("{\"sound\":\"default\", \"badge\":\"42\"}");

        PushNoticeToiOSResponse pushNoticeToiOSResponse = client.getAcsResponse(iOSRequest);
        System.out.printf("RequestId: %s, ResponseId: %s\n",
                pushNoticeToiOSResponse.getRequestId(), pushNoticeToiOSResponse.getResponseId());
    }

    /**
     * 推送消息给iOS
     * <p>
     * 参见文档 https://help.aliyun.com/document_detail/30083.html
     */
    public void testPushMessageToIOS_toAll() throws Exception {
        PushMessageToiOSRequest iOSRequest = new PushMessageToiOSRequest();
        //推送内容需要保护，请使用HTTPS协议
        iOSRequest.setProtocol(ProtocolType.HTTPS);
        //推送内容较长，请使用POST请求
        iOSRequest.setMethod(MethodType.POST);
        iOSRequest.setAppKey(appKey);
        iOSRequest.setTarget("all");
        iOSRequest.setTargetValue("all");
        iOSRequest.setMessage("message");
        iOSRequest.setSummary("summary");

        PushMessageToiOSResponse pushMessageToiOSResponse = client.getAcsResponse(iOSRequest);
        System.out.printf("RequestId: %s, ResponseId: %s\n",
                pushMessageToiOSResponse.getRequestId(), pushMessageToiOSResponse.getResponseId());
    }
}
