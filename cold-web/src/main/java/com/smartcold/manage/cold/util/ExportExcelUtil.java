package com.smartcold.manage.cold.util;

  
import java.io.BufferedOutputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.util.CellRangeAddress;

import com.smartcold.manage.cold.entity.olddb.UserEntity;
  
/** 
 * EXCEL报表工具类. 
 *  
 * @author Jeelon 
 */  
public class ExportExcelUtil {  
  
	public static void main(String[] args) {
        List<UserEntity> list = new ArrayList<UserEntity>();  
        for (int i = 0; i < 100; i++) {
      	  UserEntity user = new UserEntity();  
      	  user.setId(10000+i);
      	  user.setUsername("XYZ"+i);
      	  user.setPassword("pwd"+i);
      	  user.setTelephone("1359781"+i);
      	  user.setEmail(i+"@qq.com");
      	  user.setRole(1);
      	  list.add(user);  
		   }
       String mode[][]={{"id","角色","用户名","密码","电话","邮箱"},{"id","role","username","password","telephone","email"},{"1","1","5","5","5","5"}} ;//标题（必须），对应属性（必须），宽度
       ExportExcelUtil.expExcel(null,"导出xls.xls","测试",mode,list);
	}
    /**
     * 根据属性获得对象属性值
     * @param fieldName
     * @param o
     * @return
     */
    private static String getFieldValueByName(String fieldName, Object o) {  
	       try {    
	           String firstLetter = fieldName.substring(0, 1).toUpperCase();    
	           String getter = "get" + firstLetter + fieldName.substring(1);    
	           Method method = o.getClass().getMethod(getter, new Class[] {});    
	           Object value = method.invoke(o, new Object[] {});    
	           return value.toString();    
	       } catch (Exception e) {    
	           return null;    
	       }    
	   } 
    
    /** 
     * 创建通用EXCEL头部 
     *  
     * @param headString 
     *            头部显示的字符 
     * @param colSum 
     *            该报表的列数 
     */  
    public static void createNormalHead(HSSFSheet sheet,HSSFWorkbook wb ,String headString, int colSum) {  
        HSSFRow row = sheet.createRow(0);  
        // 设置第一行  
        HSSFCell cell = row.createCell(0);  
        cell.setCellType(HSSFCell.ENCODING_UTF_16);// 中文处理  
        cell.setCellValue(new HSSFRichTextString(headString));  
        sheet.addMergedRegion(new CellRangeAddress(0, (short) 0, 0, (short) colSum));  
        HSSFCellStyle cellStyle = wb.createCellStyle();  
        // 设置单元格水平对齐类型  
        cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 指定单元格居中对齐  
        cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 指定单元格垂直居中对齐  
        cellStyle.setWrapText(true);// 指定单元格自动换行  
        // 设置单元格字体  
        cell.setCellStyle(cellStyle);  
    }  
    
	/**
	 * 
	 * @param response
	 * @param fileName ：导出文件名称
	 * @param title xls:标题
	 * @param mode  数据模型 ：demo{{"id","角色","用户名","密码","电话","邮箱"},{"id","role","username","password","telephone","email"},{"1","1","5","5","5","5"}} ;//标题（必须），对应属性（必须），宽度
	 * @param list //数据集合
	 */
	//HttpServletRequest request,  HttpServletResponse response,
	 public static void expExcel( HttpServletResponse response,String fileName,String title,String mode[][], @SuppressWarnings("rawtypes") List list)  {  
		 try {  
			    response.reset();  
			    fileName = new String(fileName.getBytes("GBK"), "iso8859-1");  
		        response.setHeader("Content-Disposition", "attachment;filename="  + fileName);// 指定下载的文件名  
		        response.setContentType("application/vnd.ms-excel");  
		        response.setHeader("Pragma", "no-cache");  
		        response.setHeader("Cache-Control", "no-cache");  
		        response.setDateHeader("Expires", 0); 
		        OutputStream   output = response.getOutputStream();  
//	       
		        BufferedOutputStream bufferedOutPut = new BufferedOutputStream(output);  
		        HSSFWorkbook wb = new HSSFWorkbook();  
		        // 创建单元格样式  
		        HSSFCellStyle cellStyleTitle = wb.createCellStyle();  
		        // 指定单元格居中对齐  
		        cellStyleTitle.setAlignment(HSSFCellStyle.ALIGN_CENTER);  
		        // 指定单元格垂直居中对齐  
		        cellStyleTitle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);  
		        cellStyleTitle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);  
		        cellStyleTitle.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框    
		        cellStyleTitle.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框    
		        cellStyleTitle.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框    
		        cellStyleTitle.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框  
		        // 指定当单元格内容显示不下时自动换行  
		        cellStyleTitle.setWrapText(true);  
		        // ------------------------------------------------------------------  
		        HSSFCellStyle cellStyle = wb.createCellStyle();  
		        // 指定单元格居中对齐  
		        cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);  
		        // 指定单元格垂直居中对齐  
		        cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);  
		        cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框    
		        cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框    
		        cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框    
		        cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框   
		        // 指定当单元格内容显示不下时自动换行  
		        cellStyle.setWrapText(true);  
		        // ------------------------------------------------------------------  
		        // 设置单元格字体  
		        HSSFFont font = wb.createFont();  
		        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);  
		        font.setFontName("宋体");  
		        font.setFontHeight((short) 200);  
		        cellStyleTitle.setFont(font);  
		  
		        HSSFSheet sheet = wb.createSheet();   // 创建报表头部 
		        ExportExcelUtil.createNormalHead( sheet,wb,title, mode[0].length-1);   // 定义第一行 
		        HSSFRow row1 = sheet.createRow(1);  
		        HSSFCell cell1 = row1.createCell(0);  
		  
		        //第一行第一列 
		        String titmode[] =mode[0];
		        cell1.setCellStyle(cellStyleTitle);  
		        cell1.setCellValue(new HSSFRichTextString(titmode[0]));  
			    for (int i = 1; i < titmode.length; i++) {
			    	 cell1 = row1.createCell(i);  
				     cell1.setCellStyle(cellStyleTitle);  
				     cell1.setCellValue(new HSSFRichTextString(titmode[i]));   
				}
	           //定义第二行  
		        HSSFRow row = sheet.createRow(2);  
		        HSSFCell cell = row.createCell(1);  
		        String datamode[] =mode[1];
		        if(mode.length>=3){//指定列宽
			       for (int i = 0; i < mode[2].length; i++) {sheet.setColumnWidth(i, Integer.parseInt(mode[2][i])*1000);  }
		        }
		        for (int i = 0; i < list.size(); i++) {  
		              Object object = list.get(i);  
		              row = sheet.createRow(i + 2);  
		              for (int j = 0;j < datamode.length; j++) {
	  	            	cell = row.createCell(j);  
	  	                cell.setCellStyle(cellStyle); 
						cell.setCellValue(new HSSFRichTextString(getFieldValueByName(datamode[j], object)));
		 			 }
		        }  
	            bufferedOutPut.flush();  
	            wb.write(bufferedOutPut);  
	            bufferedOutPut.close();  
	        } catch (Exception e) {  
	            e.printStackTrace();  
	            System.out.println("Output   is   closed ");  
	        } finally {  
	        	System.gc();
	        }  
	    }  


  
   
 
}  