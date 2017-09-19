package com.smartcold.manage.cold.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * url:解析
 * @author Administrator
 *
 */
public class UrlFilter {
	
	      public void init(FilterConfig filterConfig) throws ServletException {
	        
	  
	      }
	  
	      public void doFilter(ServletRequest request, ServletResponse response,  FilterChain chain) throws IOException, ServletException {
	          // 获得在下面代码中要用的request,response,session对象
	          HttpServletRequest servletRequest = (HttpServletRequest) request;
	          HttpServletResponse servletResponse = (HttpServletResponse) response;
	          HttpSession session = servletRequest.getSession();
	          String path = servletRequest.getRequestURI();
	          System.err.println("请求路径"+path);
	          
	          
//	          String empId = (String) session.getAttribute("empId");
	          /*创建类Constants.java，里面写的是无需过滤的页面
	          for (int i = 0; i < Constants.NoFilter_Pages.length; i++) {
	              if (path.indexOf(Constants.NoFilter_Pages[i]) > -1) {
	                  chain.doFilter(servletRequest, servletResponse);
	                  return;
	              }
	          }*/
	          
	          // 登陆页面无需过滤
//	          if(path.indexOf("/login.jsp") > -1) {
//	              chain.doFilter(servletRequest, servletResponse);
//	              return;
//	          }
//	  
	          // 判断如果没有取到员工信息,就跳转到登陆页面
//	          if (empId == null || "".equals(empId)) {
//	              // 跳转到登陆页面
//	              servletResponse.sendRedirect("/JingXing_OA/login.jsp");
//	          } else {
//	              // 已经登陆,继续此次请求
	              chain.doFilter(request, response);
//	          }
	  
	      }
	  
	      public void destroy() {
	          // TODO Auto-generated method stub
	  
	      }
}
