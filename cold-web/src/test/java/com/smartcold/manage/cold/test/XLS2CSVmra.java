package com.smartcold.manage.cold.test;

/* ====================================================================
Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==================================================================== */


import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.util.StringUtils;

import com.smartcold.manage.cold.util.StringUtil;


/**
* A XLS -> CSV processor, that uses the MissingRecordAware
*  EventModel code to ensure it outputs all columns and rows.
* @author Nick Burch
*/
public class XLS2CSVmra  {
	
	private static List<String[]> dataList=new ArrayList<>();
	
	public static void main(String[] args) throws Exception {
		redfile();
		wedfile();
	}
	
	
	private static void  redfile()  {
		
		BufferedWriter out = null;
		InputStream is = null;
		XSSFWorkbook xssfWorkbook = null;
		try {
			File writename = new File("D:/1.txt"); // 相对路径，如果没有则要建立一个新的output。txt文件 
			    if(writename.exists()){
			    	writename.delete();
			    }
			    writename.createNewFile(); // 创建新文件 
			    out = new BufferedWriter(new FileWriter(writename));  
			
			
			
			String dat [] =null;
			String []   xy =null;
			 File file = new File("D:/1.xlsx");
			 is = new FileInputStream(file);
			 xssfWorkbook = new XSSFWorkbook(is);
			    // 获取每一个工作薄
//	        for (int numSheet = 0; numSheet < xssfWorkbook.getNumberOfSheets(); numSheet++) {
			        XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(0);
			        if (xssfSheet == null) {
			            return;
			        }
			        // 获取当前工作薄的每一行
			        int rows= xssfSheet.getLastRowNum();
			        for (int rowNum = 2089; rowNum <=rows; rowNum++) {
			            XSSFRow xssfRow = xssfSheet.getRow(rowNum);
			            if (xssfRow != null) {
			                XSSFCell one = xssfRow.getCell(0);
			                String name = getValue(one)+"";
			                //读取第一列数据
			                XSSFCell two = xssfRow.getCell(1);//地址
			                String value = getValue(two);
			                if(StringUtil.isNull(value)){
			                	dat=new String[]{getValue(one),value,"",""};
			                }else{
			                	   xy  = getGeocoderLatitude(value);
			                	  if(xy==null){xy=new String[]{"",""};}
			                	  dat=  new String[]{name,value,xy[0],xy[1]};
			                }
			                dataList.add(dat);
			                System.err.println("解析第"+rowNum+"完成！"+ dat[0]+":"+dat[1]+dat[2]+":" +dat[3]   );
			                out.write("解析第"+rowNum+"完成！"+ dat[0]+":"+dat[1]+dat[2]+":" +dat[3]+"\r\n"); // \r\n即为换行  
			                Thread.sleep(2000);   
			            }
			        }
			        
			        
			        
			        
			        
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			
			  try {
				  out.flush(); // 把缓存区内容压入文件  
				  out.close(); // 最后记得关闭文件
				  is.close();
			} catch (Exception e) {
				e.printStackTrace();
			} 
		}
	}
	private static void  wedfile()  throws Exception{
//		 File file = new File("D:/1.xlsx");
//		 InputStream is = new FileInputStream(file);
		 try {
	            XSSFWorkbook wb = new XSSFWorkbook();
	            for(int sheetnum=0;sheetnum<1;sheetnum++){
	                XSSFSheet sheet = wb.createSheet(""+sheetnum);
//	                List<String[]> list = map.get(sheetnum);
	                for(int i=0;i<dataList.size();i++){
	                	System.err.println("写入位置："+i);
	                    XSSFRow row = sheet.createRow(i);
	                    String[] str = dataList.get(i);
	                    for(int j=0;j<str.length;j++){
	                        XSSFCell cell = row.createCell(j);
	                        cell.setCellValue(str[j]);
	                    }
	                }
	            }
	            FileOutputStream outputStream = new FileOutputStream("D:/2.xlsx");
	            wb.write(outputStream);
	            outputStream.close();
	        } catch (Exception e) {
	            // TODO 自动生成的 catch 块
	            e.printStackTrace();
	        } 
	}
	
	
	 private static String getValue(XSSFCell xssfRow) {
	        if (xssfRow.getCellType() == xssfRow.CELL_TYPE_BOOLEAN) {
	            return String.valueOf(xssfRow.getBooleanCellValue());
	        } else if (xssfRow.getCellType() == xssfRow.CELL_TYPE_NUMERIC) {
	            return String.valueOf(xssfRow.getNumericCellValue());
	        } else {
	            return String.valueOf(xssfRow.getStringCellValue());
	        }
		
	}
	 
	  public static String[] getGeocoderLatitude(String address) {
		  String [] data=null;
	        BufferedReader in = null;
	        try {
	            address = URLEncoder.encode(address, "UTF-8");
//	            URL tirc = new URL("http://api.map.baidu.com/geocoder?address=" + address + "&output=json&key=" + "PljdkOFpwmjpU00lFQhakTbjilGaH0or");
	            URL tirc = new URL("http://api.map.baidu.com/geocoder/v2/?address="+address+"&output=json&ak=PljdkOFpwmjpU00lFQhakTbjilGaH0or");
//	            URL tirc = new URL("http://api.map.baidu.com/geocoder/v2/?address=北京市海淀区上地十街10号&output=json&ak=PljdkOFpwmjpU00lFQhakTbjilGaH0or");
	            in = new BufferedReader(new InputStreamReader(tirc.openStream(), "UTF-8"));
	            String res;
	            StringBuilder sb = new StringBuilder("");
	            while ((res = in.readLine()) != null) {
	                sb.append(res.trim());
	            }
	            String str = sb.toString();
	            System.err.println(str);
	            if (!StringUtils.isEmpty(str)) {
	                int lngStart = str.indexOf("lng\":");
	                int lngEnd = str.indexOf(",\"lat");
	                int latEnd = str.indexOf("},\"precise");
	                if (lngStart > 0 && lngEnd > 0 && latEnd > 0) {
	                    String lng = str.substring(lngStart + 5, lngEnd);
	                    String lat = str.substring(lngEnd + 7, latEnd);
	                    data= new String[]{lng,lat};
	                }
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	        } finally {
	            try {
	                in.close();
	            } catch (IOException e) {
	                e.printStackTrace();
	            }
	        }
	        return data;
	    }
}
