package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.entity.olddb.CalculationHeatEntity;
import com.smartcold.manage.cold.service.CalculationHeat;

@Controller
@RequestMapping(value = "/calculation")
public class CalculationController extends BaseController {

	@Autowired
	private CalculationHeat calculationService;

	@RequestMapping(value = "/calculationHeat", method = RequestMethod.POST)
	@ResponseBody
	public Object findAllGoods(@RequestBody CalculationHeatEntity calculationEntity) {
		
		return calculationService.calculateQ(calculationEntity);
	}
}
