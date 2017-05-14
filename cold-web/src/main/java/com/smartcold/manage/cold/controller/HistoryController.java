package com.smartcold.manage.cold.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.TaskMapper;
import com.smartcold.manage.cold.dao.olddb.TempSetMapper;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.newdb.TaskEntity;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.service.task.ZsDevService;
import com.smartcold.manage.cold.util.ExportExcelUtil;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

@Controller
@RequestMapping(value = "/history")
public class HistoryController extends BaseController {
	
	@Autowired
	private TaskMapper taskDao;
	@Autowired
	private TempSetMapper tempSetMapper;
	@Autowired
	private StorageService storageService;

	

	 
	
	 @RequestMapping("/getTaskProgress")
	 @ResponseBody
	 public Object getTaskProgress(Integer id)  {
		 if(id!=null){
			 return ExportExcelUtil.getTask(id);
		 }else{
			 return 0;
		 }
	 }
	 
	 @RequestMapping("/delTempTask")
	 @ResponseBody
	 public Object delTempTask(HttpServletRequest request,Integer id,String fileName)  {
		 if(id!=null){
			this.taskDao.delTempTaskByID(id);
		    return true;
		 }else{
			 return false;
		 }
	 }
	 @RequestMapping("/getTaskByUid")
	 @ResponseBody
	 public Object getTaskByUid(HttpServletRequest request, HttpServletResponse response,Integer uid)  {
		 if(uid!=null){
			return this.taskDao.getTaskByUid(uid);
		 }else{
			 return null;
		 }
	 }
	 
	 @RequestMapping("/downloadFile")
	 public void downloadFile(HttpServletRequest request, HttpServletResponse response,String fileName)  {
	        try {
	        	String serverPath= request.getSession().getServletContext().getRealPath("")+File.separator+"Temp"+"/";
	        	File file = new File(serverPath+fileName);
	        	response.reset();
	        	response.setContentType("bin");
	        	response.setContentType("application/octet-stream");
	        	response.addHeader("Content-Length", "" + file.length());
	        	response.addHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
              if(!file.exists()){
	           	   ServletOutputStream out = response.getOutputStream();  
	           	   OutputStreamWriter ow = new OutputStreamWriter(out,"GB2312");  
	           	   ow.write("数据异常！");  
	           	   ow.flush();  
	           	   ow.close();  
	           	   return;
	        	}
				InputStream inStream = new FileInputStream(serverPath+fileName);// 文件的存放路径
				int len;byte[] b = new byte[2000];
			    while ((len = inStream.read(b)) > 0){ response.getOutputStream().write(b, 0, len);}
			    inStream.close();//12
			} catch (Exception e) {
				e.printStackTrace();
			}
	}
	 
	 
	 @RequestMapping("/ios_getKeyValueDataByFilter")
		@ResponseBody
		public ResponseData<HashMap<String, Object>> ios_getKeyValueDataByFilter(Integer type, Boolean ismklin, String key, String oids, String onames, String startTime, String endTime) {
			if(StringUtil.isnotNull(oids)&&StringUtil.isnotNull(onames)){
				String []newoid=StringUtil.splitfhString(oids);
				String []newonames= StringUtil.splitfhString(onames);
				if (newoid.length==newonames.length) {
					Integer [] newoids=new Integer[newoid.length];
					for (int i = 0; i < newoid.length; i++) {
						newoids[i]=Integer.parseInt(newoid[i]);
					}	
					return getHistData( type,  ismklin,  key,  newoids,  newonames,  startTime,  endTime);
				}else{
					return ResponseData.newFailure("参数不全！");
				}
			}
			return ResponseData.newFailure("参数不全！");
		}
	 
