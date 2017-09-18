package com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.ClipData;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Parcelable;
import android.provider.MediaStore;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.Spinner;
import android.widget.TextView;

import com.example.yananxu.smartcold.com.example.yananxu.smartcold.publish.PublishActivity;
import com.example.yananxu.smartcold.R;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.rdcresource.RdcActivity;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.share.ShareActivity;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.rdc360.RdcThreeSixZeroActivity;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.rdcmap.RdcMapActivity;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.rdctempget.TempGetActivity;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.util.SlideShowView;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
/**
 * Created by yanan.xu on 16/10/15.
 */
public class MainActivity extends Activity{

    private ProgressDialog dialog;
    private WebView webView;
    private ImageButton rdcBtn;
    private ImageButton shareBtn;
    private ImageButton mapBtn;
    private ImageButton publishBtn;
    private ImageButton tempBtn;
    private ImageButton sc360Btn;
    private SlideShowView mSlideShowView;
    private List<String> list = new ArrayList<String>();
    private ArrayAdapter<String> adapter;
    private Spinner mySpinner;
    private TextView myTextView;
    private ValueCallback<Uri> mUploadMessage;// 表单的数据信息
    private ValueCallback<Uri[]> mUploadCallbackAboveL;
    private final static int FILECHOOSER_RESULTCODE = 1;// 表单的结果回调
    private Uri imageUri;

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //UMShareAPI.get(context).onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (null == mUploadMessage && null == mUploadCallbackAboveL) return;
            Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
            if (mUploadCallbackAboveL != null) {
                onActivityResultAboveL(requestCode, resultCode, data);
            } else if (mUploadMessage != null) {
                Log.e("result", result + "");
                if (result == null) {
                    mUploadMessage.onReceiveValue(imageUri);
                    mUploadMessage = null;
                    Log.e("imageUri", imageUri + "");
                } else {
                    mUploadMessage.onReceiveValue(result);
                    mUploadMessage = null;
                }
            }
        }
    }

    @SuppressWarnings("null")
    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    private void onActivityResultAboveL(int requestCode, int resultCode, Intent data) {
        if (requestCode != FILECHOOSER_RESULTCODE || mUploadCallbackAboveL == null) {
            return;
        }

        Uri[] results = null;
        if (resultCode == Activity.RESULT_OK) {
            if (data == null) {
                results = new Uri[]{imageUri};
            } else {
                String dataString = data.getDataString();
                ClipData clipData = data.getClipData();
                if (clipData != null) {
                    results = new Uri[clipData.getItemCount()];
                    for (int i = 0; i < clipData.getItemCount(); i++) {
                        ClipData.Item item = clipData.getItemAt(i);
                        results[i] = item.getUri();
                    }
                }
                if (dataString != null)
                    results = new Uri[]{Uri.parse(dataString)};
            }
        }
        if (results != null) {
            mUploadCallbackAboveL.onReceiveValue(results);
            mUploadCallbackAboveL = null;
        } else {
            results = new Uri[]{imageUri};
            mUploadCallbackAboveL.onReceiveValue(results);
            mUploadCallbackAboveL = null;
        }
        return;
    }

    private void take() {
        File imageStorageDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "MyApp");
        if (!imageStorageDir.exists()) {
            imageStorageDir.mkdirs();
        }
        File file = new File(imageStorageDir + File.separator + "IMG_" + String.valueOf(System.currentTimeMillis()) + ".jpg");
        imageUri = Uri.fromFile(file);
        final List<Intent> cameraIntents = new ArrayList<Intent>();
        final Intent captureIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        final PackageManager packageManager = getPackageManager();
        final List<ResolveInfo> listCam = packageManager.queryIntentActivities(captureIntent, 0);
        for (ResolveInfo res : listCam) {
            final String packageName = res.activityInfo.packageName;
            final Intent i = new Intent(captureIntent);
            i.setComponent(new ComponentName(res.activityInfo.packageName, res.activityInfo.name));
            i.setPackage(packageName);
            i.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
            cameraIntents.add(i);
        }
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("image/*");
        Intent chooserIntent = Intent.createChooser(i, "Image Chooser");
        chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, cameraIntents.toArray(new Parcelable[]{}));
    //    chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, "");
        startActivityForResult(chooserIntent, FILECHOOSER_RESULTCODE);
    }

    private TextView textView;
    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

