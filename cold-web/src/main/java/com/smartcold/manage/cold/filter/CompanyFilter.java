package com.smartcold.manage.cold.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by qiangzi on 2017/9/20.
 */
public class CompanyFilter implements Filter{
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request= (HttpServletRequest) servletRequest;
        HttpServletResponse response= (HttpServletResponse) servletResponse;
        String uri = request.getRequestURI();  
//        System.err.println(uri);
        if("/".equals(uri)){
        	String url=  request.getRequestURL().toString();
//        	   System.err.println(uri);
            switch (url) {
    		case "http://www.rsdl-panasonic.cn/":
    		case "http://sx.cold360.cn/":
    			response.sendRedirect("sx.html");
    			break;
    		default:
    			 filterChain.doFilter(servletRequest,servletResponse);
    			break;
    		}
        }else{
        	 filterChain.doFilter(servletRequest,servletResponse);
        }
    }

    @Override
    public void destroy() {

    }
}
