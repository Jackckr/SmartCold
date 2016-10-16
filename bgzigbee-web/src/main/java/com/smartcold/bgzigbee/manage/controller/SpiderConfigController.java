package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.smartcold.bgzigbee.manage.dao.ColdstorageLightSetMapping;
import com.smartcold.bgzigbee.manage.dao.EvaporativeBlowerSetMapping;
import com.smartcold.bgzigbee.manage.dao.EvaporativeSetMapping;
import com.smartcold.bgzigbee.manage.dao.EvaporativeWaterSetMapping;
import com.smartcold.bgzigbee.manage.dao.ForkLiftSetMapping;
import com.smartcold.bgzigbee.manage.dao.PlatformDoorSetMapping;
import com.smartcold.bgzigbee.manage.dao.SetTableMapper;
import com.smartcold.bgzigbee.manage.dao.WallSetMapper;
import com.smartcold.bgzigbee.manage.dao.WindScreenSetMapping;
import com.smartcold.bgzigbee.manage.dto.RdcIdAndNameDTO;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.dto.UpdateMappingDTO;
import com.smartcold.bgzigbee.manage.entity.ColdStorageLightSetEntity;
import com.smartcold.bgzigbee.manage.entity.DeviceObjectMappingEntity;
import com.smartcold.bgzigbee.manage.entity.EvaporativeBlowerSetEntity;
import com.smartcold.bgzigbee.manage.entity.EvaporativeSetEntity;
import com.smartcold.bgzigbee.manage.entity.EvaporativeWaterSetEntity;
import com.smartcold.bgzigbee.manage.entity.ForkLiftSetEntity;
import com.smartcold.bgzigbee.manage.entity.PlatformDoorSetEntity;
import com.smartcold.bgzigbee.manage.entity.WallSetEntity;
import com.smartcold.bgzigbee.manage.entity.WindScreenSetEntity;
import com.smartcold.bgzigbee.manage.enums.SetTables;
import com.smartcold.bgzigbee.manage.service.RemoteService;
import com.smartcold.bgzigbee.manage.service.SpiderConfigService;

/**
 * Created by corly on 16-8-13.
 */
@Controller
@RequestMapping("/spiderConfig")
@ResponseBody
public class SpiderConfigController {

	@Autowired
	private SetTableMapper setTableMapper;

	@Autowired
	private SpiderConfigService spiderConfigService;

	@Autowired
	private WindScreenSetMapping windScreenSetMapping;

	@Autowired
	private EvaporativeSetMapping evaporativeSetMapping;

	@Autowired
	private EvaporativeWaterSetMapping evaporativeWaterSetMapping;

	@Autowired
	private EvaporativeBlowerSetMapping evaporativeBlowerSetMapping;

	@Autowired
	private PlatformDoorSetMapping platformDoorSetMapping;

	@Autowired
	private ColdstorageLightSetMapping coldstorageLightSetMapping;

	@Autowired
	private ForkLiftSetMapping forkLiftSetMapping;

	@Autowired
	private WallSetMapper wallSetDao;

	@Autowired
	private RemoteService remoteService;

	@RequestMapping("/update/mapping")
	public Object updateSetTableMapping(@RequestBody UpdateMappingDTO updateMappingDTO) {
		if (updateMappingDTO.getTable().equals("rdc") || SetTables.checkTable(updateMappingDTO.getTable())) {

			if (setTableMapper.updateMapping(updateMappingDTO.getTable(), updateMappingDTO.getMapping(),
					updateMappingDTO.getId())) {
				return new ResultDto(0, "删除成功");
			}
		}
		return new ResultDto(-1, "添加失败");
	}

	@RequestMapping(value = "/delete/id", method = RequestMethod.DELETE)
	public Object deleteById(String table, int id) {
		if (!(table.equals("deviceobjectmapping") || SetTables.checkTable(table))) {
			return new ResultDto(-2, "非法参数");
		}
		if (setTableMapper.deleteById(table, id)) {
			return new ResultDto(0, "删除成功");
		}
		return new ResultDto(-1, "删除失败");
	}

