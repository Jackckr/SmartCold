package com.smartcold.manage.cold.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.PackMapper;
import com.smartcold.manage.cold.dao.newdb.UsageMapper;
import com.smartcold.manage.cold.dao.newdb.WallMaterialMapper;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.GoodsService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.ExportExcelUtil;
import com.smartcold.manage.cold.util.ResponseData;

@Controller
@RequestMapping(value = "/baseInfo")
public class BaseInfoController extends BaseController {
	
	@Autowired
	private GoodsService goodsService;
	
	@Autowired
	private PackMapper packDao;
	
	@Autowired
	private WallMaterialMapper wallMaterialDao;
	
	@Autowired
	private UsageMapper usageDao;
	
	@Autowired
	private StorageService storageService;
	
	

	@RequestMapping(value = "/findAllGoods", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllGoods(){
		return goodsService.getAllGoods();
	}
	
	@RequestMapping(value = "/findAllPack", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllPack(){
		return packDao.findAll();
	}
	
	@RequestMapping(value = "/findAllWallMaterial", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllWallMaterial(){
		return wallMaterialDao.findAll();
	}
	
	@RequestMapping(value = "/findAllUsage", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllUsage(){
		return usageDao.findAll();
	}
	
	@RequestMapping("/getKeyValueData")
	@ResponseBody
	public Object getKeyValueData(@RequestParam("type")Integer type, @RequestParam("oid")int oid,
			@RequestParam("key")String key,
			@RequestParam(value="nums",defaultValue="480")Integer nums){
		return storageService.findByNums(type, oid, key, nums);
	}
	
	@RequestMapping("/getKeyValueDataByTime")
	@ResponseBody
	public Object getKeyValueDataByTime(@RequestParam("type")Integer type, @RequestParam("oid")int oid,
			@RequestParam("key")String key,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime){
		return storageService.findByTime(type, oid, key, startTime, endTime);
	}
	
	  /**  
     * 计算两个日期之间相差的天数  
     * @param smdate 较小的时间 
     * @param bdate  较大的时间 
     * @return 相差天数 
     * @throws ParseException  
     */    
    public  int daysBetween(Date smdate,Date bdate) 
    {    
        try {
        	SimpleDateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd");  
			smdate=dateFormat.parse(dateFormat.format(smdate));  
			bdate=dateFormat.parse(dateFormat.format(bdate));  
			Calendar cal = Calendar.getInstance();    
			cal.setTime(smdate);    
			long time1 = cal.getTimeInMillis();                 
			cal.setTime(bdate);    
			long time2 = cal.getTimeInMillis();         
			long between_days=(time2-time1)/(1000*3600*24);  
            return Integer.parseInt(String.valueOf(between_days));
		} catch (Exception e) {
			return -1;
		}           
    } 
    
    /**  
     * 计算两个日期之间相差的天数  
     * @param smdate 较小的时间 
     * @param bdate  较大的时间 
     * @return 相差天数 
     * @throws ParseException  
     */    
    public  String getDateFormat(int day) 
    {    
    	System.err.println(day);
	     if(day<=1|day==-1) return "yyyy-MM-dd HH:mm:ss";
	     else if(day<=3) return "yyyy-MM-dd HH:mm";
	     else if(day<=5) return "yyyy-MM-dd HH";
	     else  return "yyyy-MM-dd";
    } 
	
    
	/**
	 * 1. SELECT * FROM `deviceObjectMapping` WHERE `type` = #{type} AND `oid` = #{oid}->deviceid
	 * 
	 * 2. SELECT * FROM storagedatacollection
	    WHERE 1 =1
	    <if test="apid != null">
		    AND `apid` = #{apid} 
	    </if>
	    <if test="deviceid != null">
		    AND `deviceid` = #{deviceid} 
	    </if>
	    <if test="key != null">
		    AND `key` = #{key} 
	    </if>
	    AND time > #{startTime} AND time &lt; #{endTime} 
	    ORDER BY `time` DESC	
	 *
	 * select * from ${table} where `key`=#{key} AND oid=#{oid} AND `addtime` >= #{startTime} AND `addtime` <![CDATA[ < ]]> #{endTime} order by `addtime` desc
	 * 	    select * from ${table} where `key`=#{key} AND oid=#{oid} AND `addtime` >= #{startTime} AND `addtime` <![CDATA[ < ]]> #{endTime} order by `addtime` desc
	 * 
	 * 
	 */
	@RequestMapping("/getKeyValueDataByFilter")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getKeyValueDataByFilter(Integer type,String key,Integer[] oids,String[] onames, String startTime,String endTime){
		try {
			System.err.println(type+"/"+key+"/"+oids+"/"+onames+"/"+startTime+"/"+endTime);
			if(key!=null&&key!=""&&oids!=null&&oids.length>0){
				 SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			        Date sttime=sdf.parse(startTime);  
			        Date edTime=sdf.parse(endTime);  
			        int daysBetween = daysBetween(sttime, edTime);
			        String groupfm=getDateFormat(daysBetween);
			        System.err.println(groupfm);
			        HashMap<String,Object> restData=new HashMap<String, Object>();
			        LinkedList<HashMap<String, Object>> restList=new LinkedList<HashMap<String, Object>>();
			         LinkedList<List<StorageKeyValue>> xtemp=new LinkedList<List<StorageKeyValue>>();
			        int maxsize=0,index=-1;
			        HashMap<String, Object> temp=new LinkedHashMap<String, Object>();
			    	List<Object> maklist=new ArrayList<Object>();
			    	HashMap<String, Object> dttemp=new LinkedHashMap<String, Object>();
			    	temp.put("type", "average");
			    	temp.put("name", "平均值");
			    	maklist.add(temp);
			    	dttemp.put("data", maklist);
			    	
			    	List<Object> mtklist=new ArrayList<Object>();
			    	HashMap<String, Object> rttemp=new LinkedHashMap<String, Object>();
			    	HashMap<String, Object>mttemp=new LinkedHashMap<String, Object>();
			    	mttemp.put("type", "max");
			    	mttemp.put("name", "最大值");
			    	mtklist.add(mttemp);
			    	rttemp.put("data", mtklist);
			        for (int i = 0; i < oids.length; i++) {
			        	HashMap<String, Object> linmap=new HashMap<String, Object>();
			             int oid=	oids[i];String oname=onames[i];		        
			        	 List<StorageKeyValue> datalist = storageService.findByTime(type, oid, key, sttime, edTime);
			        	 if(datalist.size()>maxsize){ index=i; };
			        	 linmap.put("type", "line");
			        	 linmap.put("data", datalist);
			        	 linmap.put("name", oname);
			        	 linmap.put("markLine",dttemp);
			        	 linmap.put("markPoint",rttemp);
			        	 xtemp.add(datalist);
			        	 restList.add(linmap);
					}
			        if(index!=-1){
			        	List<StorageKeyValue> list = xtemp.get(index);
			        	String [] xdt=new String[list.size()];
			        	for (int i = 0; i < list.size(); i++) {
			        		xdt[i]=sdf.format( list.get(i).getAddtime());
						}
			        	restData.put("xdata", xdt);
			        }else{
			        	String [] xdt=new String[daysBetween];
						for (int i = 0; i<daysBetween; i++) {
							Calendar c  = Calendar.getInstance();
							c.add(Calendar.DAY_OF_MONTH,-daysBetween+i);
							xdt[i]=sdf.format(c.getTime());
						}
						restData.put("xdata", xdt);//展示数据
			        }
			        restData.put("ydata", restList);
			        return ResponseData.newSuccess(restData);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping("/expHistoryData")
	public void expHistoryData(HttpServletRequest request,HttpServletResponse response,String filename,String title,Integer type,String key,Integer[] oids,String[] onames, String startTime,String endTime){
		  try {
			 List<List>  alldata=new ArrayList<List>();
			 SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		     Date sttime=sdf.parse(startTime);    Date edTime=sdf.parse(endTime);  
			 String mode[][]={{"数据id","对象","值","时间"},{"id","key","value","addtime"},{"5","5","10","10","10","10"}} ;//标题（必须），对应属性（必须），宽度
			 for (int i = 0; i < oids.length; i++) {
				  int oid=	oids[i];
				 List<StorageKeyValue> datalist = storageService.findByTime(type, oid, key, sttime, edTime);
				 alldata.add(datalist);
			 }
			  ExportExcelUtil.expExcel(response,filename+"_"+title+".xls",title,mode,null,onames, alldata);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}