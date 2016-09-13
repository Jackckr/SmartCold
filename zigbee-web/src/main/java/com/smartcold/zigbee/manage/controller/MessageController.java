package com.smartcold.zigbee.manage.controller;

import java.io.UnsupportedEncodingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.MessageMapper;
import com.smartcold.zigbee.manage.dao.MsgCategoryMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.entity.MessageEntity;
import com.smartcold.zigbee.manage.util.ResponseData;
/**
 * 
 * @author kaiqiang jiang
 * @version 创建时间：2016-9-13 下午2:24:54
 * 消息通知controller
 */
@Controller
@RequestMapping(value = "/message")
public class MessageController extends BaseController {
	@Autowired
	private MessageMapper messageDao;
	@Autowired
	private MsgCategoryMapper msgCategoryDao;
	
	/**
	 * 为前台user查询通知提供服务
	 * @param pageNum
	 * @param pageSize
	 * @param userID
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping(value = "/findMessageByUserId")
	@ResponseBody
	public Object findMessageByUserId(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize, 
			@RequestParam(value="userID", required=false) Integer userID) throws UnsupportedEncodingException {
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 10:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		PageInfo<MessageEntity> pageInfo= new PageInfo<MessageEntity>(messageDao.findMessageByUserID(userID));
	    return pageInfo;
	}
	
	/**
	 * 根据分类查询消息
	 * @param pageNum
	 * @param pageSize
	 * @param categoryID
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping(value = "/findMessageByCate")
	@ResponseBody
	public Object findMessageByCate(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize,@RequestParam(value="categoryID") Integer categoryID) throws UnsupportedEncodingException {
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 10:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		Page<MessageEntity> msg = messageDao.findMessageByCategory(categoryID);
		PageInfo<MessageEntity> data = new PageInfo<MessageEntity>(msg);
	    return ResponseData.newSuccess(data);
	}
	
	/**
	 * 删除消息
	 * @param msgID
	 * @return
	 */
	@RequestMapping(value = "/deleteMessage")
	@ResponseBody
	public Object deleteMessage(int msgID) {
		 messageDao.deleteMessage(msgID);
		 return new BaseDto(0);
	}
	
	/**
	 * 根据id查询消息
	 * @param msgID
	 * @return
	 */

	@RequestMapping(value = "/findMessageByID")
	@ResponseBody
	public Object findMessageByID(@RequestParam int msgID) {
		return messageDao.findMessageByID(msgID);
	}
	/**
	 * 增加消息
	 * @param message
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addMessage")
	@ResponseBody
	public Object addMessage(MessageEntity message) throws Exception {
		messageDao.insertMessage(message);
		return new BaseDto(0);
	}
	
	/**
	 * 查询所有的消息类别
	 * @return
	 */
	@RequestMapping(value = "/findAllMsgCategory")
	@ResponseBody
	public Object findAllMsgCategory() {
		return msgCategoryDao.findAllMsgCategory();
	}
}