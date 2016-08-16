package com.smartcold.bgzigbee.manage.interceptor;

import com.smartcold.bgzigbee.manage.dao.OperationLogMapper;
import com.smartcold.bgzigbee.manage.entity.AdminEntity;
import com.smartcold.bgzigbee.manage.entity.OperationLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Date;

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
					request.getRequestURL().toString(),
					String.format("添加的冷库名称：%s", URLDecoder.decode(request.getParameter("name"), "UTF-8")));
		}else if (methodName.equals("update")) {
			operationLog = new OperationLog("修改冷库", adminEntity.getId(),
					new Date(), request.getRequestURL().toString(),
					String.format("冷库id：%s", request.getParameter("rdcId")));
		}else if (methodName.equals("deleteByRdcID")) {
			operationLog = new OperationLog("删除冷库", adminEntity.getId(), request.getRequestURL().toString(),
					String.format("删除的冷库id：%s", request.getParameter("rdcID")));
		}else if (methodName.equals("deleteByRdcIDs")) {
			String[] rdcIDs = request.getParameterValues("rdcIDs");
			operationLog = new OperationLog("批量删除冷库", adminEntity.getId(), request.getRequestURL().toString(),
					String.format("删除的冷库id：%s", Arrays.toString(rdcIDs)));
		} else if (methodName.equals("deleteCommentByID")) {
			operationLog = new OperationLog("删除评论", adminEntity.getId(), request.getRequestURL().toString(),
					String.format("删除的评论id：%s", request.getParameter("id")));
		}else if (methodName.equals("deleteByIds")) {
			String[] ids = request.getParameterValues("ids");
			operationLog = new OperationLog("批量删除评论", adminEntity.getId(), request.getRequestURL().toString(),
					String.format("删除的评论id：%s", Arrays.toString(ids)));
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
