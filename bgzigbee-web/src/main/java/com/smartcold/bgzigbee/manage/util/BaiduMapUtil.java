package com.smartcold.bgzigbee.manage.util;

import com.google.common.collect.Maps;
import org.springframework.util.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-07-16 17:32)
 */
public class BaiduMapUtil {

    /**
     * 输入地址返回经纬度坐标
     * key lng(经度),lat(纬度)
     */
    public Map<String, String> getGeocoderLatitude(String address) {
        BufferedReader in = null;
        Map<String, String> map = Maps.newHashMap();
        try {
            address = URLEncoder.encode(address, "UTF-8");
            URL tirc = new URL("http://api.map.baidu.com/geocoder?address=" + address + "&output=json&key=" + "7d9fbeb43e975cd1e9477a7e5d5e192a");
            in = new BufferedReader(new InputStreamReader(tirc.openStream(), "UTF-8"));
            String res;
            StringBuilder sb = new StringBuilder("");
            while ((res = in.readLine()) != null) {
                sb.append(res.trim());
            }
            String str = sb.toString();
            if (!StringUtils.isEmpty(str)) {
                int lngStart = str.indexOf("lng\":");
                int lngEnd = str.indexOf(",\"lat");
                int latEnd = str.indexOf("},\"precise");
                if (lngStart > 0 && lngEnd > 0 && latEnd > 0) {
                    String lng = str.substring(lngStart + 5, lngEnd);
                    String lat = str.substring(lngEnd + 7, latEnd);
                    map.put("lng", lng);
                    map.put("lat", lat);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return map;
    }
}