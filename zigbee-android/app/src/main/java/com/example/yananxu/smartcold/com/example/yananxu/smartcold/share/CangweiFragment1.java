package com.example.yananxu.smartcold.com.example.yananxu.smartcold.share;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.SimpleAdapter;

import com.example.yananxu.smartcold.R;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by yanan.xu on 16/10/15.
 */
public class CangweiFragment1 extends Fragment{

    private String baseUrl = "http://liankur.com/";// 定义基地址
    private List<Map<String, Object>> list =  new ArrayList<Map<String, Object>>();
    private ListView datalist; 				// 定义ListView组件
    private SimpleAdapter simpleAdapter = null; 		// 适配器
    private int currentPage = 1;
    private int maxPages = 10;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        View view = inflater.inflate(R.layout.fragment_share_cangwei1, container, false);
        datalist = (ListView) view.findViewById(R.id.cangwei_listdata);
        List<String> rdcName = new ArrayList<String>();
        List<String> rdcAddress = new ArrayList<String>();
        List<String> rdcId = new ArrayList<String>();
        final List<String> rdcLogo = new ArrayList<String>();

//        //获取显示列表数据
//        StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().detectDiskReads().detectDiskWrites().detectNetwork().penaltyLog().build());
//        StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder().detectLeakedSqlLiteObjects().detectLeakedClosableObjects().penaltyLog().penaltyDeath().build());
//        String url = baseUrl + "/i/ShareRdcController/getSERDCList";
//
//        HttpPost httpRequest = null;
//        List<NameValuePair> params = new ArrayList<NameValuePair>();
//        HttpResponse httpResponse = null;
//        //create post connection
//        httpRequest = new HttpPost(url);
//        //post params
//        params.add(new BasicNameValuePair("pageNum","1"));
//        params.add(new BasicNameValuePair("pageSize","10"));
//        params.add(new BasicNameValuePair("type", "1"));
//        params.add(new BasicNameValuePair("datatype", "3"));
//
//        HttpClient httpClient = new DefaultHttpClient();
//        try{
//            //发送Http Request  
//            httpRequest.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
//            //取得Http Response  
//            httpResponse= httpClient.execute(httpRequest);
//            //若状态码为200  
//            if(httpResponse.getStatusLine().getStatusCode()==200) {
//
//                String strResult = EntityUtils.toString(httpResponse.getEntity());
//                JSONArray jsonArray = new JSONObject(strResult).getJSONArray("data");
//                for(int i=0;i<jsonArray.length();i++){
//                    JSONObject jsonRdc = (JSONObject)jsonArray.opt(i);
//                    rdcId.add(jsonRdc.getString("id"));
//                    if(jsonRdc.has("title"))
//                        rdcName.add(jsonRdc.getString("title"));
//                    else
//                        rdcName.add("");
//                    if(jsonRdc.has("detlAddress"))
//                        rdcAddress.add(jsonRdc.getString("detlAddress"));
//                    else
//                        rdcAddress.add("");
//                    if(jsonRdc.has("logo"))
//                        rdcLogo.add(jsonRdc.getString("logo"));
//                    else
//                        rdcLogo.add("");
//                }
//            }
//        }catch (Exception e){
//            e.printStackTrace();
//        }finally {
//            httpClient.getConnectionManager().shutdown();
//        }
//
//        for (int x = 0; x < rdcName.size(); x++) {	// 循环设置数据
//            Map<String, Object> map = new HashMap<String,Object>();
//            map.put("name", rdcName.get(x)); 		// 设置_id组件显示数据
//            map.put("address", rdcAddress.get(x)); 		// 设置name组件显示数据
//            map.put("id", rdcId.get(x));
//            try{
//                map.put("img", getBitmap(rdcLogo.get(x)));
//            }catch (Exception e) {
//                e.printStackTrace();
//            }
//            list.add(map); 		// 增加数据
//        }
//
//
//        this.simpleAdapter = new SimpleAdapter(this.getActivity().getApplicationContext(),	// 实例化SimpleAdapter
//                list,R.layout.cangwei_cz_data_list, 	// 要使用的显示模板
//                new String[] { "id","name", "address","img" }, // 定义要显示的Map的Key
//                new int[] { R.id.cangwei_cz_id, R.id.cangwei_cz_title,R.id.cangwei_cz_address,R.id.cangwei_cz_img});// 与模板中的组件匹配
//
//        this.simpleAdapter.setViewBinder(new SimpleAdapter.ViewBinder() {
//
//            public boolean setViewValue(View view, Object data,
//                                        String textRepresentation) {
//                //判断是否为我们要处理的对象
//                if(view instanceof ImageView && data instanceof Bitmap){
//                    ImageView iv = (ImageView) view;
//
//                    iv.setImageBitmap((Bitmap) data);
//                    return true;
//                }else
//                    return false;
//            }
//        });
//        datalist.setAdapter(this.simpleAdapter);	// 设置显示数据
//        datalist.setOnScrollListener(new AbsListView.OnScrollListener() {
//            @Override
//            public void onScrollStateChanged(AbsListView absListView, int scrollState) {
//
//                // 当不滚动时
//                if (scrollState == SCROLL_STATE_IDLE) {
//                    //判断是否滚动到底部
//                    if (absListView.getLastVisiblePosition() == absListView.getCount() - 1) {
//                        if(currentPage < maxPages){
//                            currentPage++;
//                            System.out.println("请求数据doing");
//                            List<String> rdcName = new ArrayList<String>();
//                            List<String> rdcAddress = new ArrayList<String>();
//                            List<String> rdcId = new ArrayList<String>();
//                            List<String> rdcLogo = new ArrayList<String>();
//
//                            StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().detectDiskReads().detectDiskWrites().detectNetwork().penaltyLog().build());
//                            StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder().detectLeakedSqlLiteObjects().detectLeakedClosableObjects().penaltyLog().penaltyDeath().build());
//                            String url = baseUrl + "/i/ShareRdcController/getSERDCList";
//                            HttpPost httpRequest = null;
//
//                            List<NameValuePair> params = new ArrayList<NameValuePair>();
//                            HttpResponse httpResponse = null;
//                            //create post connection
//                            httpRequest = new HttpPost(url);
//                            //post params
//                            params.add(new BasicNameValuePair("pageNum",currentPage+""));
//                            params.add(new BasicNameValuePair("pageSize","10"));
//                            params.add(new BasicNameValuePair("type", "1"));
//                            params.add(new BasicNameValuePair("datatype", "3"));
//                            try{
//                                //发送Http Request  
//                                httpRequest.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
//                                //取得Http Response  
//                                httpResponse= new DefaultHttpClient().execute(httpRequest);
//                                //若状态码为200  
//                                if(httpResponse.getStatusLine().getStatusCode()==200) {
//                                    String strResult = EntityUtils.toString(httpResponse.getEntity());
//                                    JSONArray jsonArray = new JSONObject(strResult).getJSONArray("data");
//                                    for(int i=0;i<jsonArray.length();i++){
//                                        JSONObject jsonRdc = (JSONObject)jsonArray.opt(i);
//                                        rdcId.add(jsonRdc.getString("id"));
//                                        if(jsonRdc.has("name"))
//                                            rdcName.add(jsonRdc.getString("name"));
//                                        else
//                                            rdcName.add("");
//                                        if(jsonRdc.has("detlAddress"))
//                                            rdcAddress.add(jsonRdc.getString("detlAddress"));
//                                        else
//                                            rdcAddress.add("");
//                                        if(jsonRdc.has("logo"))
//                                            rdcLogo.add(jsonRdc.getString("logo"));
//                                        else
//                                            rdcLogo.add("");
//                                    }
//                                }
//                            }catch (Exception e){
//                                e.printStackTrace();
//                            }
//
//                            for (int x = 0; x < rdcName.size(); x++) {	// 循环设置数据
//                                Map<String, Object> map = new HashMap<String,Object>();
//                                try {
//                                    map.put("img", getBitmap(rdcLogo.get(x)));
//                                }catch (Exception e){
//                                    e.printStackTrace();
//                                }finally {
//                                    map.put("name", rdcName.get(x)); 		// 设置_id组件显示数据
//                                    map.put("address", rdcAddress.get(x)); 		// 设置name组件显示数据
//                                    map.put("id", rdcId.get(x));
//                                    list.add(map); 		// 增加数据
//                                }
//                            }
//                        }
//                        System.out.println("请求数据done");
//                        simpleAdapter.notifyDataSetChanged();
//                        return;
//                    }
//                }
//            }
//
//            @Override
//            public void onScroll(AbsListView absListView, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
//
//            }
//        });
//        datalist.setOnItemClickListener(new AdapterView.OnItemClickListener() {
//            @Override
//            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
//
//                Map<String,String> map = (Map<String, String>) datalist.getItemAtPosition(i);
////                Intent intent = new Intent();
////                intent.setClass(RdcActivity.this,RdcDetailActivity.class);
////                intent.putExtra("id",map.get("id"));
////                startActivity(intent);
//                System.out.println("*****************" + map.get("id"));
//            }
//        });
        return view;
    }

    public Bitmap getBitmap(String imageUrl) throws Exception{
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