	@RequestMapping("/find/windscreenSet")
	public Object findSetTableConfigByType(int storageId) {
		return windScreenSetMapping.findByStorageId(storageId);
	}

	@RequestMapping("/find/evaporativeSet")
	public Object findEvaporativeSet(int rdcId) {
		return evaporativeSetMapping.findByRdcId(rdcId);
	}

	@RequestMapping("/find/evaporativeWaterSet")
	public Object findEvaporativeWaterSet(int evaporativeid) {
		return evaporativeWaterSetMapping.findByEvaporativeId(evaporativeid);
	}

	@RequestMapping("/find/evaporativeBlowerSet")
	public Object findEvaporativeBloeSet(int evaporativeid) {
		return evaporativeBlowerSetMapping.findByEvaporativeId(evaporativeid);
	}

	@RequestMapping("/findByRdcid")
	public Object findByRdcid(String table, int rdcid) {
		if (SetTables.checkTable(table)) {
			return setTableMapper.findByRdcId(table, rdcid);
		}
		return new ResultDto(-1, "error");
	}

	@RequestMapping(value = "/del/deviceObjectMapping", method = RequestMethod.DELETE)
	public Object delDeviceObjectMapping(int id) {
		return remoteService.delDeviceObjectMappingById(id);
	}

	/**
	 * 公用的添加方法，只添加rdcid 和 name
	 * 
	 * @return
	 */
	@RequestMapping(value = "/add/rdcidAndName", method = RequestMethod.POST)
	public Object addRdcidAndName(@RequestBody RdcIdAndNameDTO rdcIdAndNameDTO) {
		if (SetTables.checkTable(rdcIdAndNameDTO.getTable()) && setTableMapper.insert(rdcIdAndNameDTO)) {
			return new ResultDto(0, "添加成功");
		}
		return new ResultDto(-1, "添加失败");
	}

	@RequestMapping(value = "/add/windscreenset", method = RequestMethod.POST)
	public Object addWindScreenSet(@RequestBody WindScreenSetEntity windScreenSetEntity) {
		if (windScreenSetMapping.insert(windScreenSetEntity)) {
			return new ResultDto(0, "添加成功");
		}
		return new ResultDto(-1, "添加失败");
	}

	@RequestMapping(value = "/delete/windscreenset", method = RequestMethod.DELETE)
	public Object deleteWindScreenSet(int id) {
		try {
			windScreenSetMapping.delete(id);
			return new ResultDto(0, "删除成功");
		} catch (Exception e) {
			return new ResultDto(-1, "删除失败");
		}
	}

	@RequestMapping(value = "/update/windscreenset", method = RequestMethod.POST)
	public Object updateWindScreenSet(@RequestBody WindScreenSetEntity windScreenSetEntity) {
		try {
			windScreenSetMapping.update(windScreenSetEntity);
			return new ResultDto(0, "更新成功");
		} catch (Exception e) {
			return new ResultDto(-1, "更新失败");
		}
	}

	@RequestMapping(value = "/add/evaporativeSet", method = RequestMethod.POST)
	public Object addEvaporativeSet(@RequestBody EvaporativeSetEntity evaporativeSetEntity) {
		if (evaporativeSetMapping.insert(evaporativeSetEntity)) {
			return new ResultDto(0, "添加成功");
		}
		return new ResultDto(-1, "添加失败");
	}

	@RequestMapping(value = "/add/evaporativeWaterSet", method = RequestMethod.POST)
	public Object addEvaporativeWaterSet(@RequestBody EvaporativeWaterSetEntity evaporativeWaterSetEntity) {
		if (evaporativeWaterSetMapping.insert(evaporativeWaterSetEntity)) {
			return new ResultDto(0, "添加成功");
		}
		return new ResultDto(-1, "添加失败");
	}

