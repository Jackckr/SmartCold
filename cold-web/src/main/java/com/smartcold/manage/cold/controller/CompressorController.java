package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.olddb.CompressorSetMapping;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by corly on 16-8-13.
 */
@Controller
@RequestMapping("/compressor")
@ResponseBody
public class CompressorController {

    @Autowired
    private CompressorSetMapping compressorSetMapping;
    @Autowired
    private StorageService storageService;

    @RequestMapping("/findLoad")
    public Object findLoad(int groupId,
			@RequestParam(value="nums",defaultValue="1")Integer nums){
        List<CompressorSetEntity> compressorSetEntities = compressorSetMapping.findCompressorByGroupid(groupId);
        Map<String, List<StorageKeyValue>> result = new HashMap<String, List<StorageKeyValue>>();
        StorageType stype = StorageType.COMPRESSOR;
        for (int i = 0; i < compressorSetEntities.size(); i++) {
            result.put("compressor"+(i+1),storageService.findByNums(stype, compressorSetEntities.get(i).getId(), "Load", nums));

        }
        return result;
    }
}
