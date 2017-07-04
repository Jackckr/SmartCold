package com.smartcold.zigbee.manage.dao;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.entity.CollectEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by qiangzi on 2017/7/3.
 */
public interface CollectMapper {
    void insertByCollect(CollectEntity collectEntity);

    void delByCollect(@Param("collectId") int collectId,@Param("uid") int uid,@Param("collectType") int collectType);

    Page<CollectEntity> getRdcCollectByUid(Integer uid);

    Page<CollectEntity> getSharedCollectByUid(Integer uid);

    List<Integer> getUsersIdByColId(Integer colId);
}
