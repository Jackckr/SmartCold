package com.example.yananxu.smartcold.com.example.yananxu.smartcold.rdcresource;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.StrictMode;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Spinner;

import com.example.yananxu.smartcold.R;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.util.HttpNetUtil;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yanan.xu on 16/9/1.
 */
public class RdcActivity extends Activity{

    private String baseUrl = "http://liankur.com/";// 定义基地址
    private List<Map<String, Object>> list =  new ArrayList<Map<String, Object>>();
    private String []sqm_list = {"面积","不限","<1k","1k~3k","3k~6k","6k~12k","12k~20k",">20k"};
    private ListView datalist; 				// 定义ListView组件
    private Spinner citySpinner;
    private Spinner manageSpinner;
    private Spinner tempSpinner;
    private Spinner sqmSpinner;
    private SimpleAdapter simpleAdapter = null; 		// 适配器
    private int currentPage = 1;
    private int maxPages = 10;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        super.setContentView(R.layout.activity_rdclist); 		// 将组件添加到屏幕之中
        this.datalist = (ListView) super.findViewById(R.id.listdata);// 取得组件

        List<String> rdcName = new ArrayList<String>();
        List<String> rdcAddress = new ArrayList<String>();
        List<String> rdcId = new ArrayList<String>();
        List<String> cityList = new ArrayList<String>();
        final List<String> rdcLogo = new ArrayList<String>();
        cityList.add("城市");
        cityList.add("不限");
        List<String> manageList = new ArrayList<String>();
        manageList.add("经营");
        manageList.add("不限");
        List<String> tempList = new ArrayList<String>();
        tempList.add("温度");
        tempList.add("不限");
        List<String> sqmList = new ArrayList<String>();

        //获得面积相关的过滤条件
        for(String sqm_str:sqm_list) {
            sqmList.add(sqm_str);
        }

