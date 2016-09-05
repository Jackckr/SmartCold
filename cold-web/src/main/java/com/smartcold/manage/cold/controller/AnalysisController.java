package com.smartcold.manage.cold.controller;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
/**
 * 分析Controller
 * @author MaQiang
 *
 */
@Controller
@RequestMapping(value = "/AnalysisController")
public class AnalysisController {

	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;
	
	/**
	 * 
	 * @param rdcId:冷库ID
	 * @param compressorsId :压缩机组id
	 * @return
	 */
	@RequestMapping(value = "/getCoolingAnalysis")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getCoolingAnalysis(Integer rdcId,Integer[] compressorsId) {
		try {
			if(rdcId==null){return null;}
			List<CompressorGroupSetEntity> compressList = this.compressorGroupSetDao.findByRdcId(rdcId);
			if(SetUtil.isnotNullList(compressList)){
				HashMap<String, Object> chardata=new HashMap<String, Object>();//
				//==========================================虚拟数据start-30天==========================================
				String xdata[] =new String[30];//日期
				SimpleDateFormat   sdf   =   new   SimpleDateFormat( "yyyy-MM-dd"); 
				for (int i = 0; i<30; i++) {
					Calendar c  = Calendar.getInstance();
					c.add(Calendar.DAY_OF_MONTH,-30+i);
					xdata[i]=sdf.format(c.getTime());
					}
				    chardata.put("xdata", xdata);//展示数据
				List<Object> templist=new ArrayList<Object>();
				DecimalFormat    dfformat   = new DecimalFormat("######0.00");   
				for (CompressorGroupSetEntity comss : compressList) {
					double y1[]=new double[xdata.length];
					for (int i = 0; i<xdata.length; i++) {
						y1[i]=Double.parseDouble(dfformat.format(Math.random()*2));
					}
					HashMap<String, Object> charxdata=new HashMap<String, Object>();//
					charxdata.put("name", comss.getName());
					charxdata.put("id", comss.getId());
					charxdata.put("data", y1);
					templist.add(charxdata);
				}
				chardata.put("chdata", templist);
				//==========================================虚拟数据end==========================================
				return ResponseData.newSuccess(chardata);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure();
		}
		return ResponseData.newFailure("没有数据！");
	}
	

}
