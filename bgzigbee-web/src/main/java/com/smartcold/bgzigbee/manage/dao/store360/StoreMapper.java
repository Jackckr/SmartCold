package com.smartcold.bgzigbee.manage.dao.store360;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.store360.StoreEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created by qiangzi on 2017/9/15.
 */
public interface StoreMapper {
    Page<StoreEntity> findListByFilter(@Param("keyword") String keyword);

    StoreEntity findByName(@Param("name")String name);

    void insertStore(StoreEntity storeEntity);

    void updateStore(StoreEntity storeEntity);

    StoreEntity selectById(Integer id);

    void delStoreById(Integer id);
}
