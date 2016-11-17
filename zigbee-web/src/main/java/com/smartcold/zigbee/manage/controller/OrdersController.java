package com.smartcold.zigbee.manage.controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dao.MessageMapper;
import com.smartcold.zigbee.manage.dao.OrdersMapper;
import com.smartcold.zigbee.manage.dao.RdcShareMapper;
import com.smartcold.zigbee.manage.dao.UserMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.OrdersDTO;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;
import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.entity.MessageEntity;
import com.smartcold.zigbee.manage.entity.OrdersEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.FtpService;
import com.smartcold.zigbee.manage.service.RdcShareService;
import com.smartcold.zigbee.manage.util.CometUtil;
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
	private MessageMapper msgDao;
    @Autowired
	private FileDataMapper fileDataDao;
    @Autowired
    private RdcShareService rdcShareService;
    /**
     * 根据用户id查询该用户所有的订单
     * @param userID 用户id
     * @param pageNum 
     * @param pageSize
     * @param keyword 关键字，可为空
     * @return
     */
	@RequestMapping(value = "/findOrdersByUserId")
	@ResponseBody
	public Object findOrdersByUserId(@RequestParam int userID,
			@RequestParam int pageNum, @RequestParam int pageSize,
			@RequestParam(value = "keyword", required = false) String keyword) {
		PageHelper.startPage(pageNum, pageSize);
		if (keyword!=null) {
			keyword = keyword.equals("")? null:keyword ;
		}
		Page<OrdersEntity> ordersList = orderDao.findOrdersByPersonId(userID,keyword);
		Page<OrdersDTO> ordersDTOList = new Page<OrdersDTO>();
		for (int i = 0; i < ordersList.size(); i++) {
			OrdersDTO ordersDTO = new OrdersDTO();
			ordersDTO.setOrders(ordersList.get(i));
			RdcShareDTO rsd = rsmDao.getSEByID(""
					+ ordersList.get(i).getShareinfoid());
			if (rsd!=null) {
				List<FileDataEntity> files = this.fileDataDao.findByBelongIdAndCategory(rsd.getId(), FileDataMapper.CATEGORY_SHARE_PIC);
				if (files!=null) {
					 if(SetUtil.isnotNullList(files)){
							List<String> filelist =new ArrayList<String>();
							for (FileDataEntity file : files) {
								filelist.add(FtpService.READ_URL+file.getLocation());
							}
							ordersDTO.setFiles(filelist);
							ordersDTO.setLogo(filelist.get(0));
					} 
				}
			}
			ordersDTO.setRsd(rsd);
			ordersDTOList.add(ordersDTO);
			ordersDTOList.setTotal(ordersList.getTotal());
		}
		PageInfo<OrdersDTO> data = new PageInfo<OrdersDTO>(ordersDTOList);
		return ResponseData.newSuccess(data);
	}
	
	/**
	 * 根据order的id查询唯一的order
	 * @param request
	 * @param id 订单id
	 * @param uid 拥有该订单的用户id
	 * @return
	 */
	@RequestMapping(value = "/findOrderByOrderId")
	@ResponseBody
	public Object findOrderByOrderId(HttpServletRequest request,@RequestParam String id,Integer uid) {
		HashMap<String, Object> dataMap=new HashMap<String, Object>();
		if(uid==null||uid==0){
			UserEntity user =(UserEntity) request.getSession().getAttribute("user");//警告 ->调用该方法必须登录
			if(user==null||user.getId()==0){return ResponseData.newFailure("请登录后查看信息");}else{
				uid=user.getId();
			}
		}
		OrdersEntity oEntity = this.orderDao.findOrderByOrderId(Integer.parseInt(id),uid);	
		if(oEntity!=null){
		    UserEntity ownerUser = this.userDao.findUserById( oEntity.getOwnerid());
		    UserEntity orderUser = this.userDao.findUserById( oEntity.getUserid());
		    RdcShareDTO      rsd = this.rdcShareService.getSEByID(oEntity.getShareinfoid()+"");
		    ownerUser.setPassword(null);
		    orderUser.setPassword(null);
			dataMap.put("rsd", rsd);
			dataMap.put("orders", oEntity);
			dataMap.put("ownerUser", ownerUser);
			dataMap.put("orderUser", orderUser);
			return ResponseData.newSuccess(dataMap);
		}else{
			return ResponseData.newFailure("没有订单信息！");
		}
	}
	
	/**
	 * 用户下单，产生一个订单
	 * @param request
	 * @param userid 下单用户（当前登录的用户）的id
	 * @param username 下单用户的name
	 * @param telephone 下单用户的手机号
	 * @param address 下单用户的地址
	 * @param rsdid 共享信息的id
	 * @param dataType 共享信息的类型（货品 冷库 冷运）
	 * @param typeText 共享信息的类别（出货 找货）
	 * @param releaseID 共享信息的发布者的id
	 * @param title 订单的标题，可用共享信息的标题
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
			String ordername = title;
			order.setOrdername(ordername);
			order.setOwnerid(releaseID);
			UserEntity owner = userDao.findUserById(releaseID);
			if (owner!=null&&StringUtil.isNull(owner.getTelephone())) {
				return ResponseData.newFailure("下单失败！发布者没有留下联系方式！");
			}
			order.setOwnername(owner.getUsername());
			order.setOwnertele(owner.getTelephone());
			order.setUserid(userid);
			order.setUsername(username);
			order.setUsertele(telephone);
			order.setShareinfoid(rsdid);
			RdcShareDTO rsd = rsmDao.getSEByID("" + rsdid);
			if(rsd==null){
				return ResponseData.newFailure("下单失败！当前发布信息已失效！");
			}
			List<FileDataEntity> files = this.fileDataDao.findByBelongIdAndCategory(rsd.getId(), FileDataMapper.CATEGORY_SHARE_PIC);
			if (rsd != null) {
			if(SetUtil.isnotNullList(files)){
					List<String> filelist =new ArrayList<String>();
					for (FileDataEntity file : files) {
						filelist.add(FtpService.READ_URL+file.getLocation());
					}
						ordersDTO.setFiles(filelist);
						ordersDTO.setLogo(filelist.get(0));
					}
					
			} 
			ordersDTO.setOrders(order);
			ordersDTO.setRsd(rsd);
			ordersDTO.setUseraddress(address);
			ordersDTO.setOwneraddress(owner.getAddress());
			orderDao.insertOrder(order);
			MessageEntity message = new MessageEntity();
			message.setUserid(order.getUserid());
			message.setMsgdata(order.getOrdername()+":您已经抢到来自"+order.getOwnername()+"的订单");
			message.setMsgcategory(1);
			message.setMsgcount(1);
			msgDao.insertMessage(message);
			new CometUtil().pushTo(message);
			// return ResponseData.newSuccess("验证码已发送到您的手机！请注意查收！");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseData.newFailure("下单失败！当前发布信息已失效！");
		}
		OrdersDTO data = ordersDTO;
		return ResponseData.newSuccess(data);
	}
	
	/**
	 * 根据order的id删除order
	 * @param orderID order的id非orderid
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/deleteByOrderID")
	public Object deleteByOrderID(Integer orderID) {
		if (orderID <= 0) {
			return new BaseDto(-1);
		}
		orderDao.deleteByOrderID(orderID);
		return new BaseDto(0);
	}

	/**
	 * 给下单者及共享信息发布者发送短信
	 * @param orderid 订单的id
	 * @param ownerTele 共享信息发布者的手机号
	 * @param userTele 下单者的手机号
	 * @param ownerName 共享信息发布者的name
	 * @param userName 下单者的name
	 * @return
	 */
	@RequestMapping(value = "/getTelephone")
	@ResponseBody
	public Object getTelephone(@RequestParam int orderid,@RequestParam String ownerTele,@RequestParam String userTele,@RequestParam String ownerName,@RequestParam String userName)  {
		OrdersEntity order = orderDao.findOrderById(orderid);
		if (order!=null) {
			if (order.getTeletimes()<2) {
				TelephoneVerifyUtil tVerifyUtil = new TelephoneVerifyUtil();
				try {
					tVerifyUtil.callUser(userTele, userName, ownerTele, ownerName);
					tVerifyUtil.callOwner(userTele, userName, ownerTele, ownerName);
				} catch (ApiException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				order.setTeletimes(order.getTeletimes()+1);
				orderDao.updateOrderTimes(order);
				return ResponseData.newSuccess("对方联系人的手机号已经发送到您的手机，请及时联系！");
			}
			else {
				return ResponseData.newFailure("您已经获得过联系方式，不可重复获取，请查看手机短信！");
			}
		}
		else {
			return ResponseData.newFailure("获取联系方式失败！");
		}
	}

}
