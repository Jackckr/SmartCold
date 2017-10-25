
package com.smartcold.manage.cold.api;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Scott
 */
import java.io.IOException;
import java.util.*;

public class WISECoreJNI {
  static {
    System.loadLibrary("WISECoreJNI"); // Load native library at runtime
  }

  // Declare a native method
  private native boolean core_initialize(String strTenantID, String strClientID, String strHostName, String strMAC);

  private native void core_uninitialize();

  private native boolean core_tag_set(String strTag);

  private native boolean core_product_info_set(String strSerialNum, String strParentID, String strVersion,
      String strType, String strProduct, String strManufacture);

  private native boolean core_account_bind(String strLoginID, String strLoginPW);

  private native boolean core_callback_set(WISECoreJNI CallbackInterface);

  private native boolean core_action_response(int cmdid, String sessoinid, boolean success, String tenantid,
      String devid);

  private native boolean core_heartbeatratequery_response(int heartbeatrate, String sessoinid, String tenantid,
      String devid);

  private native boolean core_tls_set(String cafile, String capath, String certfile, String keyfile, String password);

  private native boolean core_tls_psk_set(String psk, String identity, String ciphers);

  private native boolean core_connect(String strServerIP, int iServerPort, String strConnID, String strConnPW);

  private native void core_disconnect(boolean bForce);

  private native boolean core_device_register();

  private native boolean core_heartbeat_send();

  private native boolean core_publish(String topic, String pkt, long pktlength, int retain, int qos);

  private native boolean core_subscribe(String topic, int qos);

  private native boolean core_unsubscribe(String topic);

  private native String core_address_get();

  private native String core_error_string_get();

  // Callback functions
  public void on_connected() {
    System.out.println("JAVA on_connected");
    /*Create thread to send message after connected*/
    g_oConnect = new ConnectLoop();
    g_tConnect = new Thread(g_oConnect);
    g_tConnect.start();
  }

  public void on_lostconnected() {
    System.out.println("JAVA on_lostconnected");
    /*Stop the connect thread and add reconnect here*/
    try {
      if (g_tConnect != null) {
        g_oConnect.terminate();
        g_tConnect.join();
      }
    } catch (InterruptedException e) {
      String threadName = Thread.currentThread().getName();
      System.out.format("%s: %s%n", threadName, e.getLocalizedMessage());
    }
  }

  public void on_disconnected() {
    System.out.println("JAVA on_disconnected");
    /*Stop the connect thread*/
    try {
      if (g_tConnect != null) {
        g_oConnect.terminate();
        g_tConnect.join();
      }
    } catch (InterruptedException e) {
      String threadName = Thread.currentThread().getName();
      System.out.format("%s: %s%n", threadName, e.getLocalizedMessage());
    }
  }

  public void on_msgrecv(String topic, String pkt, long pktlength) {
    System.out.println("JAVA message received");
    System.out.println("Topic: " + topic);
    System.out.println("Packet: " + pkt);
    /*Handle received message*/
  }

  public void on_get_capablity(String pkt, long pktlength, String tenantid, String devid) {
    System.out.println("JAVA on_get_capablity");
    /*preserved for future design*/
  }

  public void on_autoreport_start(String pkt, long pktlength, String tenantid, String devid) {
    System.out.println("JAVA on_autoreport_start");
    if (g_oConnect != null) {
      /*Parse packet and get report interval, ex: 10000 = 10 sec.*/
      g_oConnect.report_start(10000);
    }
  }

  public void on_autoreport_stop(String pkt, long pktlength, String tenantid, String devid) {
    System.out.println("JAVA on_autoreport_stop");
    if (g_oConnect != null) {
      /*Parse packet and get report interval, ex: 10000 = 10 sec.*/
      g_oConnect.report_stop();
    }
  }

  public void on_rename(String name, int cmdid, String sessionid, String tenantid, String devid) {
    System.out.println("JAVA rename to: " + name);
    /*Update host name */
    g_wiseobj.core_action_response(cmdid, sessionid, true, tenantid, devid);
  }

  public void on_update(String loginID, String loginPW, int port, String path, String md5, int cmdid, String sessionid,
      String tenantid, String devid) {
    System.out.println("JAVA Update: " + loginID + ", " + loginPW + ", " + port + ", " + path + "," + md5);
    /*Handle agent update request the download URL: ftp://loginID:loginPW@<ServerIP>:port/path
       md5 is used to check the download file.
    */
    g_wiseobj.core_action_response(cmdid, sessionid, true, tenantid, devid);
    return;
  }

  public void on_server_reconnect(String tenantid, String devid) {
    System.out.println("JAVA on_server_reconnect");
    /*Server request to sync the agent status, agent send device registration again.*/
    g_wiseobj.core_device_register();
  }

