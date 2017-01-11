package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.GoodsMapper;
import com.smartcold.manage.cold.dao.newdb.GoodsTypeMapper;
import com.smartcold.manage.cold.entity.newdb.GoodsEntity;
import com.smartcold.manage.cold.entity.newdb.GoodsTypeEntity;
import com.smartcold.manage.cold.entity.olddb.SingleTypeEntity;
import com.smartcold.manage.cold.service.GoodsService;

@Service
public class GoodsServiceImpl implements GoodsService {

	@Autowired
	private GoodsMapper goodsDao;

	@Autowired
	private GoodsTypeMapper goodsTypeDao;

	@Override
	public List<SingleTypeEntity> getAllGoods() {
		// TODO Auto-generated method stub
		List<SingleTypeEntity> typeGoods = new ArrayList<SingleTypeEntity>();
		List<GoodsTypeEntity> goodsTypeEntities = goodsTypeDao.findAll();
		for (GoodsTypeEntity goodsTypeEntity : goodsTypeEntities) {
			SingleTypeEntity single = new SingleTypeEntity();
			List<GoodsEntity> goodsEntities = goodsDao.findGoodsByTypeId(goodsTypeEntity.getId());
			single.setName(goodsTypeEntity.getTypeName());
			single.setId(goodsTypeEntity.getId());
			single.setGoodsEntity(goodsEntities);
			typeGoods.add(single);
		}

		return typeGoods;
	}

}
