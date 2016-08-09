package com.smartcold.zigbee.manage.controller;

import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.OrdersMapper;
import com.smartcold.zigbee.manage.dao.RdcShareMapper;
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
	@Autowired
	private RdcShareMapper rsmDao;
	
	@RequestMapping(value = "/findOrdersByUserId")
	@ResponseBody
	public Object findOrdersByUserId(@RequestParam int userID,@RequestParam int pageNum,@RequestParam int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		Page<OrdersEntity> ordersList = orderDao.findOrdersByPersonId(userID);
		for (int i = 0; i < ordersList.size(); i++) {
			RdcShareDTO rsd = rsmDao.getSEByID(""+ordersList.get(i).getShareinfoid());
			if (rsd!=null) {
				ordersList.get(i).setLogo(rsd.getLogo());
				ordersList.get(i).setFiles(rsd.getFiles());
			}
		}
		PageInfo<OrdersEntity> data = new PageInfo<OrdersEntity>(ordersList);
		return  ResponseData.newSuccess(data);	
	}

	@RequestMapping(value = "/findOrderByOrderId")
	@ResponseBody
	public Object findOrderByOrderId(@RequestParam int orderID) {
	       OrdersEntity data = orderDao.findOrderByOrderId(orderID);
			RdcShareDTO rsd = rsmDao.getSEByID(""+data.getShareinfoid());
			if (rsd!=null) {
				data.setLogo(rsd.getLogo());
				data.setFiles(rsd.getFiles());
			}
		return  ResponseData.newSuccess(data);	
	}
	/**
	 * 
	 * @param request
	 * @param user
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "/generateOrder")
	@ResponseBody
	public Object generateOrder(HttpServletRequest request,
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
		OrdersEntity data = order;
		orderDao.insertOrder(order);
		// return ResponseData.newSuccess("验证码已发送到您的手机！请注意查收！");
		return ResponseData.newSuccess(data);	
	}

}