  public long get_timetick() {
    System.out.println("JAVA get_timetick");
    /*Some platform may not support the time stamp, user nees to provide this data.*/
    long tick = System.currentTimeMillis();
    System.out.println("JAVA tick" + tick);
    return tick;
  }

  public void on_heartbeatrate_query(String sessionid, String tenantid, String devid) {
    System.out.println("JAVA on_heartbeatrate_query");
    /*Handle the heart beat rate query.*/
    g_wiseobj.core_heartbeatratequery_response(g_heartbeatrate, sessionid, tenantid, devid);
  }

  public void on_heartbeatrate_update(int heartbeatrate, String sessionid, String tenantid, String devid) {
    System.out.println("JAVA Heartbeat Rate Update: " + heartbeatrate + ", " + sessionid + ", " + devid);
    g_heartbeatrate = heartbeatrate;
    /*Handle the heart beat rate update.*/
    g_wiseobj.core_action_response(130/*wise_heartbeatrate_update_rep*/, sessionid, true, tenantid, devid);
    return;
  }

  // Test Driver
  static WISECoreJNI g_wiseobj;
  static int g_heartbeatrate = 60;
  Thread g_tConnect;
  ConnectLoop g_oConnect;
  static String g_strTenantID = "00000001-0000-0000-0000-000ADVANTECH";
  static String g_strDevID = "00000001-0000-0000-0000-305A3A77B1CC";
  static String g_strReport = "{\"agentID\":\"%s\",\"handlerName\":\"SUSIControl\",\"commCmd\":123,\"content\":{\"SUSIControl\":{\"Temperature\":{\"e\":[{\"n\":\"CPU\",\"v\":38},{\"n\":\"Platform\",\"v\":39}],\"bn\":\"Temperature\"}}}}";
  static String g_strReportTopic = "/wisepaas/%s/device/%s/devinfoack";

  /* Thread for agent connected.
   After connected, agent need to 
   1. send device registration info to server.
   2. send heart beat notify repeatedly.
   3. send report data.
  */
  public static class ConnectLoop implements Runnable {
    private volatile boolean m_running = true;
    private volatile boolean m_report = false;
    private volatile long m_interval = 0;

    public void terminate() {
      m_running = false;
    }

    public void report_start(long iterval) {
      m_report = true;
      m_interval = iterval;
    }

    public void report_stop() {
      m_report = false;
    }

    public void run() {
      long sendHBTime = 0;
      long sendRpTime = 0;
      String strTopic = String.format(g_strReportTopic, g_strTenantID, g_strDevID);
      String strData = String.format(g_strReport, g_strDevID);
      try {
        /*send device registration*/
        g_wiseobj.core_device_register();
        long curTime = System.currentTimeMillis();
        sendHBTime = curTime;
        sendRpTime = curTime;
        while (m_running) {
          curTime = System.currentTimeMillis();
          if (sendHBTime <= curTime) {
            /*send heart beat notify repeatedly*/
            g_wiseobj.core_heartbeat_send();
            sendHBTime = curTime + (g_heartbeatrate * 1000);
          }
          if (sendRpTime <= curTime && m_report) {
            /*send report data repeatedly*/
            g_wiseobj.core_publish(strTopic, strData, strData.length(), 0, 0);
            sendRpTime = curTime + (m_interval);

          }
          Thread.sleep(1000);
        }

      } catch (InterruptedException e) {
        String threadName = Thread.currentThread().getName();
        System.out.format("%s: %s%n", threadName, e.getLocalizedMessage());
      }
    }
  }

  public static void main(String[] args) {
    g_wiseobj = new WISECoreJNI();
    boolean bResult = false;
    bResult = g_wiseobj.core_initialize(g_strTenantID, g_strDevID, "TEST", "305A3A77B1CC"); // invoke the native method

    if (!bResult)
      System.out.println("core_initialize failed");
    else
      System.out.println("core_initialized");
    g_wiseobj.core_tag_set("RMM");
    g_wiseobj.core_product_info_set("305A3A77B1CC", "", "2.0.0", "IPC", "test", "test");
    g_wiseobj.core_account_bind("admin", "admin");
    g_wiseobj.core_callback_set(g_wiseobj);
    int SSLMode = 0;
    if (SSLMode == 1) {
      g_wiseobj.core_tls_set("server.crt", null, "ca.crt", "ca.key", "05155853");
    } else if (SSLMode == 2) {
      g_wiseobj.core_tls_psk_set("05155853", g_strDevID, null);
    }
    g_wiseobj.core_connect("172.22.12.29", 1883, "admin", "05155853");
    Scanner s = new Scanner(System.in);
    System.out.println("Enter return to exit:");
    s.nextLine();
    g_wiseobj.core_disconnect(false);
    g_wiseobj.core_uninitialize();
  }

}
