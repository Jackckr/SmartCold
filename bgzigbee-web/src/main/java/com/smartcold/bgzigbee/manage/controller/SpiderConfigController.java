package com.smartcold.bgzigbee.manage.controller;

import com.csvreader.CsvReader;
import com.smartcold.bgzigbee.manage.entity.*;
import org.apache.commons.io.FileUtils;
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
import com.smartcold.bgzigbee.manage.dao.PowerSetMapping;
import com.smartcold.bgzigbee.manage.dao.PressurePlatformSetMapping;
import com.smartcold.bgzigbee.manage.dao.RdcWeightSetMapper;
import com.smartcold.bgzigbee.manage.dao.SetTableMapper;
import com.smartcold.bgzigbee.manage.dao.TempSetMapper;
import com.smartcold.bgzigbee.manage.dao.WallSetMapper;
import com.smartcold.bgzigbee.manage.dao.WindScreenSetMapping;
import com.smartcold.bgzigbee.manage.dto.RdcIdAndNameDTO;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.dto.UpdateMappingDTO;
import com.smartcold.bgzigbee.manage.enums.SetTables;
import com.smartcold.bgzigbee.manage.service.SpiderConfigService;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

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
    private TempSetMapper tempSetMapper;

    @Autowired
    private SpiderConfigService spiderConfigService;

    @Autowired
    private WindScreenSetMapping windScreenSetMapping;

    @Autowired
    private PowerSetMapping powerSetMapping;

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
    private RdcWeightSetMapper rdcWeightSetMapper;
