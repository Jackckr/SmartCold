package com.smartcold.manage.cold.util;

import java.io.BufferedOutputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
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

/**
 * EXCEL报表工具类.
 * 
 * @author Maqiang34
 */
public class ExportExcelUtil {

	

	/**
	 * 
	 * @param response
	 * @param fileName：导出文件名称
	 * @param title xls:标题
	 * @param mode 数据模型 ：demo{{"id","角色","用户名","密码","电话","邮箱"},{"id","role","username" ,"password","telephone","email"},{"1","1","5","5","5","5"}};//标题（必须），对应属性（必须），宽度
	 * @param list //数据集合
	 */
	@SuppressWarnings("rawtypes")
	public static void expExcel(HttpServletResponse response, String fileName,String title, String mode[][], List list) {
		try {

			ExportExcelUtil.setResponse(response, fileName);// 创建工作博
			HSSFWorkbook wb = new HSSFWorkbook();
			// 创建单元格样式
			// ------------------------------------------------------------------
			HSSFCellStyle cellStyleTitle = ExportExcelUtil.getHSSFCellStyle(wb,null);
			HSSFCellStyle cellStyle = ExportExcelUtil.getbodyHSSFCellStyle(wb,null);
			OutputStream output = response.getOutputStream();
			BufferedOutputStream bufferedOutPut = new BufferedOutputStream(output);
			ExportExcelUtil.createHSSFSheet(wb, cellStyleTitle, cellStyle,"shell1", title, mode, list);
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
	@SuppressWarnings("rawtypes")
	public static void expExcel(HttpServletResponse response, String fileName,String title, String mode[][], String[] shelName,List<List> datalist) {
		try {

			ExportExcelUtil.setResponse(response, fileName);// 创建工作博
			HSSFWorkbook wb = new HSSFWorkbook();
			// 创建单元格样式
			// ------------------------------------------------------------------
			HSSFCellStyle cellStyleTitle = ExportExcelUtil.getHSSFCellStyle(wb,null);
			HSSFCellStyle cellStyle = ExportExcelUtil.getbodyHSSFCellStyle(wb,null);
			OutputStream output = response.getOutputStream();
			BufferedOutputStream bufferedOutPut = new BufferedOutputStream(output);
			List list=null;
			for (int i = 0; i < datalist.size(); i++) {
				list=datalist.get(i);
				ExportExcelUtil.createHSSFSheet(wb, cellStyleTitle, cellStyle,shelName[i], title, mode, list);
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
  
	/**
	 * 根据属性获得对象属性值
	 * 
	 * @param fieldName
	 * @param o
	 * @return
	 */
	public static String getFieldValueByName(String fieldName, Object o) { //
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
     * 设置下载编码
     * @param response
     * @param fileName
     * @throws Exception
     */
	public static void setResponse(HttpServletResponse response, String fileName)throws Exception {
		response.reset();
		fileName = new String(fileName.getBytes("GBK"), "iso8859-1");
		response.setHeader("Content-Disposition", "attachment;filename="+ fileName);// 指定下载的文件名
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setDateHeader("Expires", 0);
	}

	/**
	 * 创建通用EXCEL头部
	 * 
	 * @param headString
	 *            头部显示的字符
	 * @param colSum
	 *            该报表的列数
	 */
	public static void createNormalHead(HSSFSheet sheet, HSSFWorkbook wb,String headString, int colSum) {
		HSSFRow row = sheet.createRow(0);
		HSSFCell cell = row.createCell(0);// 设置第一行
		cell.setCellType(HSSFCell.ENCODING_UTF_16);// 中文处理
		cell.setCellValue(new HSSFRichTextString(headString));
		sheet.addMergedRegion(new CellRangeAddress(0, (short) 0, 0,(short) colSum));
		HSSFCellStyle cellStyle = wb.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 指定单元格居中对齐
		cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 指定单元格垂直居中对齐
		cellStyle.setWrapText(true);// 指定单元格自动换行
		// 设置单元格字体
		cell.setCellStyle(cellStyle);
	}
	  /**
     * 设置内容样式
     * @param wb
     * @param cellStyle
     * @return
     */
	private static HSSFCellStyle getbodyHSSFCellStyle(HSSFWorkbook wb,HSSFCellStyle cellStyle) {
		if (cellStyle != null){return cellStyle;}
		cellStyle = wb.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);	// 指定单元格居中对齐
		cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 指定单元格垂直居中对齐
		cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN); // 下边框
		cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);// 左边框
		cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);// 上边框
		cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);// 右边框
		cellStyle.setWrapText(true);// 指定当单元格内容显示不下时自动换行
		return cellStyle;
	}
    /**
     * 设置主标题样式
     * @param wb
     * @param cellStyleTitle
     * @return
     */
	private static HSSFCellStyle getHSSFCellStyle(HSSFWorkbook wb,HSSFCellStyle cellStyleTitle) {
		// 设置单元格字体
		if (cellStyleTitle != null) {return cellStyleTitle;}
		HSSFFont font = wb.createFont();
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		font.setFontName("宋体");
		font.setFontHeight((short) 200);

		cellStyleTitle = wb.createCellStyle();
		cellStyleTitle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 指定单元格居中对齐
		// 指定单元格垂直居中对齐
		cellStyleTitle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		cellStyleTitle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		cellStyleTitle.setBorderBottom(HSSFCellStyle.BORDER_THIN); // 下边框
		cellStyleTitle.setBorderLeft(HSSFCellStyle.BORDER_THIN);// 左边框
		cellStyleTitle.setBorderTop(HSSFCellStyle.BORDER_THIN);// 上边框
		cellStyleTitle.setBorderRight(HSSFCellStyle.BORDER_THIN);// 右边框
		// 指定当单元格内容显示不下时自动换行
		cellStyleTitle.setWrapText(true);
		cellStyleTitle.setFont(font);
		return cellStyleTitle;
	}
	  /**
     * 创建数据
     * @param wb
     * @param cellStyleTitle
     * @param cellStyle
     * @param title
     * @param shetName
     * @param mode
     * @param list
     */
	@SuppressWarnings("rawtypes")
	public static void createHSSFSheet(HSSFWorkbook wb,HSSFCellStyle cellStyleTitle, HSSFCellStyle cellStyle,String title, String shetName, String mode[][], List list) {
		HSSFSheet sheet = wb.createSheet(title); // 创建报表头部
		ExportExcelUtil.createNormalHead(sheet, wb, title, mode[0].length - 1); // 定义第一行
		HSSFRow row1 = sheet.createRow(1);
		HSSFCell cell1 = row1.createCell(0);
		// 第一行第一列
		String titmode[] = mode[0];
		cell1.setCellStyle(cellStyleTitle);
		cell1.setCellValue(new HSSFRichTextString(titmode[0]));
		for (int i = 1; i < titmode.length; i++) {
			cell1 = row1.createCell(i);
			cell1.setCellStyle(cellStyleTitle);
			cell1.setCellValue(new HSSFRichTextString(titmode[i]));
		}
		// 定义第二行
		HSSFRow row = sheet.createRow(2);
		HSSFCell cell = row.createCell(1);
		String datamode[] = mode[1];
		if (mode.length >= 3) {// 指定列宽
			for (int i = 0; i < mode[2].length; i++) {
				sheet.setColumnWidth(i, Integer.parseInt(mode[2][i]) * 1000);
			}
		}
		if(SetUtil.isnotNullList(list)){
			for (int i = 0; i < list.size(); i++) { // 65536
				Object object = list.get(i);
				row = sheet.createRow(i + 2);
				for (int j = 0; j < datamode.length; j++) {
					cell = row.createCell(j);
					cell.setCellStyle(cellStyle);
					cell.setCellValue(new HSSFRichTextString(getFieldValueByName(datamode[j], object)));
				}
			}
		}
	}

}