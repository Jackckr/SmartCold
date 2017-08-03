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

    void delById(int collectId);

    void delByCollect(CollectEntity collectEntity);

    Page<CollectEntity> getRdcCollectByUid(Integer uid);

    Page<CollectEntity> getSharedCollectByUid(Integer uid);

    CollectEntity getByColId(@Param("colId") Integer colId,@Param("uid") Integer uid);

    List<Integer> getUsersIdByColId(Integer colId);

    CollectEntity getByRdcId(@Param("rdcId") Integer rdcId,@Param("uid") Integer uid);

    List<Integer> getUsersIdByRdcId(Integer rdcId);

    int delByRdcId(int rdcId);
}
