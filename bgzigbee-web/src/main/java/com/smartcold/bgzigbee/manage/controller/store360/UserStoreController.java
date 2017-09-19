package com.smartcold.bgzigbee.manage.controller.store360;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.store360.UserStoreMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.store360.UserStoreEntity;
import com.smartcold.bgzigbee.manage.util.EncodeUtil;
import com.smartcold.bgzigbee.manage.util.StringUtil;
import com.smartcold.bgzigbee.manage.util.TableData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by qiangzi on 2017/9/14.
 */
@Controller
@RequestMapping(value = "/userStore")
public class UserStoreController {
    @Autowired
    UserStoreMapper userStoreMapper;

    @RequestMapping(value = "/deleteByUserIDs")//
    @ResponseBody
    public Object deleteByUserIDs(Integer[] userIDs) {
        if(userIDs!=null&&userIDs.length>0){
            for (Integer userID : userIDs) {
                userStoreMapper.delUser(userID);
            }
            return new BaseDto(1);
        }
        return new BaseDto(0);
    }

    @RequestMapping(value = "/deleteUser")
    @ResponseBody
    public Object deleteUser(Integer userID){
        userStoreMapper.delUser(userID);
        return new BaseDto(1);
    }

    @ResponseBody
    @RequestMapping(value = "/vistUserName")
    public Object vistUserName(String username) {
        if(StringUtil.isNull(username)){return true;}
        return this.userStoreMapper.findUserByName(username)==null? true:false;
    }

    @RequestMapping(value = "/addorupdateUser",method= RequestMethod.POST)
    @ResponseBody
    public Object addorupdateUser(UserStoreEntity user) {
        try {
            if(StringUtil.isNull(user.getUsername())||(user.getId()==0&&StringUtil.isNull(user.getPassword()))){return new ResultDto(-1, "用户名不能为空");}
            if(user.getId()==0){//添加
                user.setPassword(EncodeUtil.encodeByMD5(user.getPassword()));
                userStoreMapper.insertUser(user);
            }else{
                //修改
                if(StringUtil.isnotNull(user.getPassword())){
                    user.setPassword(EncodeUtil.encodeByMD5(user.getPassword()));
                }else {
                    user.setPassword(null);
                }
                userStoreMapper.updateUser(user);
            }
            return new BaseDto(0);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseDto(-1);
        }
    }

    @RequestMapping(value = "/getUserByFilter", method = RequestMethod.POST)
    @ResponseBody
    public TableData<UserStoreEntity> getUserByFilter(Integer role, String words, int  page, int rows) {
        PageHelper.startPage(page, rows);
        Page<UserStoreEntity> userList  = userStoreMapper.findUserByFilter(words,role);
        return TableData.newSuccess(new PageInfo<UserStoreEntity>(userList));
    }

    @RequestMapping(value = "/changeRole")
    @ResponseBody
    public void changeRole(Integer role,Integer userID){
        UserStoreEntity userStoreEntity = new UserStoreEntity();
        userStoreEntity.setId(userID);
        userStoreEntity.setRole(role);
        userStoreMapper.updateUser(userStoreEntity);
    }
}
