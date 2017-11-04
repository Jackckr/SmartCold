package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

import okhttp3.OkHttpClient;

import org.apache.poi.ss.formula.functions.T;
import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.BatchPoints;
import org.influxdb.dto.Point;
import org.influxdb.dto.Point.Builder;
import org.influxdb.dto.Pong;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.smartcold.manage.cold.entity.newdb.InfluxDBProperties;
import com.smartcold.manage.cold.service.StoreDataSever;
import com.smartcold.manage.cold.util.StringUtil;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:
 * Create on MaQiang 2016-6-25 09:28:36
 */
@Service("storeDataSever")
public class StoreDataSeverImpl implements StoreDataSever {
	private String database;

	private InfluxDB connection;
	@Autowired
	public InfluxDBProperties properties;

	private static Logger logger = LoggerFactory.getLogger(StoreDataSever.class);

	@Override
	public Pong ping() {
		return getConnection().ping();
	}

	@Override
	public String version() {
		return getConnection().version();
	}

	public String getDatabase() {
		if (StringUtil.isnotNull(this.database)) {
			return this.database;
		}
		this.database = this.properties.getDatabase();
		return this.database;
	}

	/**
	 * 删除
	 * 
	 * @param command
	 *            删除语句
	 * @return 返回错误信息
	 */
	public String deleteMeasurementData(String command) {
		QueryResult result = this.connection.query(new Query(command, database));
		return result.getError();
	}

	/**
	 * 创建数据库
	 * 
	 * @param dbName
	 */
	public void createDB(String dbName) {
		this.connection.createDatabase(dbName);
	}

	public void createDatabase() {
		this.connection.createDatabase(getDatabase());
	}

	/**
	 * 删除数据库
	 * 
	 * @param dbName
	 */
	public void deleteDB(String dbName) {
		this.connection.deleteDatabase(dbName);
	}

	@Override
	public void write(final T... payload) {
		write(Arrays.asList(payload));
	}

	public List<Point> convert(Point source) {
		final ArrayList<Point> list = new ArrayList<>(1);
		Collections.addAll(list, source);
		return list;
	}

	@Override
	public void write(final List<T> payload) {
		final String database = getDatabase();
		final String retentionPolicy = this.properties.getRetentionPolicy();
		final BatchPoints ops = BatchPoints.database(database)
				.retentionPolicy(retentionPolicy)
				.consistency(InfluxDB.ConsistencyLevel.ALL).build();
		// for (T t : payload) {
		// convert(t);
		// }

		this.getConnection().write(ops);
	}

	@Override
	public QueryResult query(final Query query) {
		return getConnection().query(query);
	}

	@Override
	public QueryResult query(final Query query, final TimeUnit timeUnit) {
		return getConnection().query(query, timeUnit);
	}

	@Override
	public void query(Query query, int chunkSize, Consumer<QueryResult> consumer) {
		getConnection().query(query, chunkSize, consumer);
	}

	@Override
	public void createRetentionPolicy(String command) {
	}

	/**
	 * 查询
	 * 
	 * @param command
	 *            查询语句
	 * @return
	 */
	public QueryResult query(String command) {
		return this.getConnection().query(new Query(command, this.getDatabase()));
	}

	/**
	 * 插入
	 * 
	 * @param measurement
	 *            表
	 * @param tags
	 *            标签
	 * @param fields
	 *            字段
	 */
	public void insert(String measurement, Map<String, String> tags,Map<String, Object> fields) {
		Builder builder = Point.measurement(measurement);
		builder.tag(tags).fields(fields);
		  InfluxDB connection2 = this.getConnection();
		  Point build = builder.build();
		  connection2.write(this.getDatabase(),"",  build);
	}

	public InfluxDB getConnection() {
		Assert.notNull(this.properties, "InfluxDBProperties are required");
		if (connection == null) {
			final okhttp3.OkHttpClient.Builder client = new OkHttpClient.Builder()
					.connectTimeout(properties.getConnectTimeout(),
							TimeUnit.SECONDS)
					.writeTimeout(properties.getWriteTimeout(),
							TimeUnit.SECONDS)
					.readTimeout(properties.getReadTimeout(), TimeUnit.SECONDS);
			connection = InfluxDBFactory.connect(properties.getUrl(),
					properties.getUsername(), properties.getPassword(), client);
			logger.debug("Using InfluxDB '{}' on '{}'",
					properties.getDatabase(), properties.getUrl());
			if (properties.isGzip()) {
				logger.debug("Enabled gzip compression for HTTP requests");
				connection.enableGzip();
			}
		}
		return connection;
	}

}
