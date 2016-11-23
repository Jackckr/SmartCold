package com.smartcold.zigbee.manage.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

import com.smartcold.zigbee.manage.service.impl.WebvistsService;
/**
 * 支持springmvc跨域
 * @author maqiang34 2016年11月17日17:54:46
 *
 */
public class ApkFilter extends OncePerRequestFilter {
         protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
            	response.sendRedirect("http://a.app.qq.com/o/simple.jsp?pkgname=com.example.yananxu.smartcold"); 
	    }
}
