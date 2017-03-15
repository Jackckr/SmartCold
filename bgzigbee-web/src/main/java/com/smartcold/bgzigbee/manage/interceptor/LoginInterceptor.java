package com.smartcold.bgzigbee.manage.interceptor;

import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import javax.servlet.http.HttpSession;  
  

import org.springframework.web.servlet.HandlerInterceptor;  
import org.springframework.web.servlet.ModelAndView;  

import com.smartcold.bgzigbee.manage.entity.AdminEntity;

/** 
 * 登录认证的拦截器
 * 拦截所有方法 
 */  
public class LoginInterceptor implements HandlerInterceptor{  
  
    /** 
     * Handler执行完成之后调用这个方法 
     */  
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exc) throws Exception {  
          
    }  
  
    /** 
     * Handler执行之后，ModelAndView返回之前调用这个方法 
     */  
    public void postHandle(HttpServletRequest request, HttpServletResponse response,Object handler, ModelAndView modelAndView) throws Exception {  
    }  
  
    /** 
     * Handler执行之前调用这个方法 
     */  
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,Object handler) throws Exception {  
        String url = request.getRequestURI();  
        if(url.indexOf("/i/admin/login")>=0||url.indexOf("i/admin/findAdmin")>=0){  
            return true;  
        }  
        HttpSession session = request.getSession();  
    	AdminEntity user =(AdminEntity)session.getAttribute("admin");
        if(user != null){  
            return true;  
        }  
//        request.getRequestDispatcher("/login.html").forward(request,response);
        return false;  
    }  
  
}  

