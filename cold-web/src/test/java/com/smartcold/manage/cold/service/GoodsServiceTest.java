package com.smartcold.manage.cold.service;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.smartcold.manage.cold.dto.BlowerDTO;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;
import com.smartcold.manage.cold.entity.olddb.SingleTypeEntity;

/**
 * Created by sunqiunian on 16/2/25.
 */
@Transactional(rollbackFor = Exception.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath*:config/spring/local/appcontext*.xml" })
public class GoodsServiceTest {

	@Autowired
	private GoodsService goodsService;

	@Autowired
	private CompressorGroupService compressorGroupService;

	@Autowired
	private CompressorBlowerService compressorBlowerService;

	@Test
	@Rollback(true)
	public void findBudgetListByBusinessIdAndRoleId_corret() throws Exception {
		List<SingleTypeEntity> list = goodsService.getAllGoods();
		System.out.println("list:" + Lists.transform(list, new Function<SingleTypeEntity, Integer>() {
			@Override
			public Integer apply(SingleTypeEntity input) {
				return input.getGoodsEntity().size();
			}
		}));
	}

	@Test
	@Rollback(true)
	public void compressorGroup_test() {
		List<CompressorGroupSetEntity> list = compressorGroupService.findByUserId(5);
		System.out.println(list);
	}

	@Test
	@Rollback(true)
	public void compressorBlower_test() {
		List<BlowerDTO> list = compressorBlowerService.findByRdcId(5);
		System.out.println(list.size());
	}
}
