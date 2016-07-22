package com.smartcold.zigbee.manage.controller;

import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.OrdersMapper;
import com.smartcold.zigbee.manage.dao.UserMapper;

import com.smartcold.zigbee.manage.dto.RdcShareDTO;

import com.smartcold.zigbee.manage.entity.OrdersEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;

import com.smartcold.zigbee.manage.util.ResponseData;

@Controller
@RequestMapping(value = "/orders")
public class OrdersController extends BaseController {
	@Autowired
	private OrdersMapper orderDao;
	@Autowired
	private UserMapper userDao;
	/**
	 * 
	 * @param request
	 * @param user
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "/generateOrder")
	@ResponseBody
	public ResponseData<String> sharvistPhone(HttpServletRequest request,
			int userid,
			String username,
			String telephone,
			int rsdid, 
			int dataType, 
			String typeText,
			int releaseID,
			String title
			) {
		OrdersEntity order = new OrdersEntity();
		Calendar calendar = Calendar.getInstance();
		order.setOrderid(""+calendar.getTime().getTime());
		String ordername = "";
		if (dataType==1) {
			ordername = ordername + "[货品]";
		}
		else if (dataType==2) {
			ordername = ordername + "[配送]";
		}
		else if (dataType==3) {
			ordername = ordername + "[仓库]";
		}
		ordername = ordername+title;
	    ordername = ordername+typeText;
		order.setOrdername(ordername);
		order.setOwnerid(releaseID);
		UserEntity owner = userDao.findUserById(releaseID);
		order.setOwnername(owner.getUsername());
		order.setOwnertele(owner.getTelephone());
		order.setUserid(userid);
		order.setUsername(username);
		order.setUsertele(telephone);
		order.setShareinfoid(rsdid);
		orderDao.insertOrder(order);
		// return ResponseData.newSuccess("验证码已发送到您的手机！请注意查收！");
		return ResponseData.newSuccess("下单成功！");
	}

}
