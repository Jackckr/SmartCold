
package com.smartcold.manage.cold.service.influx;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.OkHttpClient.Builder;

import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.smartcold.manage.cold.entity.newdb.InfluxDBProperties;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:
 * Create on MaQiang 2016-6-25 09:28:36
 */
@Service
public class InfluxDBConnectionFactory 
{
  private static Logger logger = LoggerFactory.getLogger(InfluxDBConnectionFactory.class);

  private InfluxDB connection;
  @Autowired
  public InfluxDBProperties properties;

  
  
  
  public InfluxDB getConnection()
  {
    Assert.notNull(this.properties, "InfluxDBProperties are required");
    if (connection == null)
    {
      final Builder client = new OkHttpClient.Builder().connectTimeout(properties.getConnectTimeout(), TimeUnit.SECONDS).writeTimeout(properties.getWriteTimeout(), TimeUnit.SECONDS).readTimeout(properties.getReadTimeout(), TimeUnit.SECONDS);
      connection = InfluxDBFactory.connect(properties.getUrl(), properties.getUsername(), properties.getPassword(), client);
      logger.debug("Using InfluxDB '{}' on '{}'", properties.getDatabase(), properties.getUrl());
      if (properties.isGzip())
      {
        logger.debug("Enabled gzip compression for HTTP requests");
        connection.enableGzip();
      }
    }
    return connection;
  }

  
  
 
  
	public InfluxDBProperties getProperties() {
		return properties;
	}


  
 



}
