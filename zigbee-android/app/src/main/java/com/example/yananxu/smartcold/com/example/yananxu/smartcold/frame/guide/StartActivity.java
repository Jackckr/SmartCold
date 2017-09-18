package com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame.guide;

import android.app.Activity;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Bundle;
import android.os.Handler;
import android.view.WindowManager;
import android.webkit.WebView;

import com.example.yananxu.smartcold.R;

/**
 * Created by yanan.xu on 16/10/15.
 */
public class StartActivity extends Activity{

    private WebView firstWebview;

    final String URL = "http://m.liankur.com/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFormat(PixelFormat.RGBA_8888);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_DITHER);

        setContentView(R.layout.activity_start);

        new Handler().postDelayed(new Runnable() {
            public void run() {
                Intent mainIntent = new Intent(StartActivity.this, WelcomeActivity.class);
                StartActivity.this.startActivity(mainIntent);
                StartActivity.this.finish();
            }
        }, 2000);
    }
}