//        List<Integer> imageUris=new ArrayList<>();
//        imageUris.add(R.drawable.banner1);
//        imageUris.add(R.drawable.banner2);
//        imageUris.add(R.drawable.banner3);
////        mSlideShowView=(SlideShowView)findViewById(R.id.slideshowView);
////        mSlideShowView.setImageUris(imageUris);
//        rdcBtn = (ImageButton) findViewById(R.id.rdcbtn);
//        shareBtn = (ImageButton) findViewById(R.id.sharebtn);
//        mapBtn = (ImageButton) findViewById(R.id.mapbtn);
//        publishBtn = (ImageButton) findViewById(R.id.publishbtn);
//        tempBtn = (ImageButton) findViewById(R.id.tempbtn);
//        sc360Btn = (ImageButton) findViewById(R.id.sc360btn);
//
//        list.add("上海");
//        list.add("北京");
//        list.add("深圳");
//        list.add("福州");
//        list.add("厦门");
//        mySpinner = (Spinner)findViewById(R.id.Spinner_city);
//        myTextView = (TextView)findViewById(R.id.myTextView);
//        adapter = new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item, list);
//        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
//        mySpinner.setAdapter(adapter);
//        //第五步：为下拉列表设置各种事件的响应，这个事响应菜单被选中
//        mySpinner.setOnItemSelectedListener(new Spinner.OnItemSelectedListener(){
//            public void onItemSelected(AdapterView<?> arg0, View arg1, int arg2, long arg3) {
//                // TODO Auto-generated method stub
//                myTextView.setText("您选择的是："+ adapter.getItem(arg2));
//                arg0.setVisibility(View.VISIBLE);
//            }
//            public void onNothingSelected(AdapterView<?> arg0) {
//                // TODO Auto-generated method stub
//                myTextView.setText("NONE");
//                arg0.setVisibility(View.VISIBLE);
//            }
//        });
//        mySpinner.setOnTouchListener(new Spinner.OnTouchListener(){
//            public boolean onTouch(View v, MotionEvent event) {
//                return false;
//            }
//        });
//
//        rdcBtn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//                System.out.println("rdcBtn click");
//                Intent intent = new Intent();
//                intent.setClass(MainActivity.this,RdcActivity.class);
//                startActivity(intent);
//
//            }
//        });
//
//        shareBtn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//                System.out.println("shareBtn click");
//                Intent intent =new Intent();
//                intent.setClass(MainActivity.this,ShareActivity.class);
//                startActivity(intent);
//
//            }
//        });
//        mapBtn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//                System.out.println("shareBtn click");
//                Intent intent =new Intent();
//                intent.setClass(MainActivity.this,RdcMapActivity.class);
//                startActivity(intent);
//
//            }
//        });
//        publishBtn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//                System.out.println("shareBtn click");
//                Intent intent =new Intent();
//                intent.setClass(MainActivity.this,PublishActivity.class);
//                startActivity(intent);
//
//            }
//        });
//        tempBtn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//                System.out.println("shareBtn click");
//                Intent intent =new Intent();
//                intent.setClass(MainActivity.this,TempGetActivity.class);
//                startActivity(intent);
//
//            }
//        });
//        sc360Btn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//                System.out.println("shareBtn click");
//                Intent intent =new Intent();
//                intent.setClass(MainActivity.this,RdcThreeSixZeroActivity.class);
//                startActivity(intent);
//
//            }
//        });
        webView = (WebView) findViewById(R.id.webview);
        webView.setBackgroundColor(0);

        WebSettings settings = webView.getSettings();
        settings.setSupportZoom(true);          //支持缩放
        settings.setBuiltInZoomControls(true);  //启用内置缩放装置
        settings.setJavaScriptEnabled(true);    //启用js脚本
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setPluginState(WebSettings.PluginState.ON);
        settings.setDomStorageEnabled(true);
        settings.setAppCacheMaxSize(1024*1024*8);
        String appCatchPath = getApplicationContext().getCacheDir().getAbsolutePath();
        settings.setAppCachePath(appCatchPath);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setAllowContentAccess(true);
        settings.setAppCacheEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        settings.setSupportMultipleWindows(true);
        settings.setDatabaseEnabled(true);
        webView.requestFocusFromTouch();

        dialog = ProgressDialog.show(this,null,"数据加载中...");
        webView.loadUrl("http://m.liankur.com/");

//        webView.reload();

        webView.setOnKeyListener(new View.OnKeyListener(){
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_DOWN) {
                    if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
                        webView.goBack();   //后退
                        return true;    //已处理
                    }
                }
                return false;
            }
        });

        webView.setWebViewClient(new WebViewClient()
        {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                // TODO Auto-generated method stub
                super.onPageStarted(view, url, favicon);
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // TODO Auto-generated method stub
                view.loadUrl(url);
                return true;

            }
            @Override
            public void onPageFinished(WebView view, String url) {

                // TODO Auto-generated method stub

                super.onPageFinished(view, url);

            }
        }
    );

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                if (newProgress >= 100) {
//                    webView.setDf(new MainView.PlayFinish() {
//                        @Override
//                        public void After() {
                            dialog.dismiss();
//                        }
//                    });
                }
            }
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                mUploadCallbackAboveL = filePathCallback;
                take();
                return true;
            }
            //<3.0
            public void openFileChooser(ValueCallback<Uri> uploadMsg) {
                if (mUploadMessage != null) {
                    mUploadMessage.onReceiveValue(null);
                }
                mUploadMessage = uploadMsg;
                take();
            }
            //>3.0+
            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
                if (mUploadMessage != null) {
                    mUploadMessage.onReceiveValue(null);
                }
                mUploadMessage = uploadMsg;
                take();
            }
            //>4.1.1
            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
                if (mUploadMessage != null) {
                    mUploadMessage.onReceiveValue(null);
                }
                mUploadMessage = uploadMsg;
                take();
            }
        });

    }
}