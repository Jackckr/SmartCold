package com.smartcold.zigbee.manage.controller;

import com.smartcold.zigbee.manage.dao.CommentMapper;
import com.smartcold.zigbee.manage.dto.RdcAddDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.smartcold.zigbee.manage.service.CommentService;
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


    @RequestMapping(value = "/addUsefulCnt", method = RequestMethod.POST)
    @ResponseBody
    public void addUsefulCnt(@RequestParam int id) {
        commentDao.addUsefulCnt(id);
    }
}
