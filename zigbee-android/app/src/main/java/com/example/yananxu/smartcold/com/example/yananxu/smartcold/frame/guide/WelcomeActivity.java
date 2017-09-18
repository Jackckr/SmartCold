package com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame.guide;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.PixelFormat;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;

import com.example.yananxu.smartcold.R;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame.MainActivity;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame.MenuMainActivity;

/**
 * Created by yanan.xu on 16/10/15.
 */

public class WelcomeActivity extends Activity {

    //判断用户是否是第一次使用该应用
    private boolean isFirstUse = false;
    //延时时间，用于由欢迎界面进入另外的页面的延时效果
    private static final int TIME = 0;
    private static final int TO_MAIN = 100001;
    private static final int TO_GUIDE = 100002;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFormat(PixelFormat.RGBA_8888);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_DITHER);
        setContentView(R.layout.welcome);
        init();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode==KeyEvent.KEYCODE_BACK){
            Intent i= new Intent(Intent.ACTION_MAIN);  //主启动，不期望接收数据

            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);       //新的activity栈中开启，或者已经存在就调到栈前

            i.addCategory(Intent.CATEGORY_HOME);            //添加种类，为设备首次启动显示的页面

            startActivity(i);
        }
        return super.onKeyDown(keyCode, event);
    }

    //由于不能在主线程中直接延时，所以用一个Handler来处理发送过来的消息
    Handler myHandler = new Handler() {
        public void handleMessage(android.os.Message msg) {
            switch (msg.what) {
                case TO_MAIN:
                    //h5的时候使用
                    Intent i1 = new Intent(WelcomeActivity.this, MainActivity.class);
                    //原生app使用
                    //Intent i1 = new Intent(WelcomeActivity.this, MenuMainActivity.class);
                    startActivity(i1);
                    finish();
                    break;
                case TO_GUIDE:
                    Intent i2 = new Intent(WelcomeActivity.this, GuideActivity.class);
                    startActivity(i2);
                    finish();
                    break;
            }
        }
    };

    private void init() {
        //将用户是否是第一次使用的值用SharedPreferences存储到本地
        SharedPreferences perPreferences = getSharedPreferences("JohnTsai", MODE_PRIVATE);
        isFirstUse = perPreferences.getBoolean("isFirstUse", true);
        if (!isFirstUse) {
            myHandler.sendEmptyMessageDelayed(TO_MAIN, TIME);
        } else {
            myHandler.sendEmptyMessageDelayed(TO_GUIDE, TIME);
            SharedPreferences.Editor editor = perPreferences.edit();
            editor.putBoolean("isFirstUse", false);
            editor.commit();
        }

    }
}
