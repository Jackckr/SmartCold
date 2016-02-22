package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.GoodsMapper;
import com.smartcold.manage.cold.dao.GoodsTypeMapper;
import com.smartcold.manage.cold.entity.GoodsEntity;
import com.smartcold.manage.cold.entity.GoodsTypeEntity;
import com.smartcold.manage.cold.entity.SingleType;
import com.smartcold.manage.cold.service.GoodsService;

@Service
public class GoodsServiceImpl implements GoodsService {

	@Autowired
	private GoodsMapper goodsDao;

	@Autowired
	private GoodsTypeMapper goodsTypeDao;

	@Override
	public List<SingleType> getAllGoods() {
		// TODO Auto-generated method stub
		List<SingleType> typeGoods = new ArrayList<SingleType>();
		List<GoodsTypeEntity> goodsTypeEntities = goodsTypeDao.findAll();
		for (GoodsTypeEntity goodsTypeEntity : goodsTypeEntities) {
			SingleType single = new SingleType();
			List<GoodsEntity> goodsEntities = goodsDao.findGoodsByTypeId(goodsTypeEntity.getId());
			single.setName(goodsTypeEntity.getTypeName());
			single.setId(goodsTypeEntity.getId());
			single.setGoodsEntity(goodsEntities);
			typeGoods.add(single);
		}

		return typeGoods;
	}

}
