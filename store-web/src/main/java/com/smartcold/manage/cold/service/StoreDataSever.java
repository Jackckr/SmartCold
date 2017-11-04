package com.smartcold.manage.cold.service;

import org.apache.poi.ss.formula.functions.T;
import org.influxdb.InfluxDB;
import org.influxdb.dto.Pong;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:
 * Create on MaQiang 2016-6-25 09:28:36
 */
public interface StoreDataSever {

	public Pong ping();

	public String version();

	public InfluxDB getConnection();

	public void createDatabase();

	public void deleteDB(String dbName);

	public void write(final T... payload);

	public void write(final List<T> payload);
	
	public void insert(String measurement, Map<String, String> tags, Map<String, Object> fields);

	public QueryResult query(final Query query);

	public QueryResult query(final Query query, final TimeUnit timeUnit);

	public void query(final Query query, final int chunkSize,final Consumer<QueryResult> consumer);

	@Deprecated
	public QueryResult query(String command);// @param command:查询指令

	@Deprecated
	public String deleteMeasurementData(String command);// 删除指令

	@Deprecated
	public void createRetentionPolicy(String command);// 设置数据保存策略

}