	@RequestMapping(value = "/add/evaporativeBlowerSet", method = RequestMethod.POST)
	public Object addEvaporativeBlowerSet(@RequestBody EvaporativeBlowerSetEntity evaporativeBlowerSetEntity) {
		if (evaporativeBlowerSetMapping.insert(evaporativeBlowerSetEntity)) {
			return new ResultDto(0, "添加成功");
		}
		return new ResultDto(-1, "添加失败");
	}

	@RequestMapping(value = "/update/plateformDoor", method = RequestMethod.POST)
	@ResponseBody
	public Object updatePlateformDoor(@RequestBody PlatformDoorSetEntity entity) {
		if (platformDoorSetMapping.updateById(entity)) {
			return new ResultDto(0, "更新成功");
		}
		return new ResultDto(-1, "更新失败");
	}

	@RequestMapping(value = "/delete/plateformDoor", method = RequestMethod.DELETE)
	@ResponseBody
	public Object deletePlateformDoor(int id) {
		return deleteById(SetTables.PLATFORMDOORSET.getTable(), id);
	}

	@RequestMapping(value = "/add/platformDoorSet", method = RequestMethod.POST)
	public Object addPlatformDoorSet(@RequestBody PlatformDoorSetEntity platformDoorSetEntity) {
		if (platformDoorSetMapping.insert(platformDoorSetEntity)) {
			return new ResultDto(0, "添加成功");
		}
		return new ResultDto(-1, "添加失败");
	}

	@RequestMapping(value = "/add/coldStorageLightSet", method = RequestMethod.POST)
	public Object addColdStorageLightSet(@RequestBody ColdStorageLightSetEntity coldStorageLightSetEntity) {
		if (coldstorageLightSetMapping.insert(coldStorageLightSetEntity)) {
			return new ResultDto(0, "添加成功");
		}
		return new ResultDto(-1, "添加失败");
	}

	@RequestMapping(value = "/add/forkliftSet", method = RequestMethod.POST)
	public Object addForklift(@RequestBody ForkLiftSetEntity forkLiftSetEntity) {
		if (forkLiftSetMapping.insert(forkLiftSetEntity)) {
			return new ResultDto(0, "添加成功");
		}
		return new ResultDto(-1, "添加失败");
	}

	@RequestMapping(value = "/add/wallSet", method = RequestMethod.POST)
	public Object addWallSet(@RequestBody WallSetEntity wallSet) {
		wallSetDao.insert(wallSet);

		return new ResultDto(0, "添加成功");
	}

	@RequestMapping(value = "/update/wallSet", method = RequestMethod.POST)
	public Object updateWallSet(@RequestBody WallSetEntity wallSet) {
		wallSetDao.update(wallSet);

		return new ResultDto(0, "添加成功");
	}

	@RequestMapping(value = "/find/wallSet", method = RequestMethod.GET)
	@ResponseBody
	public Object findWallSet(int storageId) {
		return wallSetDao.findByStorageId(storageId);
	}

	@RequestMapping(value = "/add/deviceObjectMapping", method = RequestMethod.POST)
	public Object addDeviceObjectMapping(@RequestBody DeviceObjectMappingEntity deviceObjectMappingEntity) {
		Object res = remoteService.insertDeviceObjectMapping(deviceObjectMappingEntity);
		return res;

	}

	@RequestMapping("/getSetTables")
	public Object getStorageType() {
		JsonArray jsonArray = new JsonArray();
		for (SetTables sy : SetTables.values()) {
			JsonObject jsonObject = new JsonObject();
			jsonObject.addProperty("type", sy.getType());
			jsonObject.addProperty("desc", sy.getDesc());
			jsonObject.addProperty("table", sy.getTable());
			jsonArray.add(jsonObject);
		}
		return jsonArray;
	}
}
