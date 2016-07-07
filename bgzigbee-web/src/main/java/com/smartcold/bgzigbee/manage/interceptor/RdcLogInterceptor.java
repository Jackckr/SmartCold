package com.smartcold.bgzigbee.manage.interceptor;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.smartcold.bgzigbee.manage.dao.OperationLogMapper;
import com.smartcold.bgzigbee.manage.entity.AdminEntity;
import com.smartcold.bgzigbee.manage.entity.OperationLog;

public class RdcLogInterceptor implements HandlerInterceptor{

	@Autowired
	private OperationLogMapper operationLogDao;
	
	private AdminEntity adminEntity;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		// TODO Auto-generated method stub
		adminEntity = (AdminEntity) request.getSession().getAttribute("admin");
		return adminEntity != null;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		HandlerMethod handlerMethod = (HandlerMethod)handler;
		String methodName = handlerMethod.getMethod().getName();
		OperationLog operationLog = null;
		if (methodName.equals("add")) {
			operationLog = new OperationLog("添加冷库", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("冷库名：%s", request.getParameter("name")));
		}else if (methodName.equals("update")) {
			operationLog = new OperationLog("修改冷库", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("冷库名：%s", request.getParameter("name")));
		}
		if (operationLog != null) {
			operationLogDao.insert(operationLog);
		}
		System.out.println(request.getRequestURI());
		System.out.println(methodName);
		
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		
	}
	
	
}
