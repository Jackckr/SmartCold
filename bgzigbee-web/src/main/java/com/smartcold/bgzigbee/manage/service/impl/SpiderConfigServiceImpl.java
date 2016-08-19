package com.smartcold.bgzigbee.manage.service.impl;

import com.smartcold.bgzigbee.manage.dao.SetTableMapper;
import com.smartcold.bgzigbee.manage.dto.ColumnDescDTO;
import com.smartcold.bgzigbee.manage.enums.SetTables;
import com.smartcold.bgzigbee.manage.service.SpiderConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by corly on 16-8-16.
 */
@Service
public class SpiderConfigServiceImpl implements SpiderConfigService{

    @Autowired
    private SetTableMapper setTableMapper;

    @Override
    public Map<String, List<ColumnDescDTO>> getSetTableFileds() {
        Map<String, List<ColumnDescDTO>> result = new HashMap<String, List<ColumnDescDTO>>();
        for (SetTables setTable : SetTables.values()) {
            String tableName = setTable.getTable();
            List<ColumnDescDTO> fields = setTableMapper.findFiledsAndComment(tableName);
            List<ColumnDescDTO> pub = new ArrayList<ColumnDescDTO>();
            for (ColumnDescDTO field : fields) {
                // 去除与 id 有关的 field 和 mapping
                if (field.getField().toLowerCase().lastIndexOf("id")+2 != field.getField().length() && !field.getField().equals("mapping")){
                    pub.add(new ColumnDescDTO(field.getField(), field.getComment()));
                }
            }
            result.put(tableName.substring(0,tableName.length()-3), pub);
        }
        return result;
    }
}
