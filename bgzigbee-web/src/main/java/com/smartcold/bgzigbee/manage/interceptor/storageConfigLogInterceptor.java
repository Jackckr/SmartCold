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

public class storageConfigLogInterceptor implements HandlerInterceptor{

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
		String auditname = null;
		if(request.getParameter("audit").equals("0")){
			auditname = "经营类型";
		}
		else if(request.getParameter("audit").equals("1")){
			auditname = "商品存放类型";
		}
		else if(request.getParameter("audit").equals("-1")){
			auditname = "温度类型";
		}
		else{
			auditname = "";
		}
		if (methodName.equals("deleteConfig")) {
			operationLog = new OperationLog("删除冷库配置信息", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("删除%s，id:%s", auditname, request.getParameter("configID")));
		}else if (methodName.equals("addConfig")) {
			operationLog = new OperationLog("添加冷库配置信息", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("添加%s，类型为:%s",auditname, request.getParameter("config")));
		}
		if (operationLog != null) {
			operationLogDao.insert(operationLog);
		}
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		
	}
	
	
}
