package com.example.yananxu.smartcold.com.example.yananxu.smartcold.rdcresource;

import android.app.Activity;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.yananxu.smartcold.R;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.net.URL;


/**
 * Created by yanan.xu on 16/9/1.
 */

public class RdcDetailActivity extends Activity{

    private TextView textView;
    private TextView addressTextView;
    private TextView managetypeTextView;
    private TextView tempTextView;
    private TextView storageTextView;
    private TextView sqmTextView;
    private TextView phoneTextView;
    private TextView storagetruck0TextView;
    private TextView storagetruck1TextView;
    private TextView storagetruck2TextView;
    private TextView storagetruck3TextView;
    private TextView structTextView;
    private TextView addtimeTextView;
    private TextView coldtypeTextView;
    private ImageView detailImg;

    private String baseUrl = "http://liankur.com/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detailrdc);

        Intent intent = getIntent();
        int rdcId = Integer.parseInt(intent.getStringExtra("id"));

        System.out.println("*xuyan "+rdcId);
        String url = baseUrl + "/i/rdc/findRDCByID?rdcID=" + rdcId;
        String gdUrl = baseUrl + "/i/ShareRdcController/getSEGDList?pageNum=1&pageSize=2&rdcID=" + rdcId + "&datatype=1";
        String psUrl = baseUrl + "/i/ShareRdcController/getSEPSList?pageNum=1&pageSize=2&rdcID=" + rdcId + "&datatype=1";
        String rdcUrl = baseUrl + "/i/ShareRdcController/getSERDCList?pageNum=1&pageSize=2&rdcID=" + rdcId + "&datatype=1";
        String commentUrl = baseUrl + "/i/comment/findCommentsByRDCId?npoint=20&rdcID=" + rdcId;
        HttpGet httpRequest = new HttpGet(url);
        HttpClient httpClient = new DefaultHttpClient();
        HttpResponse httpResponse = null;
        HttpResponse gdhttpResponse = null;
        HttpResponse pshttpResponse = null;
        HttpResponse rdchttpResponse = null;
        HttpResponse commentResponse = null;

