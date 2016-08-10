package com.smartcold.zigbee.manage.controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dao.OrdersMapper;
import com.smartcold.zigbee.manage.dao.RdcShareMapper;
import com.smartcold.zigbee.manage.dao.UserMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.OrdersDTO;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;

import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.entity.OrdersEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;

import com.smartcold.zigbee.manage.service.FtpService;
import com.smartcold.zigbee.manage.util.ResponseData;
import com.smartcold.zigbee.manage.util.SetUtil;
import com.smartcold.zigbee.manage.util.StringUtil;
import com.smartcold.zigbee.manage.util.TelephoneVerifyUtil;
import com.taobao.api.ApiException;

@Controller
@RequestMapping(value = "/orders")
public class OrdersController extends BaseController {
	@Autowired
	private OrdersMapper orderDao;
	@Autowired
	private UserMapper userDao;
	@Autowired
	private RdcShareMapper rsmDao;
    @Autowired
	private FileDataMapper fileDataDao;
	@RequestMapping(value = "/findOrdersByUserId")
	@ResponseBody
	public Object findOrdersByUserId(@RequestParam int userID,
			@RequestParam int pageNum, @RequestParam int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		Page<OrdersEntity> ordersList = orderDao.findOrdersByPersonId(userID);
		Page<OrdersDTO> ordersDTOList = new Page<OrdersDTO>();
		for (int i = 0; i < ordersList.size(); i++) {
			OrdersDTO ordersDTO = new OrdersDTO();
			ordersDTO.setOrders(ordersList.get(i));
			RdcShareDTO rsd = rsmDao.getSEByID(""
					+ ordersList.get(i).getShareinfoid());
			if (rsd != null) {
				ordersDTO.setLogo(rsd.getLogo());
				ordersDTO.setFiles(rsd.getFiles());
			}
			ordersDTOList.add(ordersDTO);
		}
		PageInfo<OrdersDTO> data = new PageInfo<OrdersDTO>(ordersDTOList);
		return ResponseData.newSuccess(data);
	}
	
	/**
	 * 
	 * @param orderID
	 * @return
	 */
/*	@RequestMapping(value = "/findOrderByOrderId")
	@ResponseBody
	public Object findOrderByOrderId(@RequestParam String orderID) {
		OrdersEntity data = orderDao.findOrderByOrderId(Integer.parseInt(orderID));
		RdcShareDTO rsd = rsmDao.getSEByID("" + data.getShareinfoid());
		if (rsd != null) {
			data.setLogo(rsd.getLogo());
			data.setFiles(rsd.getFiles());
		}
		return ResponseData.newSuccess(data);
	}*/
	
	/**
	 * 
	 * @param request
	 * @param user
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "/generateOrder")
	@ResponseBody
	public Object generateOrder(HttpServletRequest request, int userid,
			String username, String telephone, String address, int rsdid, int dataType,
			String typeText, int releaseID, String title) {
		OrdersEntity order = new OrdersEntity();
		OrdersDTO ordersDTO = new OrdersDTO();
		try {
			Calendar calendar = Calendar.getInstance();
			order.setOrderid("" + calendar.getTime().getTime());
			/*String ordername = "";
			if (dataType == 1) {
				ordername = ordername + "[货品]";
			} else if (dataType == 2) {
				ordername = ordername + "[配送]";
			} else if (dataType == 3) {
				ordername = ordername + "[仓库]";
			}
			ordername = ordername + title;
			ordername = ordername + typeText;*/
			String ordername = title;
			order.setOrdername(ordername);
			order.setOwnerid(releaseID);
			UserEntity owner = userDao.findUserById(releaseID);
			if (StringUtil.isNull(owner.getTelephone())) {
				return ResponseData.newFailure("下单失败！发布之没有留下联系方式！");
			}
			order.setOwnername(owner.getUsername());
			order.setOwnertele(owner.getTelephone());
			order.setUserid(userid);
			order.setUsername(username);
			order.setUsertele(telephone);
			order.setShareinfoid(rsdid);
			RdcShareDTO rsd = rsmDao.getSEByID("" + rsdid);
			List<FileDataEntity> files = this.fileDataDao.findByBelongIdAndCategory(rsd.getId(), FileDataMapper.CATEGORY_SHARE_PIC);
			 if(SetUtil.isnotNullList(files)){
					List<String> filelist =new ArrayList<String>();
					for (FileDataEntity file : files) {
						filelist.add(FtpService.READ_URL+file.getLocation());
					}
					rsd.setFiles(filelist);
					rsd.setLogo(files.get(files.size()-1).getLocation());
			} 
			if (rsd != null) {
				ordersDTO.setLogo(rsd.getLogo());
				ordersDTO.setFiles(rsd.getFiles());
			}
			ordersDTO.setOrders(order);
			ordersDTO.setRsd(rsd);
			ordersDTO.setUseraddress(address);
			ordersDTO.setOwneraddress(owner.getAddress());
			orderDao.insertOrder(order);
			// return ResponseData.newSuccess("验证码已发送到您的手机！请注意查收！");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		OrdersDTO data = ordersDTO;
		return ResponseData.newSuccess(data);
	}
	
	@ResponseBody
	@RequestMapping(value = "/deleteByOrderID", method = RequestMethod.DELETE)
	public Object deleteByOrderID(Integer orderID) {
		if (orderID <= 0) {
			return new BaseDto(-1);
		}
		orderDao.deleteByOrderID(orderID);
		return new BaseDto(0);
	}

	
	@RequestMapping(value = "/getTelephone")
	@ResponseBody
	public void getTelephone(@RequestParam String ownerTele,
			@RequestParam String userTele,@RequestParam String ownerName,
			@RequestParam String userName) throws ApiException {
		TelephoneVerifyUtil tVerifyUtil = new TelephoneVerifyUtil();
		tVerifyUtil.callUser(userTele, userName, ownerTele, ownerName);
		tVerifyUtil.callOwner(userTele, userName, ownerTele, ownerName);
	}

}
