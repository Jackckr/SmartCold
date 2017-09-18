package com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.example.yananxu.smartcold.R;

/**
 * Created by yanan.xu on 16/9/6.
 */
public class MeActivity extends Activity {

    private WebView meView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_me);

    }
}
