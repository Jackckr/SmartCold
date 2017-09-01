package com.smartcold.zigbee.manage.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

/**
 * Created by qiangzi on 2017/8/30.
 */
public class CookieUnit {
    public static String getCookie(HttpServletRequest request){
        String token="";
        Cookie[] cookies = request.getCookies();
        if(cookies!=null&&cookies.length>0){
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {token=	cookie.getValue();break;}
            }
        }
        return token;
    }
}
