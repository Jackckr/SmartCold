package com.smartcold.manage.cold.filter;

import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by corly on 16-8-9.
 */
public class CrossInterceptor extends OncePerRequestFilter {

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        response.setHeader("P3P", "CP=CAO PSA OUR");//解决IE下SessionID丢失的问题
        response.setHeader("Access-Control-Max-Age", "1800");
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));//*request.getHeader("Origin")
        response.setHeader("Access-Control-Allow-Credentials","true"); //是否支持cookie跨域
        response.setHeader("Access-Control-Allow-Methods", "POST, GET,PUT, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with,Content-Transfer-Encoding");//,Content-Type,Content-Transfer-Encoding
        filterChain.doFilter(request, response);
    }

}
