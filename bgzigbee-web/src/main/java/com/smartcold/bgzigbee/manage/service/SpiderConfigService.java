package com.smartcold.bgzigbee.manage.service;

import com.smartcold.bgzigbee.manage.dto.ColumnDescDTO;

import java.util.List;
import java.util.Map;

/**
 * Created by corly on 16-8-16.
 */
public interface SpiderConfigService {
    Map<String, List<ColumnDescDTO>> getSetTableFileds();
}