        //获取显示列表数据
          StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().detectDiskReads().detectDiskWrites().detectNetwork().penaltyLog().build());
          StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder().detectLeakedSqlLiteObjects().detectLeakedClosableObjects().penaltyLog().penaltyDeath().build());
          String url = baseUrl + "i/rdc/getRDCList";
        String cityUrl = baseUrl + "i/city/findProvinceList";
        String teAndMtUrl = baseUrl + "i/rdc/getRDCFilterData";

        //获取区域相关的过滤条件
        String cityStr = HttpNetUtil.getRequest(cityUrl,null);
        //获取温度相关的过滤条件和经营相关的过滤条件
        String teAndMtStr = HttpNetUtil.getRequest(teAndMtUrl,null);
        try{
            JSONArray cityArray = new JSONArray(cityStr);
            JSONArray tes = new JSONObject(teAndMtStr).getJSONObject("entity").getJSONArray("te");
            JSONArray mts = new JSONObject(teAndMtStr).getJSONObject("entity").getJSONArray("mt");
            for(int i=0;i<cityArray.length();i++){
                JSONObject city = (JSONObject) cityArray.opt(i);
                System.out.println(city.getString("provinceName"));
                cityList.add(city.getString("provinceName"));
            }
            for (int i=0;i<tes.length();i++){
                JSONObject te = (JSONObject) tes.opt(i);
                tempList.add(te.getString("type"));
            }
            for (int i=0;i<mts.length();i++){
                JSONObject mt = (JSONObject) mts.opt(i);
                manageList.add(mt.getString("type"));
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        citySpinner = (Spinner) findViewById(R.id.citys);
        manageSpinner = (Spinner) findViewById(R.id.mes);
        tempSpinner = (Spinner) findViewById(R.id.tms);
        sqmSpinner = (Spinner) findViewById(R.id.sms);

        ArrayAdapter<String> cityAdapter=new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item, cityList);
        cityAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        citySpinner .setAdapter(cityAdapter);
        citySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view,
                                       int pos, long id) {
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Another interface callback
            }
        });
        ArrayAdapter<String> teAdapter=new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item, tempList);
        cityAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        tempSpinner .setAdapter(teAdapter);
        tempSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view,
                                       int pos, long id) {
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Another interface callback
            }
        });
        ArrayAdapter<String> mtAdapter=new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item, manageList);
        cityAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        manageSpinner .setAdapter(mtAdapter);
        manageSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view,
                                       int pos, long id) {
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Another interface callback
            }
        });
        ArrayAdapter<String> sqAdapter=new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item, sqmList);
        cityAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        sqmSpinner .setAdapter(sqAdapter);
        sqmSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view,
                                       int pos, long id) {
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Another interface callback
            }
        });

        Runnable httpThread = new Runnable() {
            @Override
            public void run() {

            }
        };

        HttpPost httpRequest = null;
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        HttpResponse httpResponse = null;
        //create post connection
        httpRequest = new HttpPost(url);
        //post params
        params.add(new BasicNameValuePair("pageNum","1"));
        params.add(new BasicNameValuePair("pageSize","10"));
        params.add(new BasicNameValuePair("sqm",""));
        params.add(new BasicNameValuePair("storagetempertype",""));
        params.add(new BasicNameValuePair("managementType",""));
        params.add(new BasicNameValuePair("provinceid",""));
        params.add(new BasicNameValuePair("keyword",""));

        HttpClient httpClient = new DefaultHttpClient();
        try{
        //发送Http Request  
        httpRequest.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
        //取得Http Response  
        httpResponse= httpClient.execute(httpRequest);

            System.out.println("visitor");
        //若状态码为200  
        if(httpResponse.getStatusLine().getStatusCode()==200) {

            String strResult = EntityUtils.toString(httpResponse.getEntity());
            JSONArray jsonArray = new JSONObject(strResult).getJSONArray("data");
            for(int i=0;i<jsonArray.length();i++){
                JSONObject jsonRdc = (JSONObject)jsonArray.opt(i);
                rdcId.add(jsonRdc.getString("id"));
                rdcName.add(jsonRdc.getString("name"));
                rdcAddress.add(jsonRdc.getString("address"));
                rdcLogo.add(jsonRdc.getString("logo"));
                System.out.println(jsonRdc.getString("name") + jsonRdc.getString("address") + "/n");
            }
        }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            httpClient.getConnectionManager().shutdown();
        }

        for (int x = 0; x < rdcName.size(); x++) {	// 循环设置数据
            Map<String, Object> map = new HashMap<String,Object>();
            map.put("name", rdcName.get(x)); 		// 设置_id组件显示数据
            map.put("address", rdcAddress.get(x)); 		// 设置name组件显示数据
            map.put("id", rdcId.get(x));
            map.put("img", getBitmap(rdcLogo.get(x)));
            this.list.add(map); 		// 增加数据
        }

        this.simpleAdapter = new SimpleAdapter(this, 	// 实例化SimpleAdapter
                this.list,R.layout.data_list, 	// 要使用的显示模板
                new String[] { "id","name", "address","img" }, // 定义要显示的Map的Key
                new int[] { R.id.id, R.id.name,R.id.address,R.id.img });// 与模板中的组件匹配
        this.simpleAdapter.setViewBinder(new SimpleAdapter.ViewBinder() {

            public boolean setViewValue(View view, Object data,
                                        String textRepresentation) {
                //判断是否为我们要处理的对象
                if(view instanceof ImageView && data instanceof Bitmap){
                    ImageView iv = (ImageView) view;

                    iv.setImageBitmap((Bitmap) data);
                    return true;
                }else
                    return false;
            }
        });
        this.datalist.setAdapter(this.simpleAdapter);	// 设置显示数据
        this.datalist.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView absListView, int scrollState) {

                // 当不滚动时
                if (scrollState == SCROLL_STATE_IDLE) {
                    //判断是否滚动到底部
                    if (absListView.getLastVisiblePosition() == absListView.getCount() - 1) {
                        if(currentPage < maxPages){
                            currentPage++;
                            System.out.println("请求数据doing");
                            List<String> rdcName = new ArrayList<String>();
                            List<String> rdcAddress = new ArrayList<String>();
                            List<String> rdcId = new ArrayList<String>();
                            List<String> rdcLogo = new ArrayList<String>();

                            StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().detectDiskReads().detectDiskWrites().detectNetwork().penaltyLog().build());
                            StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder().detectLeakedSqlLiteObjects().detectLeakedClosableObjects().penaltyLog().penaltyDeath().build());
                            String url = baseUrl + "i/rdc/getRDCList";
                            HttpPost httpRequest = null;

                            List<NameValuePair> params = new ArrayList<NameValuePair>();
                            HttpResponse httpResponse = null;
                            //create post connection
                            httpRequest = new HttpPost(url);
                            //post params
                            params.add(new BasicNameValuePair("pageNum",currentPage+""));
                            params.add(new BasicNameValuePair("pageSize","10"));
                            params.add(new BasicNameValuePair("sqm",""));
                            params.add(new BasicNameValuePair("storagetempertype",""));
                            params.add(new BasicNameValuePair("managementType",""));
                            params.add(new BasicNameValuePair("provinceid",""));
                            params.add(new BasicNameValuePair("keyword",""));
                            try{
                                //发送Http Request  
                                httpRequest.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
                                //取得Http Response  
                                httpResponse= new DefaultHttpClient().execute(httpRequest);

                                System.out.println("visitor");
                                //若状态码为200  
                                if(httpResponse.getStatusLine().getStatusCode()==200) {

                                    String strResult = EntityUtils.toString(httpResponse.getEntity());
                                    JSONArray jsonArray = new JSONObject(strResult).getJSONArray("data");
                                    for(int i=0;i<jsonArray.length();i++){
                                        JSONObject jsonRdc = (JSONObject)jsonArray.opt(i);
                                        rdcId.add(jsonRdc.getString("id"));
                                        rdcName.add(jsonRdc.getString("name"));
                                        rdcAddress.add(jsonRdc.getString("address"));
                                        rdcLogo.add(jsonRdc.getString("logo"));
                                        //           System.out.println(jsonRdc.getString("name") + jsonRdc.getString("address") + "/n");
                                    }
                                }
                            }catch (Exception e){
                                e.printStackTrace();
                            }

                            for (int x = 0; x < rdcName.size(); x++) {	// 循环设置数据
                                Map<String, Object> map = new HashMap<String,Object>();
                                map.put("img", getBitmap(rdcLogo.get(x)));
                                map.put("name", rdcName.get(x)); 		// 设置_id组件显示数据
                                map.put("address", rdcAddress.get(x)); 		// 设置name组件显示数据
                                map.put("id", rdcId.get(x));
                                list.add(map); 		// 增加数据
                            }
                        }
                        System.out.println("请求数据done");
                        simpleAdapter.notifyDataSetChanged();
                        return;
                    }
                }
            }

            @Override
            public void onScroll(AbsListView absListView, int firstVisibleItem, int visibleItemCount, int totalItemCount) {

            }
        });
        this.datalist.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {

                Map<String,String> map = (Map<String, String>) datalist.getItemAtPosition(i);
                Intent intent = new Intent();
                intent.setClass(RdcActivity.this,RdcDetailActivity.class);
                intent.putExtra("id",map.get("id"));
                startActivity(intent);
                // tip
     //           String text = datalist.getItemAtPosition(i).toString();
     //           String text = map.get("id");
     //           Toast.makeText(getApplicationContext(),text, Toast.LENGTH_LONG).show();
            }
        });

    }

    public Bitmap getBitmap(String imageUrl){
        Bitmap mBitmap = null;
        try {
            URL url = new URL(imageUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            InputStream is = conn.getInputStream();
            mBitmap = BitmapFactory.decodeStream(is);

        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return mBitmap;
    }

}
