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

public class userLogInterceptor implements HandlerInterceptor{

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
		if (methodName.equals("addUser")) {
			operationLog = new OperationLog("添加用户", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("用户账号：%s", request.getParameter("username")));
		}else if (methodName.equals("deleteUser")) {
			operationLog = new OperationLog("删除用户", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("用户id：%s", request.getParameter("userID")));
		}
		else if (methodName.equals("deleteByUserIDs")) {
			operationLog = new OperationLog("批量删除用户", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("用户ids：%s", request.getParameter("userIDs")));
		}
		else if (methodName.equals("changeAudit")) {
			operationLog = new OperationLog("审核用户", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("用户id：%s", request.getParameter("userID")));
		}
		else if (methodName.equals("changeAudits")) {
			operationLog = new OperationLog("批量审核用户", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("用户ids：%s", request.getParameter("userIDs").toString()));
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
