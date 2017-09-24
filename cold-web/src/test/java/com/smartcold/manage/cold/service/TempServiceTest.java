
package com.smartcold.manage.cold.service;

import java.util.HashMap;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;


/**
 * Author:maqiang34
 * Date: maqiang34
 */

@Transactional(rollbackFor = Exception.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:config/spring/local/appcontext*.xml"})
public class TempServiceTest {

	@Autowired
	private RdcMapper rdcMapper;
	
	//推送人缓存
	public static HashMap<Integer, String[]> rdcCacheHashMap=new HashMap<>(); 
	@Test
    public void pushTest(){
//		String[] rdcName = getRdcName(1063);
//		if(rdcName==null){return;}
//		System.err.println(rdcName);
		HashMap<String, Object> stringObjectHashMap = new HashMap<>();
		stringObjectHashMap.put("token",StringUtil.getToken());//超温时长
		stringObjectHashMap.put("userIds","1");//发送对象---？
		stringObjectHashMap.put("rdcid",1063);//rdc -跳转
		stringObjectHashMap.put("rdcName","合肥老母鸡");//--rdc名称 ？？
		stringObjectHashMap.put("coldStorageName","冷库1");
		stringObjectHashMap.put("basTemp",-18);
		stringObjectHashMap.put("diffTemp",4);
		stringObjectHashMap.put("overTemp",5);//
		stringObjectHashMap.put("starttime","2017-9-23 10:54:13");//开始时间
		stringObjectHashMap.put("ovtTempTime",30);//超温时长
		try {
			RemoteUtil.httpPost("http://127.0.0.1:8080/i/warning/waringNotice",stringObjectHashMap);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

    private String [] getRdcName(Integer rdcId){
		if(rdcCacheHashMap.containsKey(rdcId)){
			return rdcCacheHashMap.get(rdcId);
		}else{
			String rdcName = rdcMapper.getRdcName(rdcId);
			if(StringUtil.isNull(rdcName)){
				rdcCacheHashMap.put(rdcId, null);
				return null;
			}
			List<Integer> rdcMangerUID = rdcMapper.getRdcMangerUID(rdcId);	
			if(SetUtil.isnotNullList(rdcMangerUID)){
			     String rdcinfo[]=   new String[]{ rdcName,SetUtil.listtoString(rdcMangerUID)}	;
				rdcCacheHashMap.put(rdcId, rdcinfo);
				return rdcinfo;
			}
			rdcCacheHashMap.put(rdcId, null);
			return null;
		}
	}


}