	 /**
		 * 历史数据查询
		 */
		@RequestMapping("/getHistData")
		@ResponseBody
		public ResponseData<HashMap<String, Object>> getHistData(Integer type, Boolean ismklin, String key, Integer[] oids, String[] onames, String startTime, String endTime) {
			try {
				if (key != null && key != "" && oids != null && oids.length > 0) {
					Date sttime = TimeUtil.dateFormat.parse(startTime);
					Date edTime = TimeUtil.dateFormat.parse(endTime);
					int daysBetween = TimeUtil.daysBetween(sttime, edTime);
					if(daysBetween>4){return ResponseData.newFailure("时间范围最大为3天~"); }
					HashMap<String, Object> restData = new HashMap<String, Object>();
					LinkedList<HashMap<String, Object>> restList = new LinkedList<HashMap<String, Object>>();
					LinkedList<List<StorageKeyValue>> xtemp = new LinkedList<List<StorageKeyValue>>();
					int maxsize = 0, index = -1;
					HashMap<String, Object> temp = new LinkedHashMap<String, Object>();
					List<Object> maklist = new ArrayList<Object>();
					HashMap<String, Object> dttemp = new LinkedHashMap<String, Object>();
					temp.put("type", "average");
					temp.put("name", "平均值");
					maklist.add(temp);
					dttemp.put("data", maklist);

					List<Object> mtklist = new ArrayList<Object>();
					HashMap<String, Object> rttemp = new LinkedHashMap<String, Object>();
					HashMap<String, Object> mttemp = new LinkedHashMap<String, Object>();
					mttemp.put("type", "max");
					mttemp.put("name", "最大值");
					mtklist.add(mttemp);
					rttemp.put("data", mtklist);

					for (int i = 0; i < oids.length; i++) {
						HashMap<String, Object> linmap = new HashMap<String, Object>();
						int oid = oids[i];
						String oname = onames[i];
							  List<StorageKeyValue> datalist = storageService.findByTimeFormat(type, oid, key, sttime, edTime,0,null,"asc" );//
								if (datalist.size() > maxsize) {index = i;}
								linmap.put("type", "line");//type==2||type==3?"bar":line
								linmap.put("showSymbol", "none");//type==2||type==3?"bar":line showSymbol:false,
								linmap.put("data", datalist);
								linmap.put("name", oname);
								if (ismklin != null && ismklin) {
									linmap.put("markLine", dttemp);
									linmap.put("markPoint", rttemp);
								}
								xtemp.add(datalist);
								restList.add(linmap);
					}
					if (index != -1) {
						List<StorageKeyValue> list = xtemp.get(index);
						String[] xdt = new String[list.size()];
						for (int i = 0; i < list.size(); i++) {
							xdt[i] = TimeUtil.dateFormat.format(list.get(i).getAddtime());
						}
						restData.put("xdata", xdt);
					} else {
						String[] xdt = new String[daysBetween];
						for (int i = 0; i < daysBetween; i++) {
							Calendar c = Calendar.getInstance();
							c.add(Calendar.DAY_OF_MONTH, -daysBetween + i);
							xdt[i] = TimeUtil.dateFormat.format(c.getTime());
						}
						restData.put("xdata", xdt);// 展示数据
					}
					restData.put("ydata", restList);
					return ResponseData.newSuccess(restData);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			return ResponseData.newFailure();
		}

	 
	@RequestMapping("/expHistoryData")
	@ResponseBody
	public Object expHistoryData(HttpServletRequest request, HttpServletResponse response,String uid, String filename, String title,Integer type, String key, int intervalTime,Integer[] oids, String[] onames, String startTime, String endTime) {
		int taskid=0;
		try {
			if(StringUtil.isNull(filename)||StringUtil.isNull(title)||type==0||StringUtil.isNull(key)||oids==null||onames==null||StringUtil.isNull(startTime)||StringUtil.isNull(endTime)){return  ResponseData.newFailure("参数不全！");}
			Date date = new Date();  
			String sid = TimeUtil.datefmlong.format(date)+uid;  
			Date sttime = TimeUtil.dateFormat.parse(startTime);Date edTime = TimeUtil.dateFormat.parse(endTime);
			TaskEntity task	=new TaskEntity(-1,0,Integer.parseInt(uid), request.getLocalPort()+"",sid+".zip",RemoteUtil.getServerIp());
			this.taskDao.addTempTask(task);  taskid=task.getId();ExportExcelUtil.EXPPROGRESS.put(taskid,0.00);
			String fullname=filename + "_" + title;
			String serverPath= request.getSession().getServletContext().getRealPath("")+File.separator+"Temp"+File.separator;
			File dir = new File(serverPath);  if(!dir.exists()){  dir.mkdir();   }  //创建文件夹
			String mode[][] = { { "数据id", "对象", "值", "时间" }, { "id", "key", "value", "addtime" }, { "5", "5", "10", "10", "10", "10" } };// 标题（必须），对应属性（必须），宽度
			this.expZIPXLS(taskid, type, key, oids, onames, sttime, edTime, sid, serverPath, fullname, title, mode, null, onames, intervalTime);
			HashMap<String, Object> map=new HashMap<String, Object>();
			map.put("fileName",sid+".zip");
			map.put("ip",task.getExqip());
			map.put("port",task.getClass());
			this.taskDao.upTempState(taskid, 100);
			return  ResponseData.newSuccess(task);
		} catch (Exception e) {
			e.printStackTrace();
			ExportExcelUtil.EXPPROGRESS.put(taskid,-1.00);
			return  ResponseData.newFailure("导出失败！");
		} finally {
			System.gc();
		}
	}
	
	
	
	public  void expZIPXLS( int taskid,int type,String key,Integer[] oids, String[] onames,Date sttime,Date edTime , String sid,String serverPath,String fileName, String title, String mode[][],int[][] colmode, String[] shelName, int intervalTime) throws Exception{
		try {
			SXSSFWorkbook   wb = new SXSSFWorkbook(200);////内存中保留 500 条数据，以免内存溢出，其余写入 硬盘 -- workbook1,100 
			CellStyle cellStyleTitle = ExportExcelUtil.getHSSFCellStyle(wb, null);
			CellStyle cellStyle = ExportExcelUtil.getbodyHSSFCellStyle(wb, null);
			if (shelName.length >= 1) {
				List<StorageKeyValue> list = new ArrayList<StorageKeyValue>();
				List<StorageKeyValue> newlist = new ArrayList<StorageKeyValue>();
				for (int i = 0; i < oids.length; i++) {
					list = storageService.findByTime(type, oids[i], key, sttime, edTime,"asc");
					if (list.size() > 1048575) {list=list.subList(0, 1048574);} // 防止数据溢出
					if(SetUtil.isnotNullList(list)&&intervalTime!=1){//執行跳跃数据
						for (int j = 0; j < list.size(); j++) { //  1663132
							if(j%intervalTime==0){	newlist.add(list.get(j)); }	
						}
					}else{
						newlist=list;
					}
					ExportExcelUtil.createHSSFSheet(wb, cellStyleTitle, cellStyle, shelName[i], title, mode, colmode, newlist,new int[]{taskid,i,oids.length});
					ExportExcelUtil.EXPPROGRESS.put(taskid, new Double((i+1)/oids.length*100));
				}
			}
			ZipEntry zipEntry = new ZipEntry(fileName+".xls");
            ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(serverPath+sid+".zip"));
            zipOut.putNextEntry(zipEntry);  
            wb.write(zipOut); 
            zipOut.flush();
            zipOut.close();  
            ExportExcelUtil.EXPPROGRESS.put(taskid, 100.00);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Output   is   closed ");
			ExportExcelUtil.EXPPROGRESS.put(taskid,-1.00);
			throw new Exception("导出异常");
		} finally {
			System.gc();
		}
	}
	
	

}