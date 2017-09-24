package com.smartcold.manage.cold.controller;

import java.io.BufferedOutputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.olddb.UtilMapper;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.enums.SetTables;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.util.ExportExcelUtil;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 360新分析报表
 * 
 * @author MaQiang
 * 
 */
@Controller
@RequestMapping(value = "/AnalysisReportController")
public class AnalysisReportController {
	@Autowired
	private UtilMapper util;
	@Autowired
	private QuantityMapper quantityMapper;
	@Autowired
	private ColdStorageAnalysisService coldStorageAnalysisService;
	
	private final static DecimalFormat dfformat = new DecimalFormat("######0.00");

	private static HashMap<Integer, Object[]> objMap=new HashMap<Integer, Object[]>();

	
//	private void getcolmode(int type,String [] keys){
//		int colmode[][] = null;
//		if (type==1) {
//			colmode = new int[keys.length + 1][];// 初始化跨列集合,进行跨列跨行计算
//			colmode[0] = new int[] { 1, 2, 0, 0 };
//			colmode[1] = new int[] { 2, 1+keys.length, 0, 0 };
////			for (int i = 0; i < keys.length; i++) {
//				for (int j = 0; j < keys.length; j++) {
//					if (j == 0) {
//						newtitlist.add(toptit[i]);
//						colmode[i + 1] = new int[] { 1, 1, i * subtit.length + 1, i * subtit.length + subtit.length };
//					} else {
//						newtitlist.add("");
//					}
//					subtitlist.add(subtit[j]);
//					colmwith.add("5");
//				}
////			}
//		} else {
//			for (String tit : toptit) {
//				newtitlist.add(tit);
//				colmwith.add("5");
//			}
//		}
//	}
	/**
	 * 导出请求。。。
	 * 
	 * @param request
	 * @param response
	 * @param fileName
	 * @param title
	 * @param sid
	 * @param index
	 * @param type
	 */
	@RequestMapping(value = "/expSISAnalysisData")
	@ResponseBody
    @SuppressWarnings("unchecked")
	public void expSISAnalysisData(HttpServletRequest request, HttpServletResponse response, String fileName, Integer index,int type, int keytype,String title, String key, int[] rdcIds,String[] rdcNames, Integer[] unit, Boolean isexpt,String startTime, String endTime ) {
		try {
			
			String[] titls = {};
			Object[] data = getData(index, type, keytype, title, key, rdcIds, rdcNames, unit,  startTime, endTime);
			if((boolean) data[0]){
				if (keytype == 1) {//
					String[] keys  = StringUtil.splitString(key);
					titls = StringUtil.splitfhString(keys[1]);// key标题
				}else{
					titls=new String[]{title};
				}
				ExportExcelUtil.setResponse(response, fileName);// 创建工作博
				SXSSFWorkbook   wb = new SXSSFWorkbook(1000);////内存中保留 1000 条数据，以免内存溢出，其余写入 硬盘  
				CellStyle cellStyleTitle = ExportExcelUtil.getHSSFCellStyle(wb, null);//创建标题样式
				CellStyle cellStyle = ExportExcelUtil.getbodyHSSFCellStyle(wb, null);//创建内容样式
				OutputStream output = response.getOutputStream();
				BufferedOutputStream bufferedOutPut = new BufferedOutputStream(output);
			    
				List<LinkedHashMap<String, Object>> sisdata=(List<LinkedHashMap<String, Object>>) data[1];
				for (int i = 0; i < sisdata.size(); i++) {
						LinkedHashMap<String, Object> rdcdatamap = sisdata.get(i);
					    String rdcNmae=	(String) rdcdatamap.get("name");
					    if((boolean)rdcdatamap.get("hasData")){
					    	
					    	int rowinxe = 0;
							Sheet sheet = wb.createSheet(rdcNmae); //创建sheet
							for (int k = 0;k < titls.length+1; k++) {
								sheet.setColumnWidth(k, 7000);//设置栏位宽度
							}
							
							LinkedHashMap<String, Object> rdcsisdata=	 (LinkedHashMap<String, Object>) rdcdatamap.get("data");
							for (Object key_a : rdcsisdata.keySet()) {
					    		LinkedHashMap< Object, Object> subsisMap=(LinkedHashMap<Object, Object>) rdcsisdata.get(key_a);
					    		ItemValue itemValue =(ItemValue) subsisMap.get("obj");
					    		// -------------------------------------------------------------
								Row newrow = sheet.createRow(rowinxe);// 创建第一行 rowinxe=1;
								Cell cell1 = newrow.createCell(0);
								cell1.setCellStyle(cellStyleTitle);
								cell1.setCellValue(new XSSFRichTextString(itemValue.getName()+title));
								sheet.addMergedRegion(new CellRangeAddress(rowinxe, rowinxe, 0, titls.length));
								for (int j = 1; j <titls.length+1; j++) {
									 cell1 = newrow.createCell(j);
									 cell1.setCellStyle(cellStyleTitle);
								}
								
								
								rowinxe++;
								//====================================
							   newrow = sheet.createRow(rowinxe);// 创建第一行 rowinxe=1;
								cell1 = newrow.createCell(0);
								cell1.setCellStyle(cellStyleTitle);
								cell1.setCellValue(new XSSFRichTextString("日期"));
//								sheet.addMergedRegion(new CellRangeAddress(rowinxe, 0, 0, titls.length));
								for (int n = 0; n < titls.length; n++) {
									cell1 = newrow.createCell(1+n);
									cell1.setCellStyle(cellStyleTitle);
									cell1.setCellValue(new XSSFRichTextString(titls[n]));
								}
								//====================================标题创建完成===========================
					    		if((boolean)subsisMap.get("hasData")){
					    				LinkedHashMap<String, Object[]> tempData=(LinkedHashMap<String, Object[]>) subsisMap.get("data");
					    				for (String key_c : tempData.keySet()) {
					    					 rowinxe++;
					    					  newrow = sheet.createRow(rowinxe);// 创建第一行 rowinxe=1;
					    					  cell1 = newrow.createCell(0);
											cell1.setCellStyle(cellStyle);
											cell1.setCellValue(new XSSFRichTextString(key_c));
					    					Object[] objects = tempData.get(key_c);
					    					for (int j = 0; j < objects.length; j++) {
					    						cell1 = newrow.createCell(j+1);
												cell1.setCellStyle(cellStyle);
												cell1.setCellValue(new XSSFRichTextString(objects[j]+""));
											}
					    			}
					    		}
					    		 rowinxe+=4;//拉开间隔
							 }
					    }else{//没有配置
					    	
					    	
					    }
					}

				bufferedOutPut.flush();
				wb.write(bufferedOutPut);
				bufferedOutPut.close();
				System.gc();
				
			}else{
//				return ResponseData.newFailure((String)data[1]);
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	


	/**
	 * 创建数据
	 * 
	 * @param wb
	 * @param cellStyleTitle
	 * @param cellStyle
	 * @param title
	 * @param shetName
	 * @param mode
	 * @param list
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public  void createHSSFSheet(SXSSFWorkbook wb,CellStyle cellStyleTitle, CellStyle cellStyle,String title, String shetName, String mode[][], int[][] colmode, List list,int [] progress) {
		int rowinxe = 1;
		boolean isprogress=progress!=null;
		Sheet sheet = wb.createSheet(title); // 创建报表头部
		ExportExcelUtil.createNormalHead(sheet, wb, title, mode[0].length - 1); // 定义第一行
		if (mode.length >= 3) {// 设定每列宽度
			for (int i = 0; i < mode[2].length; i++) {
				sheet.setColumnWidth(i, Integer.parseInt(mode[2][i]) * 1000);
			}
		}
		Row newrow = sheet.createRow(rowinxe);// 创建第一行 rowinxe=1;
		Cell cell1 = newrow.createCell(0);

		// -------------------------------------------------------------
		String titmode[] = mode[0];
		cell1.setCellStyle(cellStyleTitle);
		cell1.setCellValue(new XSSFRichTextString(titmode[0]));
		for (int i = 1; i < titmode.length; i++) {
			cell1 = newrow.createCell(i);
			cell1.setCellStyle(cellStyleTitle);
			cell1.setCellValue(new XSSFRichTextString(titmode[i]));
		}
		if (colmode != null && mode.length >= 4) {// 支持子标题
			++rowinxe;
			titmode = mode[3];// 获得子标题
			newrow = sheet.createRow(rowinxe);// 创建第一行 rowinxe=1;
			for (int i = 0; i < titmode.length; i++) {
				cell1 = newrow.createCell(i);
				cell1.setCellStyle(cellStyleTitle);
				cell1.setCellValue(new XSSFRichTextString(titmode[i]));
			}
			for (int[] climod : colmode) {// 进行跨行跨列操作
				sheet.addMergedRegion(new CellRangeAddress((short) climod[0], (short) climod[1], (short) climod[2],
						(short) climod[3]));
			}
		}
		++rowinxe;
		// 定义第二行
		Row row = sheet.createRow(rowinxe);
		Cell cell = row.createCell(1);
		if (SetUtil.isnotNullList(list)) {
			String datamode[] = mode[1];
			if (list.size() > 1048575) {list=list.subList(0, 1048574);} // 防止数据溢出
			for (int i = 0; i < list.size(); i++) { //  1663132
				if(isprogress&&i!=0&&i%10000==0){
						double pr= new Double(progress[1]+1)/new Double(progress[2])*new Double(i)/list.size()*100;
						if(pr==100){pr=98;}
						ExportExcelUtil.EXPPROGRESS.put(progress[0], pr);
						
				}
				Object object = list.get(i);
				row = sheet.createRow(i + rowinxe);
				if (object instanceof List) {
					List<String> data = (List<String>) object;
					for (int j = 0; j < data.size(); j++) {
						cell = row.createCell(j);
						cell.setCellStyle(cellStyle);
						Object da = data.get(j);
						String val = "";
						if (da != null) {
							if (da instanceof Double) {
								val = Double.toString((Double) da);
							} else {
								val = da.toString();
							}
						}
						cell.setCellValue(new XSSFRichTextString(val));
					}
				} else {
					for (int j = 0; j < datamode.length; j++) {
						cell = row.createCell(j);
						cell.setCellStyle(cellStyle);
						cell.setCellValue(new XSSFRichTextString(ExportExcelUtil.getFieldValueByName(datamode[j], object)));
					}
				}
			}
		} else {
			row = sheet.createRow(rowinxe);
			cell = row.createCell(0);
			cell.setCellStyle(cellStyleTitle);
			cell.setCellValue(new XSSFRichTextString("没有数据！"));
			for (int i = 1; i < mode[0].length; i++) {
				cell1 = row.createCell(i);
				cell1.setCellStyle(cellStyleTitle);
				cell1.setCellValue(new XSSFRichTextString(""));
			}
			sheet.addMergedRegion(new CellRangeAddress(rowinxe, rowinxe, 0, mode[0].length - 1));
		}
	}
	
	/**
	 * 报表分析 支持多key
	 * 
	 * @param type
	 *            :数据类型->StorageType->type: 1,10,3,2,1,4,-1,1,5
	 * @param keytype
	 *            : ->0 单key 1 :多key
	 * @param rdcIds
	 *            :
	 * @param rdcNames
	 *            :
	 * @param unit
	 *            :
	 * @param key
	 *            :采集数据
	 * @param isexpt
	 *            :导出
	 * @param startTime
	 *            :开始时间
	 * @param endTime
	 *            :结束数据
	 * @return index:$scope.slindex,urlid
	 */
	@RequestMapping(value = "/getSisDataByRdc")
	@ResponseBody
	public ResponseData<Object> getCasesTotalSISAnalysis(HttpServletRequest request, HttpServletResponse response,Integer index,int type, int keytype,String title, String key, int[] rdcIds,String[] rdcNames, Integer[] unit, String startTime, String endTime) {
			Object[] data = getData(index, type, keytype, title, key, rdcIds, rdcNames, unit,  startTime, endTime);
			if((boolean) data[0]){
				return ResponseData.newSuccess(data[1]);
			}else{
				return ResponseData.newFailure((String)data[1]);
			}
	}
	
	private Object[] getData(Integer index,int type, int keytype,String title, String key, int[] rdcIds,String[] rdcNames, Integer[] unit, String startTime, String endTime) {
		try {
			List<LinkedHashMap<String, Object>> sisDataList=new ArrayList<LinkedHashMap<String, Object>>();
			if (rdcIds == null|| rdcNames == null || StringUtil.isNull(key)) {	return new Object[]{false,"非法请求"};}
			boolean isunit = false;
			String[] keys = {}, keyts = {}, titls = {};
			HashMap<String, Integer> keymap = new HashMap<String, Integer>();
			if (keytype == 1) {//
				keys = StringUtil.splitString(key);
				if (keys.length != 2) {
					return new Object[]{false,"非法请求！key参数不完整"};
				}
				keyts = StringUtil.splitfhString(keys[0]);// 主key
				titls = StringUtil.splitfhString(keys[1]);// key标题
				if (keyts.length != titls.length) {
					return new Object[]{false,"非法请求！key参数不完整"};
				}
				for (int i = 0; i < keyts.length; i++) {
					keymap.put(keyts[i].replace("'", ""), i);
				}
				if (unit != null && unit.length == keyts.length) {
					isunit = true;
				}// 判断是否进行单位转换
			}else{
				keys=new String[]{key};
				keymap.put(key.replace("'", ""), 0);
			}
			for (int i = 0; i < rdcIds.length; i++) {//RDC
				if(index==6){//处理系统效率
					sisDataList.add(this.getQEAnalysis(rdcIds[i],rdcNames[i], title, startTime, endTime));
				}else{
					sisDataList.add(this.getsisData(type, rdcIds[i], rdcNames[i], title, keytype, keys[0], keymap, isunit, unit, startTime, endTime));
				}
			}
			return new Object[]{true,sisDataList};
		} catch (Exception e) {
			e.printStackTrace();
		}
		 return new Object[]{false,"配置异常！"};
	}
	
	
	private LinkedHashMap<String, Object> getsisData(int type, int rdcid,String rdcname,String title,int keytype,String keys,HashMap<String, Integer> keymap,boolean isunit,Integer[] unit,String startTime, String endTime){
		LinkedHashMap<String, Object> rdcobj =new LinkedHashMap<String, Object>();
		rdcobj.put("id",  rdcid);
		rdcobj.put("name", rdcname);
		List<ItemValue> itemList = getItemList( type, rdcid);
		if (SetUtil.isnotNullList(itemList)) {
			LinkedHashMap< Object, Object> alllsisMap =new LinkedHashMap<Object, Object>();
			for (ItemValue itemValue : itemList) {//子对象-->冷库
				LinkedHashMap< Object, Object> subsisMap =new LinkedHashMap<Object, Object>();
				Object sisdata = getRdcData(type, itemValue.getId(),keys,keymap, isunit, unit, startTime, endTime);//keys[0]
				subsisMap.put("obj", itemValue);
				subsisMap.put("data", sisdata);
				subsisMap.put("hasData", sisdata==null?false:true);
				subsisMap.put("msge", sisdata==null?"没有查询到数据！":null);
				alllsisMap.put(itemValue.getId(), subsisMap);
			}
			rdcobj.put("data", alllsisMap);
			rdcobj.put("hasData", true);
		}else {
			rdcobj.put("hasData", false);
			rdcobj.put("data", null);
			rdcobj.put("errmsg", "没有"+title+"相关配置！");
		}
		return rdcobj;
		
		
	}

	
	
	@RequestMapping(value = "/getOidAnsis")
	@ResponseBody
	public Object getOidAnsis(int type,int keytype,int oid,String key, boolean isunit ,Integer[] unit,String startTime, String endTime) {
		String[] keys = {}, keyts = {}, titls = {};
		HashMap<String, Integer> keymap = new HashMap<String, Integer>();
		if (keytype == 1) {//
			keys = StringUtil.splitString(key);
			if (keys.length != 2) {
				return  ResponseData.newFailure("非法请求！key参数不完整");
			}
			keyts = StringUtil.splitfhString(keys[0]);// 主key
			titls = StringUtil.splitfhString(keys[1]);// key标题
			if (keyts.length != titls.length) {
				return  ResponseData.newFailure("非法请求！key参数不完整");
			}
			for (int i = 0; i < keyts.length; i++) {
				keymap.put(keyts[i].replace("'", ""), i);
			}
			if (unit != null && unit.length == keyts.length) {
				isunit = true;
			}// 判断是否进行单位转换
		}else{
			keys=new String[]{key};
			keymap.put(key.replace("'", ""), 0);
		}
		 Object rdcData = getRdcData(type, oid, keys[0], keymap, isunit, unit, startTime, endTime);
		 if(rdcData!=null){return ResponseData.newSuccess(rdcData);}else{return ResponseData.newFailure("没有查询到数据！");}
	}
	/**
	 * 考虑使用多线程
	 * 
	 * @return
	 */
	private Object getRdcData(int type,int oid,String keys,HashMap<String, Integer> keymap , boolean isunit ,Integer[] unit,String startTime, String endTime) {
		HashMap<String, Object> fileter = new HashMap<String, Object>();
		fileter.put("type", type);
		fileter.put("oid", oid);
		fileter.put("key",  keys );
		fileter.put("desc", null);
		fileter.put("startTime", startTime);
		fileter.put("endTime", endTime);
		List<ColdStorageAnalysisEntity> datalist = this.coldStorageAnalysisService.findValueByFilter(fileter);
		LinkedHashMap<String, Object[]> tempData = new LinkedHashMap<String, Object[]>();
		if (SetUtil.isnotNullList(datalist)) {
			Object[] objects = null;
			for (ColdStorageAnalysisEntity coldsis : datalist) {// 2
				String data = TimeUtil.getFormatDate(coldsis.getDate());
				int keyindex = keymap.get(coldsis.getKey());
				if (tempData.containsKey(data)) {
					objects = tempData.get(data);
				} else {
					objects = getObj(keymap.size());
				}
				double value =  Double.parseDouble(dfformat.format(coldsis.getValue()));//、= Double.parseDouble(dfformat.format(value / unit[keyindex]));
				if (isunit) {
					value = Double.parseDouble(dfformat.format(value / unit[keyindex]));
				} // 单位转换
				objects[keyindex] = value;
				tempData.put(data, objects);
			}
			return tempData;
		}
        return null;
	}


	
	
	
	

	
	private Object[]  getObj(int seize){
		if(objMap.containsKey(seize)){return objMap.get(seize).clone();}
		Object[] objects =new Object[seize];
		for (int i = 0; i < seize; i++) {objects[i]=0;}
		objMap.put(seize, objects.clone());
		return objects;
	}
	
	
	private List<ItemValue>  getItemList(int type,int redcid){
		switch (type) {
		case 4://风机数据->冷库->风机
			return util.findSObjByRdcId(SetTables.STORAGESET.getTable(),SetTables.BLOWERSET.getTable(),"coldstorageid",redcid);
		case 5://风机数据->冷库->风机
			return util.findSObjByRdcId(SetTables.COMPRESSORGROUPSET.getTable(),SetTables.COMPRESSORSET.getTable(),"compressorgroupid",redcid);
		default:
			return util.findObjByRdcId(SetTables.getByType(type).getTable(), redcid);
		}
		
	}
	
	
	
	private LinkedHashMap<String, Object> getQEAnalysis(Integer rdcId,String rdcNmae,String title,String startTime, String endTime) {
		try {
			LinkedHashMap<String, Object> restMap = new LinkedHashMap<String, Object>();
			restMap.put("id",  rdcId);
			restMap.put("name", rdcNmae);
			List<HashMap<String, Object>> sumElist = this.quantityMapper.getsumEByRdcid(rdcId, startTime,endTime);
			List<HashMap<String, Object>> sumQlist = this.quantityMapper.getsumQByRdcid(rdcId, startTime,endTime);
			if(SetUtil.isnotNullList(sumElist)&&SetUtil.isnotNullList(sumQlist)){
				HashMap<Date,Double > QMap=new HashMap<Date, Double>();
				LinkedHashMap<String, Object> bojdata = new LinkedHashMap<String, Object>();
				LinkedHashMap<String, Object> pbojdata = new LinkedHashMap<String, Object>();
				LinkedHashMap<Date, Object[]> tempData = new LinkedHashMap<Date, Object[]>();
				for (HashMap<String, Object> hashMap : sumQlist) { QMap.put((Date) hashMap.get("date"),  (Double) hashMap.get("sumq")); }
				for (HashMap<String, Object> hashMap : sumElist) { 
					Date date=(Date) hashMap.get("date");
					Double cutteQ = QMap.get(date);
					if(cutteQ==null){cutteQ=new Double(0);}
					Object[] objects = {Double.parseDouble(dfformat.format(cutteQ/ (Double) hashMap.get("sume")))};
					tempData.put(date,objects );
			    }
				bojdata.put("hasData", true);
				bojdata.put("obj",new ItemValue(1,"系统效率",0));
				bojdata.put("data", tempData)	;
				pbojdata.put("1", bojdata);
				restMap.put("data", pbojdata);
			}else{
				restMap.put("hasData", false);
				restMap.put("errmsg", SetUtil.isNullList(sumElist)?"没有查询到电表采集的数据!请检查电表配置！":"没有查询到热量采集数据!请检查AP配置！");
			}
			return restMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
}
