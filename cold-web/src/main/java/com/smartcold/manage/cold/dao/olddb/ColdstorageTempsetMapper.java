package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;


public interface ColdstorageTempsetMapper {

	String getColdStorageidByUserId(@Param("rdcId")Integer rdcId,@Param("userId")Integer userId);
}
