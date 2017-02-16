package com.smartcold.manage.cold.util;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;


/**
 * EXCEL报表工具类.
 * 
 * @author Maqiang34
 */
public class ExportExcelUtil {
	
	public static void clearTask(){EXPPROGRESS.clear(); }
    private static Map<Integer,Double > EXPPROGRESS=new HashMap<Integer, Double>();
    public static double getTask(int id){if(EXPPROGRESS.containsKey(id)){return EXPPROGRESS.get(id); }else{return -1;}}
	//==================================================================================================================================================================================================================
	/**
	 * 
	 * @param response
	 * @param fileName：导出文件名称
	 * @param title
	 *            xls:标题
	 * @param mode
	 *            数据模型
	 *            ：demo{{"id","角色","用户名","密码","电话","邮箱"},{"id","role","username"
	 *            ,"password","telephone","email"},{"1","1","5","5","5","5"}};//
	 *            标题（必须），对应属性（必须），宽度
	 * @param list
	 *            //数据集合
	 */
	@SuppressWarnings("rawtypes")
	public static void expExcel(HttpServletResponse response, String fileName, String title, String mode[][],List list) {
		try {
			ExportExcelUtil.setResponse(response, fileName);// 创建工作博
			SXSSFWorkbook wb = new SXSSFWorkbook(1000);
			// 创建单元格样式
			// ------------------------------------------------------------------
			CellStyle cellStyleTitle = ExportExcelUtil.getHSSFCellStyle(wb, null);
			CellStyle cellStyle = ExportExcelUtil.getbodyHSSFCellStyle(wb, null);
			OutputStream output = response.getOutputStream();
			BufferedOutputStream bufferedOutPut = new BufferedOutputStream(output);
			ExportExcelUtil.createHSSFSheet(wb, cellStyleTitle, cellStyle, "shell1", title, mode, null, list,null);
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
	public static void expExcel(HttpServletResponse response, String fileName, String title, String mode[][],int[][] colmode, String[] shelName, List<List> datalist) {
		try {
			ExportExcelUtil.setResponse(response, fileName);// 创建工作博
			SXSSFWorkbook   wb = new SXSSFWorkbook(1000);////内存中保留 1000 条数据，以免内存溢出，其余写入 硬盘  
			CellStyle cellStyleTitle = ExportExcelUtil.getHSSFCellStyle(wb, null);//创建标题样式
			CellStyle cellStyle = ExportExcelUtil.getbodyHSSFCellStyle(wb, null);//创建内容样式
			OutputStream output = response.getOutputStream();
			BufferedOutputStream bufferedOutPut = new BufferedOutputStream(output);
			if (shelName.length > 1) {
				List list = null;
				for (int i = 0; i < datalist.size(); i++) {
					list = datalist.get(i);
					ExportExcelUtil.createHSSFSheet(wb, cellStyleTitle, cellStyle, shelName[i], title, mode, colmode, list,null);
				}
			} else {
				ExportExcelUtil.createHSSFSheet(wb, cellStyleTitle, cellStyle, shelName[0], title, mode, colmode,datalist,null);
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
	
	@SuppressWarnings("rawtypes")
	public static void expZIPXLS( int id,String sid,String serverPath,String fileName, String title, String mode[][],int[][] colmode, String[] shelName, List<List> datalist) {
		try {
			EXPPROGRESS.put(id, 0.00);
			SXSSFWorkbook   wb = new SXSSFWorkbook(2000);////内存中保留 2000 条数据，以免内存溢出，其余写入 硬盘 -- workbook1,100 
			CellStyle cellStyleTitle = ExportExcelUtil.getHSSFCellStyle(wb, null);
			CellStyle cellStyle = ExportExcelUtil.getbodyHSSFCellStyle(wb, null);
			if (shelName.length > 1) {
				List list = null;
				for (int i = 0; i < datalist.size(); i++) {
					System.err.println("执行第"+i+"shee");
					list = datalist.get(i);
					ExportExcelUtil.createHSSFSheet(wb, cellStyleTitle, cellStyle, shelName[i], title, mode, colmode, list,new int[]{id,i,datalist.size()});
					EXPPROGRESS.put(id, new Double((i+1)/datalist.size()*100));
				}
			} else {
				ExportExcelUtil.createHSSFSheet(wb, cellStyleTitle, cellStyle, shelName[0], title, mode, colmode,datalist,new int[]{id,1,datalist.size()});
			}
			ZipEntry zipEntry = new ZipEntry(fileName+".xls");
            ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(serverPath+sid+".zip"));
            zipOut.putNextEntry(zipEntry);  
            wb.write(zipOut); 
            zipOut.flush();
            zipOut.close();  
            EXPPROGRESS.put(id, 100.00);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Output   is   closed ");
		} finally {
			System.gc();
		}
	}
	
	

    
  
    //==================================================================================================================================================================================================================

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
			if (value instanceof Date) {
				return TimeUtil.getDateTime((Date) value);
			}
			return value.toString();
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 设置下载编码
	 * 
	 * @param response
	 * @param fileName
	 * @throws Exception
	 */
	public static void setResponse(HttpServletResponse response, String fileName) throws Exception {
		response.reset();
		if (StringUtil.isNull(fileName)) {fileName = "导出数据.xls";}
		fileName = new String(fileName.getBytes("GBK"), "iso8859-1");
		response.setHeader("Content-Disposition", "attachment;filename=" + fileName);// 指定下载的文件名
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setDateHeader("Expires", 0);
	}

	/**
	 * 创建通用EXCEL头部
	 * @param headString
	 *            头部显示的字符
	 * @param colSum
	 *            该报表的列数
	 */
	public static void createNormalHead(Sheet sheet, SXSSFWorkbook wb, String headString, int colSum) {
		Row row = sheet.createRow(0);
		Cell cell = row.createCell(0);// 设置第一行
		cell.setCellType(HSSFCell.ENCODING_UTF_16);// 中文处理
		cell.setCellValue(new XSSFRichTextString(headString));
		sheet.addMergedRegion(new CellRangeAddress(0, (short) 0, 0, (short) colSum));
		CellStyle cellStyle = wb.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 指定单元格居中对齐
		cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 指定单元格垂直居中对齐
		cellStyle.setWrapText(true);// 指定单元格自动换行
		// 设置单元格字体
		cell.setCellStyle(cellStyle);
	}

	/**
	 * 设置内容样式
	 * 
	 * @param wb
	 * @param cellStyle
	 * @return
	 */
	private static CellStyle getbodyHSSFCellStyle(SXSSFWorkbook wb, CellStyle cellStyle) {
		if (cellStyle != null) {
			return cellStyle;
		}
		cellStyle = wb.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 指定单元格居中对齐
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
	 * 
	 * @param wb
	 * @param cellStyleTitle
	 * @return
	 */
	private static CellStyle getHSSFCellStyle(SXSSFWorkbook wb, CellStyle cellStyleTitle) {
		// 设置单元格字体
		if (cellStyleTitle != null) {
			return cellStyleTitle;
		}
		Font font = wb.createFont();
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
	public static void createHSSFSheet(SXSSFWorkbook wb,CellStyle cellStyleTitle, CellStyle cellStyle,String title, String shetName, String mode[][], int[][] colmode, List list,int [] progress) {
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
		// 第一行第一列 ->什么鬼
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
			if (list.size() > 1048576) {list.subList(0, 1048576);} // 防止数据溢出
			for (int i = 0; i < list.size(); i++) { // 65536
				if(isprogress&&i!=0&&i%100==0){//
				    double pr= new Double(progress[1]+1)/new Double(progress[2])*new Double(i)/list.size()*100;
				    EXPPROGRESS.put(progress[0], pr);
				  try {
					
					  Thread.sleep(100);
				} catch (Exception e) {
					// TODO: handle exception
				}
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
						cell.setCellValue(new XSSFRichTextString(getFieldValueByName(datamode[j], object)));
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




}