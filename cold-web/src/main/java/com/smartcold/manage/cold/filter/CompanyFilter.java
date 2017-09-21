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
        String url = request.getRequestURL().toString();
        int yili = url.indexOf("yl");
        int songxia = url.indexOf("sx");
        if (songxia>=0){
            System.out.println(url);
            response.sendRedirect("http://www.smartcold.org.cn/sx.html");
        }else {
            filterChain.doFilter(servletRequest,servletResponse);
        }
    }

    @Override
    public void destroy() {

    }
}
