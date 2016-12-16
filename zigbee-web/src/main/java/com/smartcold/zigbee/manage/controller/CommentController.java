package com.smartcold.zigbee.manage.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.CommentMapper;
import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dao.RdcMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.PersonalCommentDTO;
import com.smartcold.zigbee.manage.entity.CommentEntity;
import com.smartcold.zigbee.manage.service.CommentService;
import com.smartcold.zigbee.manage.util.ResponseData;

@Controller
@RequestMapping(value = "/comment")
public class CommentController {

    @Autowired
    private CommentMapper commentDao;
    @Autowired
    private FileDataMapper fileMapper;
    @Autowired
    private RdcMapper rdcMapper;
   /* @RequestMapping(value = "/findCommentsByRDCId", method = RequestMethod.GET)
    @ResponseBody
    public Object findCommentsByRDCId(@RequestParam int rdcID, @RequestParam int npoint) {   return commentMapper.findLastNComment(rdcID, npoint);  }*/

    @Autowired
    private CommentService commentService;

    @RequestMapping(value = "/getCommentById", method = RequestMethod.GET)
    @ResponseBody
    public ResponseData<HashMap<String , Object>> getCommentById(int id) {
    	CommentEntity comment = commentService.getCommentById(id);
    	if(comment==null){ return ResponseData.newFailure("未找到评价信息"); }
    	HashMap<String , Object> hashMap=new HashMap<String, Object>();
    	hashMap.put("data", comment);
    	hashMap.put("rdc", this.rdcMapper.findRDCEntityDtoByRdcId(comment.getRdcID()));
    	hashMap.put("img", fileMapper.findByBelongIdAndCategory(id,FileDataMapper.CATEGORY_COMMENT_PIC));
    	return ResponseData.newSuccess(hashMap);
    }
    
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
