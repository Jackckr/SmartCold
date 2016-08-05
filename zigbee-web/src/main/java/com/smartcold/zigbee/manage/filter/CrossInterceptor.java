package com.smartcold.zigbee.manage.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;
/**
 * 支持springmvc跨域
 * @author Administrator
 *
 */
public class CrossInterceptor extends OncePerRequestFilter {
	
	    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//	        if (request.getHeader("Access-Control-Request-Method") != null && "OPTIONS".equals(request.getMethod())) {
	            System.err.println(request.getSession().getId());
                response.setHeader("P3P", "CP=CAO PSA OUR");//解决IE下SessionID丢失的问题
                response.setHeader("Access-Control-Max-Age", "1800");
	            response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));//*request.getHeader("Origin")
	            response.setHeader("Access-Control-Allow-Credentials","true"); //是否支持cookie跨域
	            response.setHeader("Access-Control-Allow-Methods", "POST, GET,PUT, OPTIONS, DELETE");
	            response.setHeader("Access-Control-Allow-Headers", "x-requested-with");//,Content-Type,Content-Transfer-Encoding
//	        }
	        filterChain.doFilter(request, response);
	    }
}
