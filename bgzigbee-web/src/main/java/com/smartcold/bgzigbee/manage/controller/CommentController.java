package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dao.CommentMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.service.CommentService;

/**
 * Description: ColdStorageController
 * Author: qiunian.sun
 * Update: qiunian.sun(2016-03-15 23:38)
 */
@Controller
@ResponseBody
@RequestMapping(value = "/comment")
public class CommentController {

      /*  @Autowired
        private CommentMapper commentDao;

        @RequestMapping(value = "/findCommentsByRDCId", method = RequestMethod.GET)
        @ResponseBody
        public Object findCommentsByRDCId(@RequestParam int rdcID, @RequestParam int npoint) {
            return commentMapper.findLastNComment(rdcID, npoint);
        }*/

    @Autowired
    private CommentService commentService;

    @Autowired
    private CommentMapper commentDao;
    
    @RequestMapping(value = "/findCommentsByRDCId", method = RequestMethod.GET)
    public Object findCommentsByRDCId(@RequestParam int rdcID, @RequestParam int npoint) {
        return commentService.findCommentsRdcID(rdcID, npoint);
    }
    
    @RequestMapping(value="/findByPage", method=RequestMethod.POST)
    public Object findByPage(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize", required=false) Integer pageSize,
			@RequestParam(value="keyword", required=false) String keyword){
    	pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 10:pageSize;
		return commentService.findByPage(pageNum, pageSize, keyword);
    }
    
    @RequestMapping(value="/deleteCommentByID", method=RequestMethod.DELETE)
    public Object deleteCommentByID(int id){
    	commentDao.deleteCommentByID(id);
    	return new BaseDto(0);
    }
    @RequestMapping(value="/deleteByIds", method=RequestMethod.DELETE)
    public Object deleteByIds(int[] ids){
    	for(int id:ids){
    		commentDao.deleteCommentByID(id);
    	}
    	return new BaseDto(0);
    }
}
