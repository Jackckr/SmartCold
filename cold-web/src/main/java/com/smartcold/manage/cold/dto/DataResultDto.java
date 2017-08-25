package com.smartcold.manage.cold.dto;


/**
 * JSON格式返回数据载体
 * @author  MaQiang
 */
public class DataResultDto<T> {
	
	
	private String status;

	private String time;
	
	private String updateConf;

	//---------------------------------------------------------
	
	@SuppressWarnings("rawtypes")
	private static ThreadLocal<DataResultDto> TLRD = new ThreadLocal<DataResultDto>();
	



	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getUpdateConf() {
		return updateConf;
	}

	public void setUpdateConf(String updateConf) {
		this.updateConf = updateConf;
	}
	public static void clear() {
		TLRD.remove();
	}
	
	/**
	 * 获取当前可用的ResponseData对象
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> DataResultDto<T> getInstance() {
		DataResultDto<T> rd = TLRD.get();
		if (rd == null) {
			rd = new DataResultDto<T>();
			TLRD.set(rd);
		}
		return rd;// new ResponseData<T>();
	}

	/**
	 * 获取当前可用的ResponseData对象(SUCCESS)
	 * @param message
	 * @return
	 */
	public static <T> DataResultDto<T> newSuccess() {
		DataResultDto<T> rd = getInstance();
		rd.setStatus("200");
		rd.setTime(Long.toString(System.currentTimeMillis() / 1000));
		return rd;
	}
	/**
	 * 获取当前可用的ResponseData对象(SUCCESS)
	 * @param message
	 * @return
	 */
	public static <T> DataResultDto<T> newSuccess(Boolean update) {
		DataResultDto<T> rd = getInstance();
		rd.setStatus("200");
		if(update){rd.setUpdateConf("true");}
		rd.setTime(Long.toString(System.currentTimeMillis() / 1000));
		return rd;
	}
	
	/**
	 * 获取当前可用的ResponseData对象(SUCCESS)
	 * @param message
	 * @return
	 */
	public static <T> DataResultDto<T> newFailure() {
		DataResultDto<T> rd = getInstance();
		rd.setStatus("500");
		rd.setTime(Long.toString(System.currentTimeMillis() / 1000));
		return rd;
	}
	


}
