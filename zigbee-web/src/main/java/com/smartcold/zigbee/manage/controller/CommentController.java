package com.smartcold.zigbee.manage.controller;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.CommentMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.CommentDTO;
import com.smartcold.zigbee.manage.dto.OrdersDTO;
import com.smartcold.zigbee.manage.dto.PersonalCommentDTO;
import com.smartcold.zigbee.manage.dto.RdcAddDTO;
import com.smartcold.zigbee.manage.entity.OrdersEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.smartcold.zigbee.manage.service.CommentService;
import com.smartcold.zigbee.manage.util.ResponseData;

import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping(value = "/comment")
public class CommentController {

        @Autowired
        private CommentMapper commentDao;

       /* @RequestMapping(value = "/findCommentsByRDCId", method = RequestMethod.GET)
        @ResponseBody
        public Object findCommentsByRDCId(@RequestParam int rdcID, @RequestParam int npoint) {
            return commentMapper.findLastNComment(rdcID, npoint);
        }*/

    @Autowired
    private CommentService commentService;

    @RequestMapping(value = "/findCommentsByRDCId", method = RequestMethod.GET)
    @ResponseBody
    public Object findCommentsByRDCId(@RequestParam int rdcID, @RequestParam int npoint) {
        return commentService.findCommentsRdcID(rdcID, npoint);
    }
    
    @RequestMapping(value = "/findCommentsByUserId", method = RequestMethod.GET)
    @ResponseBody
    public Object findCommentsByUserId(@RequestParam int userID,@RequestParam int pageNum, @RequestParam int pageSize) {
    	try {
			Page<PersonalCommentDTO> commentsList = commentService.findCommentsUserID(userID,pageNum,pageSize);
			PageInfo<PersonalCommentDTO> data = new PageInfo<PersonalCommentDTO>(commentsList);
			return ResponseData.newSuccess(data);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure();
		}
    }
    

    @RequestMapping(value = "/addUsefulCnt", method = RequestMethod.POST)
    @ResponseBody
    public void addUsefulCnt(@RequestParam int id) {
        commentDao.addUsefulCnt(id);
    }
    
    @ResponseBody
	@RequestMapping(value = "/deleteByCommentID")
	public Object deleteByCommentID(Integer commentID) {
		if (commentID==null||commentID <= 0) {
			return new BaseDto(-1);
		}
		commentDao.deleteByCommentID(commentID);
		return new BaseDto(0);
	}
    
}
