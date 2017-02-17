package com.smartcold.manage.cold.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.TaskMapper;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.newdb.TaskEntity;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.ExportExcelUtil;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

@Controller
@RequestMapping(value = "/history")
public class HistoryController extends BaseController {
	
	@Autowired
	private TaskMapper taskDao;
	@Autowired
	private StorageService storageService;


	@SuppressWarnings("rawtypes")
	@RequestMapping("/expHistoryData")
	@ResponseBody
	public Object expHistoryData(HttpServletRequest request, HttpServletResponse response,String uid, String filename, String title,Integer type, String key, Integer[] oids, String[] onames, String startTime, String endTime) {
		int taskid=0;
		try {
			if(StringUtil.isNull(filename)||StringUtil.isNull(title)||type==0||StringUtil.isNull(key)||oids==null||onames==null||StringUtil.isNull(startTime)||StringUtil.isNull(endTime)){return  ResponseData.newFailure("参数不全！");}
			Date date = new Date();  
			String sid = TimeUtil.datefmlong.format(date)+uid;  
			Date sttime = TimeUtil.dateFormat.parse(startTime);Date edTime = TimeUtil.dateFormat.parse(endTime);
			TaskEntity task	=new TaskEntity(-1,0,Integer.parseInt(uid), request.getLocalPort()+"",sid+".zip",RemoteUtil.getServerIP());
			this.taskDao.addTempTask(task);  taskid=task.getId();ExportExcelUtil.EXPPROGRESS.put(taskid,0.00);
			String fullname=filename + "_" + title;
			String serverPath= request.getSession().getServletContext().getRealPath("")+File.separator+"Temp"+File.separator;
			File dir = new File(serverPath);  if(!dir.exists()){  dir.mkdir();   }  //创建文件夹
			List<List> alldata = new ArrayList<List>();
//			int [] leng={100000,20,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1};
			String mode[][] = { { "数据id", "对象", "值", "时间" }, { "id", "key", "value", "addtime" }, { "5", "5", "10", "10", "10", "10" } };// 标题（必须），对应属性（必须），宽度
			for (int i = 0; i < oids.length; i++) {
				int oid = oids[i];
				List<StorageKeyValue> datalist = storageService.findByTime(type, oid, key, sttime, edTime);
				alldata.add(datalist);
//				List<StorageKeyValue> datalist =new ArrayList<StorageKeyValue>();
//				for (int j = 0; j <leng[i]; j++) {StorageKeyValue k=new StorageKeyValue();k.setId(j);k.setKey(key);k.setOid(oid);k.setValue(new Double(j));datalist.add(k);}alldata.add(datalist);//1048576
			}
			ExportExcelUtil.expZIPXLS(taskid,sid, serverPath,fullname , title, mode, null, onames, alldata);
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
		}
	}
	
	
	 @RequestMapping("/downloadFile")
	 public void downloadFile(HttpServletRequest request, HttpServletResponse response,String fileName)  {
	        try {
//	        	String fileName = "2017021612325911487219579472.zip"; // 文件的默认保存名
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
            	   ow.write("这是测试");  
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
	 
	 @RequestMapping("/getTaskByUid")
	 @ResponseBody
	 public Object getTaskByUid(HttpServletRequest request, HttpServletResponse response,Integer uid)  {
		 if(uid!=null){
			return this.taskDao.getTaskByUid(uid);
		 }else{
			 return null;
		 }
	 }
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
			this.taskDao.delTempTask(id);
		    return true;
		 }else{
			 return false;
		 }
	 }
}