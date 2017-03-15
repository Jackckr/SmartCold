package com.smartcold.manage.cold.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.smartcold.manage.cold.entity.olddb.UserEntity;


/**
 * 拦截HTML
 * @author Administrator
 *
 */
public class LoginUserSessionFilter implements Filter {

	

	public void init(FilterConfig filterConfig) throws ServletException {
		
	}




	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)throws IOException, ServletException {
		HttpServletRequest httpServletRequest = (HttpServletRequest) request;
		UserEntity user =   (UserEntity) httpServletRequest.getSession().getAttribute("user");
		if (user != null) {
			chain.doFilter(request, response);
		} else {
			
		    String servletPath = httpServletRequest.getServletPath();
			boolean iseq = "/login.html".equals(servletPath) ;
			if (iseq) {
				chain.doFilter(request, response);
			} else {
				request.getRequestDispatcher("/login.html").forward(request,response);
			}
		}
	}

}