        try{
            httpResponse = httpClient.execute(httpRequest);
            if(httpResponse.getStatusLine().getStatusCode() == 200){
                String strResult = EntityUtils.toString(httpResponse.getEntity());
                JSONArray jsonArray = new JSONObject(strResult).getJSONArray("data");
                JSONObject jsonRdc = (JSONObject)jsonArray.opt(0);

                JSONArray jsonFiles = jsonRdc.getJSONArray("files");
                String jsonFile = (String)jsonFiles.opt(0);

                String id = jsonRdc.getString("id");
                String address = jsonRdc.getString("address");
                String rdcscore = jsonRdc.getString("rdcscore"); //星级
                String manageType = jsonRdc.getString("managetype");
                String storagetempertype = jsonRdc.getString("storagetempertype");
                String storagetype = jsonRdc.getString("storagetype");
                Integer sqm = jsonRdc.getInt("sqm");
                String cellphone = jsonRdc.getString("cellphone");
                String name = jsonRdc.getString("name");
                String addtime = jsonRdc.getString("addtime");
                Double capacity = jsonRdc.getDouble("capacity");
                String storagetruck = jsonRdc.getString("storagetruck");
                String storagetruck1 = jsonRdc.getString("storagetruck1");
                String storagetruck2 = jsonRdc.getString("storagetruck2");
                String storagetruck3 = jsonRdc.getString("storagetruck3");
                String storagetruck0 = jsonRdc.getString("storagetruck0");
                String files = jsonRdc.getString("files");
                String struct = "无";
                if(jsonRdc.has("struct"))
                    struct = jsonRdc.getString("struct");
                String coldtype = "无";
                if(jsonRdc.has("coldtype"))
                    coldtype = jsonRdc.getString("coldtype");
                if(jsonRdc.getString("coldtype").isEmpty())
                    coldtype = "无";
                System.out.println(addtime+" "+struct+" "+sqm);
                textView = (TextView) findViewById(R.id.detail);
                addressTextView = (TextView) findViewById(R.id.detailaddress);
                managetypeTextView = (TextView) findViewById(R.id.managetype);
                tempTextView = (TextView) findViewById(R.id.temptype);
                storageTextView = (TextView) findViewById(R.id.storagetype);
                sqmTextView = (TextView) findViewById(R.id.sqm);
                phoneTextView = (TextView) findViewById(R.id.phone);
                storagetruck0TextView = (TextView) findViewById(R.id.storagetruck0);
                storagetruck1TextView = (TextView) findViewById(R.id.storagetruck1);
                storagetruck2TextView = (TextView) findViewById(R.id.storagetruck2);
                storagetruck3TextView = (TextView) findViewById(R.id.storagetruck3);
                structTextView = (TextView) findViewById(R.id.struct);
                addtimeTextView = (TextView) findViewById(R.id.addtime);
                coldtypeTextView = (TextView) findViewById(R.id.coldtype);
                detailImg = (ImageView) findViewById(R.id.detailimg);

                addressTextView.setText(address);
                textView.setText(name);
                managetypeTextView.setText(manageType);
                tempTextView.setText(storagetempertype);
                storageTextView.setText(storagetype);
                sqmTextView.setText(sqm+"");
                phoneTextView.setText(cellphone);
                storagetruck0TextView.setText(storagetruck0);
                storagetruck1TextView.setText(storagetruck1);
                storagetruck2TextView.setText(storagetruck2);
                storagetruck3TextView.setText(storagetruck3);
                structTextView.setText(struct);
                addtimeTextView.setText(addtime);
                coldtypeTextView.setText(coldtype);
     //           System.out.println("****************"+jsonFiles.length()+"**"+jsonFile);
                try {
                    URL imgurl = new URL(jsonFile);
                    detailImg.setImageBitmap(BitmapFactory.decodeStream(imgurl.openStream()));
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            httpClient.getConnectionManager().shutdown();
        }

        HttpClient pshttpClient = new DefaultHttpClient();
        HttpGet pshttpRequest = new HttpGet(psUrl);
        try{
            pshttpResponse = pshttpClient.execute(pshttpRequest);
            if(pshttpResponse.getStatusLine().getStatusCode() == 200) {
                String strResult = EntityUtils.toString(pshttpResponse.getEntity());
                int total = Integer.parseInt(new JSONObject(strResult).getString("total"));
                System.out.println("ps request**************************" + strResult);
                if(total > 0)
                {
                    System.out.println("pslist************" + total);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            pshttpClient.getConnectionManager().shutdown();
        }

        HttpClient commentHttpClient = new DefaultHttpClient();
        HttpGet commenthttpRequest = new HttpGet(commentUrl);
        try{
            commentResponse = commentHttpClient.execute(commenthttpRequest);
            if(commentResponse.getStatusLine().getStatusCode() == 200){
                String strResult = EntityUtils.toString(commentResponse.getEntity());
                System.out.println("comments request**************************"+strResult);
                //        System.out.println("commentslist************"+total);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            commentHttpClient.getConnectionManager().shutdown();
        }

        HttpClient rdcHttpClient = new DefaultHttpClient();
        HttpGet rdchttpRequest = new HttpGet(rdcUrl);
        try{
            rdchttpResponse = rdcHttpClient.execute(rdchttpRequest);
            if(rdchttpResponse.getStatusLine().getStatusCode() == 200){
                String strResult = EntityUtils.toString(rdchttpResponse.getEntity());
                int total = Integer.parseInt(new JSONObject(strResult).getString("total"));
                System.out.println("rdc request**************************"+strResult);
                System.out.println("rdclist************"+total);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            rdcHttpClient.getConnectionManager().shutdown();
        }

        HttpClient gdHttpClient = new DefaultHttpClient();
        HttpGet gdhttpRequest = new HttpGet(gdUrl);
        try{
            gdhttpResponse = gdHttpClient.execute(gdhttpRequest);
            if(gdhttpResponse.getStatusLine().getStatusCode() == 200){
                String strResult = EntityUtils.toString(gdhttpResponse.getEntity());
                System.out.println("gd request**************************"+strResult);
                int total = Integer.parseInt(new JSONObject(strResult).getString("total"));
                System.out.println("gdlist***********"+total);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            gdHttpClient.getConnectionManager().shutdown();
        }
    }
}
