package com.smartcold.bgzigbee.manage.dao.store360;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.store360.UserStoreEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created by qiangzi on 2017/9/14.
 */
public interface UserStoreMapper {

    void delUser(Integer uid);

    UserStoreEntity findUserByName(String username);

    void insertUser(UserStoreEntity userStoreEntity);

    void updateUser(UserStoreEntity userStoreEntity);

    Page<UserStoreEntity> findUserByFilter(@Param("words")String words,@Param("role") Integer role);
}
