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
	            // CORS "pre-flight" request
	            response.addHeader("Access-Control-Allow-Origin", "http://localhost:8081");
	            response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	            response.addHeader("Access-Control-Allow-Headers", "Content-Type,Content-Transfer-Encoding");
	            response.addHeader("Access-Control-Allow-Credentials", "true"); 
	            response.addHeader("Access-Control-Max-Age", "1800");//30 min
//	        }
	        filterChain.doFilter(request, response);
	    }
}
