package com.smartcold.zigbee.manage.util.push;

import com.aliyuncs.push.model.v20150827.GetDeviceInfosRequest;
import com.aliyuncs.push.model.v20150827.GetDeviceInfosResponse;


public class DeviceInfoDemoTest extends BaseTest {
    public void testGetDeviceInfos() throws Exception {
        GetDeviceInfosRequest getDeviceInfosRequest = new GetDeviceInfosRequest();
        getDeviceInfosRequest.setAppKey(appKey);
        getDeviceInfosRequest.setDevices("_YOUR_DEVICE_IDS_HERE");

        GetDeviceInfosResponse getDeviceInfosResponse = client.getAcsResponse(getDeviceInfosRequest);
        for (GetDeviceInfosResponse.DeviceInfo deviceInfo : getDeviceInfosResponse.getDeviceInfos()) {
            System.out.printf("deviceId: %s, isOnline: %s\n", deviceInfo.getDeviceId(), deviceInfo.getIsOnline());
        }
    }
}
