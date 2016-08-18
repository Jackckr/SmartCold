package com.smartcold.bgzigbee.manage.enums;

/**
 * Created by corly on 16-8-13.
 */
public enum SetTables {
    STORAGESET(1,  "coldstorageset",  "冷库"),

    DOORSET(2,  "coldstoragedoorset",  "冷库门"),

    COMPRESSORGROUPSET(3,  "compressorgroupset",  "压缩机组"),

    BLOWERSET(4,  "blowerset",  "风机"),

    COMPRESSORSET(5,  "compressorset",  "压缩机"),

    WINDSCREENSET(6,  "windscreenset",  "风幕机"),

    EVAPORATIVESET(7,  "evaporativeset",  "蒸发冷系统"),

    EVAPORATIVEWATERSET(8,  "evaporativewaterset",  "蒸发冷水泵系统"),

    EVAPORATIVEBLOWERSET(9,  "evaporativeblowerset",  "蒸发冷风机系统"),

    POWERSET(10,  "powerset",  "电表"),

    PLATFORMDOORSET(11,  "platformdoorset",  "月台门"),

    PRESSUREPLATFORMSET(12,  "pressureplatformset",  "液压平台"),

    CHARGINGPILESET(13,  "chargingpileset",  "充电桩"),

    FORKLIFTSET(14,  "forkliftset",  "叉车"),

    COLDSTORAGELIGHTSET(15,  "coldstoragelightset",  "灯组"),

    CIRCULATINGPUMPSET(16,  "circulatingpumpset",  "防冻循环泵");

    private int type;
    private String table;
    private String desc;

    private SetTables(int type, String table, String desc) {
        this.type = type;
        this.table = table;
        this.desc = desc;
    }

    public static SetTables getByType(int type){
        for (SetTables item : SetTables.values()) {
            if (item.type == type)
                return item;
        }
        throw new IllegalArgumentException("invalid type");
    }

    public static boolean checkTable(String table){
        for (SetTables item : SetTables.values()) {
            if (item.table.equals(table))
                return true;
        }
        throw new IllegalArgumentException("invalide table name");
    }

    public String getTable() {
        return table;
    }
}