//	@Autowired
//	private RemoteService remoteService;

    @Autowired
    private PressurePlatformSetMapping platformDao;

    @RequestMapping(value = "/addRdcWeight", method = RequestMethod.POST)
    public Object addRdcWeight(@RequestBody RDCWeightSetEntity rdcWeightSetEntity) {
        try {
            rdcWeightSetMapper.insertRdcWeight(rdcWeightSetEntity);
            return findRdcWeight(rdcWeightSetEntity.getRdcid());
        } catch (Exception e) {
            return new ResultDto(-1, "保存失败");
        }
    }

    @RequestMapping("/findRdcWeight")
    public Object findRdcWeight(int rdcid) {
        RDCWeightSetEntity rdcWeightSetEntity = rdcWeightSetMapper.findRdcWeightSetByRdcId(rdcid);
        return rdcWeightSetEntity;
    }

    @RequestMapping(value = "/delRdcWeight", method = RequestMethod.DELETE)
    public Object delRdcWeight(int id) {
        try {
            rdcWeightSetMapper.deleteRdcWeight(id);
            return new ResultDto(0, "删除成功");
        } catch (Exception e) {
            return new ResultDto(-1, "删除失败");
        }
    }

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

    // 删除液压平台
    @RequestMapping(value = "/delete/deletePressureplfmById", method = RequestMethod.DELETE)
    public Object deletePressureplfmById(Integer id) {
        if (id == null)
            return new ResultDto(-1, "删除失败！");
        if (setTableMapper.deleteById("pressureplatformset", id)) {
            return new ResultDto(0, "删除成功");
        }
        return new ResultDto(-1, "删除失败");
    }

    // 更新液压平台
    @RequestMapping(value = "/update/updatePressureplfmSet", method = RequestMethod.POST)
    public Object updatePressureplfmSet(@RequestBody PressurePlatformSetEntity obj) {
        try {
            platformDao.update(obj);
            return new ResultDto(0, "更新成功");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResultDto(-1, "更新失败");
    }

    // 删除充电桩
    @RequestMapping(value = "/delete/deleteChargingpilesetById", method = RequestMethod.DELETE)
    public Object deleteChargingpilesetById(Integer id) {
        if (id == null)
            return new ResultDto(-1, "删除失败！");
        if (setTableMapper.deleteById("chargingpileset", id)) {
            return new ResultDto(0, "删除成功");
        }
        return new ResultDto(-1, "删除失败");
    }

    // 更新充电桩
    @RequestMapping(value = "/update/updateChargingpileset", method = RequestMethod.POST)
    public Object updateChargingpileset(@RequestBody ChargingPileSetEntity obj) {
        try {
            if (setTableMapper.updateObj("chargingpileset", obj.getId(), obj.getName(), obj.getPower())) {
                return new ResultDto(0, "更新成功");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResultDto(-1, "更新失败");
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

//	@RequestMapping(value = "/del/deviceObjectMapping", method = RequestMethod.DELETE)
//	public Object delDeviceObjectMapping(int id) {
//		return remoteService.delDeviceObjectMappingById(id);
//	}

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


    //添加温度设置
    @RequestMapping(value = "/add/tempset", method = RequestMethod.POST)
    public Object addtempset(@RequestBody TempSetEntity temp) {
        if (this.tempSetMapper.addTempSet(temp)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping("/find/findTempSetByStorageId")
    public Object findTempSetByStorageId(int storageId) {
        if (storageId == 0) {
            return null;
        }
        return this.tempSetMapper.findTempSetByStorageId(storageId);
    }


    @RequestMapping(value = "/add/windscreenset", method = RequestMethod.POST)
    public Object addWindScreenSet(@RequestBody WindScreenSetEntity windScreenSetEntity) {
        if (windScreenSetMapping.insert(windScreenSetEntity)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/delete/coldStorageLightSet", method = RequestMethod.DELETE)
    public Object deletecoldStorageLightSet(int id) {
        try {
            coldstorageLightSetMapping.delete(id);
            return new ResultDto(0, "删除成功");
        } catch (Exception e) {
            return new ResultDto(-1, "删除失败");
        }
    }

    @RequestMapping(value = "/update/coldStorageLightSet", method = RequestMethod.POST)
    public Object updatecoldStorageLightSet(@RequestBody ColdStorageLightSetEntity coldStorageLightSetEntity) {
        try {
            coldstorageLightSetMapping.update(coldStorageLightSetEntity);
            return new ResultDto(0, "更新成功");
        } catch (Exception e) {
            return new ResultDto(-1, "更新失败");
        }
    }

    @RequestMapping(value = "/delete/forkliftSet", method = RequestMethod.DELETE)
    public Object deleteforkliftSet(int id) {
        try {
            forkLiftSetMapping.delete(id);
            return new ResultDto(0, "删除成功");
        } catch (Exception e) {
            return new ResultDto(-1, "删除失败");
        }
    }

    @RequestMapping(value = "/update/forkliftSet", method = RequestMethod.POST)
    public Object updateforkliftSet(@RequestBody ForkLiftSetEntity forkliftSetEntity) {
        try {
            forkLiftSetMapping.update(forkliftSetEntity);
            return new ResultDto(0, "更新成功");
        } catch (Exception e) {
            return new ResultDto(-1, "更新失败");
        }
    }

    @RequestMapping(value = "/delete/powerSet", method = RequestMethod.DELETE)
    public Object deletepowerSet(int id) {
        try {
            powerSetMapping.delete(id);
            return new ResultDto(0, "删除成功");
        } catch (Exception e) {
            return new ResultDto(-1, "删除失败");
        }
    }

    @RequestMapping(value = "/update/powerSet", method = RequestMethod.POST)
    public Object updatepowerSet(@RequestBody PowerSetEntity powerSetEntity) {
        try {
            powerSetMapping.update(powerSetEntity);
            return new ResultDto(0, "更新成功");
        } catch (Exception e) {
            return new ResultDto(-1, "更新失败");
        }
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

    @RequestMapping(value = "/delete/wallSet", method = RequestMethod.DELETE)
    public Object deletewallSet(int id) {
        try {
            wallSetDao.delete(id);
            return new ResultDto(0, "删除成功");
        } catch (Exception e) {
            return new ResultDto(-1, "删除失败");
        }
    }

    @RequestMapping(value = "/update/wallSet", method = RequestMethod.POST)
    public Object updateWallSet(@RequestBody WallSetEntity wallSet) {
        wallSetDao.update(wallSet);

        return new ResultDto(0, "更新成功");
    }

    @RequestMapping(value = "/find/wallSet", method = RequestMethod.GET)
    @ResponseBody
    public Object findWallSet(int storageId) {
        return wallSetDao.findByStorageId(storageId);
    }

    @RequestMapping(value = "/importRdcSpider")
    @ResponseBody
    public Object importRdcSpider(HttpServletRequest request, MultipartFile xlsFile) throws IOException {
        HttpSession session = request.getSession();
        AdminEntity admin = (AdminEntity) session.getAttribute("admin");
        String fileName = String.format("%s_%s.%s", admin.getId(), new Date().getTime(), "csv");
        String path = session.getServletContext().getRealPath("temp/");
        File targetFile = new File(path + fileName);
        session.setAttribute("csvFilePath", path + fileName);
        FileUtils.copyInputStreamToFile(xlsFile.getInputStream(), targetFile);
        // 用来保存数据
        ArrayList<String[]> csvFileList = new ArrayList<String[]>();
        InputStream inputStream = xlsFile.getInputStream();
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "gbk");
        CsvReader reader = new CsvReader(inputStreamReader, ',');
        // 逐行读入除表头的数据
        while (reader.readRecord()) {
            csvFileList.add(reader.getValues());
        }
        reader.close();
        List<Object> dataPackage = new ArrayList<Object>();
        // 遍历读取的CSV文件
        for (int row = 0; row < csvFileList.size(); row++) {
            // 取得第row行第0列的数据
            String[] cell = csvFileList.get(row);
            if (row == 0) {
                for (int i = 0; i < cell.length; i++) {
                    HashMap<String, String> map = new HashMap<String, String>();
                    map.put("nameId", "" + i);
                    map.put("name", cell[i]);
                    dataPackage.add(map);
                }
            }
        }
        return dataPackage;
    }

    @RequestMapping(value = "/loadRdcSpider")
    @ResponseBody
    public Object loadRdcSpider(HttpServletRequest request, int nameId, int dataId) throws IOException {
        HttpSession session = request.getSession();
        List<Object> dataPackage = new ArrayList<Object>();
        String csvFilePath = session.getAttribute("csvFilePath").toString();
        // 用来保存数据
        ArrayList<String[]> csvFileList = new ArrayList<String[]>();
        // 创建CSV读对象 例如:CsvReader(文件路径，分隔符，编码格式);
        CsvReader reader = new CsvReader(csvFilePath, ',', Charset.forName("gbk"));
        // 逐行读入除表头的数据
        while (reader.readRecord()) {
            csvFileList.add(reader.getValues());
        }
        reader.close();
        String[] names = new String[csvFileList.size() - 1];
        String[] dataTypes = new String[csvFileList.size() - 1];
        String[] isReader = new String[csvFileList.size() - 1];
        for (int row = 0; row < csvFileList.size(); row++) {
            // 取得第row行第0列的数据
            String[] cell = csvFileList.get(row);
            if (row != 0) {
                names[row - 1] = cell[nameId];
                if(cell[dataId].split(" ").length<13){
                    dataTypes[row-1]="";
                    isReader[row-1]="";
                }else {
                    dataTypes[row-1]=cell[dataId].split(" ")[9];
                    isReader[row-1]=cell[dataId].split(" ")[2];
                }
            }
        }
        for(int i=0;i<csvFileList.size()-1;i++){
            HashMap<String, String> map = new HashMap<String, String>();
            map.put("name",names[i]);
            map.put("isReader",isReader[i]);
            map.put("dataType",dataTypes[i]);
            dataPackage.add(map);
        }
        return dataPackage;
    }


//	@RequestMapping(value = "/add/deviceObjectMapping", method = RequestMethod.POST)
//	public Object addDeviceObjectMapping(@RequestBody DeviceObjectMappingEntity deviceObjectMappingEntity) {
//		Object res = remoteService.insertDeviceObjectMapping(deviceObjectMappingEntity);
//		return res;
//	}

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
