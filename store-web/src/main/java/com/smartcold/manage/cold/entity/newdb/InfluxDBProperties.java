
package com.smartcold.manage.cold.entity.newdb;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: influxdb数据源这配置
 * Create on MaQiang 2016-6-25 09:28:36
 */
public class InfluxDBProperties
{
	 public  String url;
	 public  String username;
	 public  String password;
	 public  String database;
	 public  String retentionPolicy;
	 public  int connectTimeout = 10;
	 public  int readTimeout = 30;
	 public  int writeTimeout = 10;
	 public  boolean gzip = false;
  
  
  public String getUrl()
  {
    return url;
  }

  public void setUrl(final String url)
  {
	  System.err.println("influxdv-url:"+url);
   this.url = url;
  }

  public String getUsername()
  {
    return username;
  }

  public void setUsername(final String username)
  {
	  this.username = username;
  }

  public String getPassword()
  {
    return password;
  }

  public void setPassword(final String password)
  {
    this.password = password;
  }

  public String getDatabase()
  {
    return database;
  }

  public void setDatabase(final String database)
  {
    this.database = database;
  }

  public String getRetentionPolicy()
  {
    return retentionPolicy;
  }

  public void setRetentionPolicy(final String retentionPolicy)
  {
    this.retentionPolicy = retentionPolicy;
  }

  public int getWriteTimeout()
  {
    return writeTimeout;
  }

  public void setWriteTimeout(int writeTimeout)
  {
    this.writeTimeout = writeTimeout;
  }

  public int getConnectTimeout()
  {
    return connectTimeout;
  }

  public void setConnectTimeout(int connectTimeout)
  {
    this.connectTimeout = connectTimeout;
  }

  public int getReadTimeout()
  {
    return readTimeout;
  }

  public void setReadTimeout(int readTimeout)
  {
    this.readTimeout = readTimeout;
  }

  public boolean isGzip()
  {
    return gzip;
  }

  public void setGzip(boolean gzip)
  {
    this.gzip = gzip;
  }
}
