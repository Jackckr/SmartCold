package com.smartcold.manage.cold.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.AirEnthalpyMapper;
import com.smartcold.manage.cold.dao.AirPropertyMapper;
import com.smartcold.manage.cold.dao.GoodsMapper;
import com.smartcold.manage.cold.dao.PackMapper;
import com.smartcold.manage.cold.entity.AirEnthalpyEntity;
import com.smartcold.manage.cold.entity.AirPropertyEntity;
import com.smartcold.manage.cold.entity.CalculationHeatEntity;
import com.smartcold.manage.cold.entity.GoodsEntity;
import com.smartcold.manage.cold.service.CalculationHeat;

@Service
public class CalculationHeatImpl implements CalculationHeat {

	@Autowired
	private GoodsMapper goodsDao;

	@Autowired
	private PackMapper packDao;

	@Autowired
	private AirEnthalpyMapper airEnthalpyDao;

	@Autowired
	private AirPropertyMapper airPropertyDao;

	@Override
	public float calculateQ(CalculationHeatEntity calculationEntity) {
		return calculateQ1(calculationEntity) + calculateQ2(calculationEntity) + calculateQ3(calculationEntity)
				+ calculateQ4(calculationEntity);
	}

	@Override
	public float calculateQ1(CalculationHeatEntity calculationEntity) {
		float insideTemperature = calculationEntity.getInsideTemperature();

		float frontWall = calculateWall(calculationEntity.getHeight() * calculationEntity.getWeight(),
				calculationEntity.getFrontWall().getMaterial().getThermalConductivity(),
				calculationEntity.getFrontWall().getOutTemperature(), insideTemperature, 1);
		float leftWall = calculateWall(calculationEntity.getHeight() * calculationEntity.getLength(),
				calculationEntity.getLeftWall().getMaterial().getThermalConductivity(),
				calculationEntity.getLeftWall().getOutTemperature(), insideTemperature, 1);
		float rightWall = calculateWall(calculationEntity.getHeight() * calculationEntity.getLength(),
				calculationEntity.getRightWall().getMaterial().getThermalConductivity(),
				calculationEntity.getRightWall().getOutTemperature(), insideTemperature, 1);
		float behindWall = calculateWall(calculationEntity.getHeight() * calculationEntity.getLength(),
				calculationEntity.getBehindWall().getMaterial().getThermalConductivity(),
				calculationEntity.getBehindWall().getOutTemperature(), insideTemperature, 1);
		float floor = calculateWall(calculationEntity.getWeight() * calculationEntity.getLength(),
				calculationEntity.getFloor().getMaterial().getThermalConductivity(),
				calculationEntity.getFloor().getOutTemperature(), insideTemperature, 1);
		float ceiling = calculateWall(calculationEntity.getHeight() * calculationEntity.getLength(),
				calculationEntity.getCeiling().getMaterial().getThermalConductivity(),
				calculationEntity.getCeiling().getOutTemperature(), insideTemperature, 1);

		return frontWall + leftWall + rightWall + behindWall + floor + ceiling;
	}

	@Override
	public float calculateQ2(CalculationHeatEntity calculationEntity) {
		final float B = (float) 0.01;

		float huoWuRe = (calculationEntity.getGoodsWeight()
				* (calculateEntropy(calculationEntity.getGoodsType(), calculationEntity.getGoods().getName(),
						calculationEntity.getGoodsFromTemperature(), calculationEntity.getInsideTemperature())))
				/ (calculationEntity.getFreezingHour() * (float) 3.6);

		float baoZhuangRe = (calculationEntity.getGoodsWeight() * B
				* (calculationEntity.getGoodsFromTemperature() - calculationEntity.getGoodsToTemperature())
				* packDao.findPackByName(calculationEntity.getPack().getName()).getThermalConductivity())
				/ (calculationEntity.getFreezingHour() * (float) 3.6);

		float lengQueHuXiRe = calculationEntity.getGoodsWeight()
				* goodsDao.findGoodsByName(calculationEntity.getGoodsType(), calculationEntity.getGoods().getName())
						.getBreathHeat();

		float lengCangHuXiRe = (calculationEntity.getGoodsTotalWeight() - calculationEntity.getGoodsWeight())
				* goodsDao.findGoodsByName(calculationEntity.getGoodsType(), calculationEntity.getGoods().getName())
						.getBreathHeat();

		return huoWuRe + baoZhuangRe + lengQueHuXiRe + lengCangHuXiRe;
	}

	@Override
	public float calculateQ3(CalculationHeatEntity calculationEntity) {
		int huanReCiShu = 5;
		AirEnthalpyEntity huWaiKongQiHanRe = airEnthalpyDao.getEnthalpy(
				(int) (calculationEntity.getOutsideTemperature() + 0.5),
				(int) (calculationEntity.getOutsideHumidity() + 5) / 10 * 10);
		AirEnthalpyEntity huNeiKongQiHanre = airEnthalpyDao.getEnthalpy(
				(int) (calculationEntity.getInsideTemperature() + 0.5),
				(int) (calculationEntity.getInsideHumidity() + 5) / 10 * 10);
		float chuCangJianTiJi = calculationEntity.getWeight() * calculationEntity.getHeight()
				* calculationEntity.getLength();
		AirPropertyEntity chuCangJianKongQiMiDu = airPropertyDao
				.getAirProperty((int) (calculationEntity.getInsideTemperature() + 5) / 10 * 10);

		float lengCangJianHuanRe = (huWaiKongQiHanRe.getEnthalpy() - huNeiKongQiHanre.getEnthalpy()) * huanReCiShu
				* chuCangJianTiJi * chuCangJianKongQiMiDu.getDensity() / 24 / (float) 3.6;
		float caoZuoRenYuanHaoRe = 30 * calculationEntity.getPeople() * chuCangJianKongQiMiDu.getDensity()
				* (huWaiKongQiHanRe.getEnthalpy() - huNeiKongQiHanre.getEnthalpy()) / (float) 3.6;

		return lengCangJianHuanRe + caoZuoRenYuanHaoRe;
	}

	@Override
	public float calculateQ4(CalculationHeatEntity calculationEntity) {
		return 0;
	}

	@Override
	public float calculateWall(float s, float k, float toutside, float tinside, float a) {
		return s * k * (toutside - tinside) * a;
	}

	@Override
	public float calculateEntropy(int typeId, String goodsName, float fromTemperature, float toTemperature) {
		GoodsEntity goodsEntity = goodsDao.findGoodsByName(typeId, goodsName);
		float bingDianWenDu = goodsEntity.getFreezingPoint();

		// 计算冷却显热
		float lengQueXianRe = fromTemperature > bingDianWenDu
				? (fromTemperature - bingDianWenDu > toTemperature ? bingDianWenDu : toTemperature)
						* goodsEntity.getFreezingHeat()
				: 0;

		// 计算潜热
		float lengDongQianRe = bingDianWenDu > toTemperature ? goodsEntity.getLatentHeat() : 0;

		// 计算冷冻显热
		float lengDongXianRe = bingDianWenDu > toTemperature
				? (bingDianWenDu - toTemperature) * goodsEntity.getCoolingHeat() : 0;

		return lengQueXianRe + lengDongQianRe + lengDongXianRe;
	}
}
