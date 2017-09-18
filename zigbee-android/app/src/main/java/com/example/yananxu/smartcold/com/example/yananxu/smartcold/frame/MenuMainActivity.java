package com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame;

import android.graphics.drawable.Drawable;
import android.widget.RadioButton;
import android.widget.RadioGroup.OnCheckedChangeListener;
import android.app.TabActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Window;
import android.widget.RadioGroup;
import android.widget.TabHost;

import com.example.yananxu.smartcold.R;

/**
 * Created by yanan.xu on 16/9/6.
 */
public class MenuMainActivity extends TabActivity implements OnCheckedChangeListener{

        private RadioGroup mainTab;
        private TabHost tabhost;
        private Intent iHome;
        private Intent iNews;
        private Intent iInfo;
        private Intent iSearch;
        private RadioButton radioButton0;
        private RadioButton radioButton1;
        private RadioButton radioButton2;
        private RadioButton radioButton3;

        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            requestWindowFeature(Window.FEATURE_NO_TITLE);
            setContentView(R.layout.activity_menu);
            mainTab=(RadioGroup)findViewById(R.id.main_tab);
            mainTab.setOnCheckedChangeListener(this);
            tabhost = getTabHost();

            iHome = new Intent(this, MainActivity.class);
            tabhost.addTab(tabhost.newTabSpec("iHome")
                    .setIndicator(getResources().getString(R.string.home), getResources().getDrawable(R.drawable.home1))
            .setContent(iHome));
            iNews = new Intent(this, NewsActivity.class);
            tabhost.addTab(tabhost.newTabSpec("iNews")
                    .setIndicator(getResources().getString(R.string.news), getResources().getDrawable(R.drawable.info1))
            .setContent(iNews));
            iInfo = new Intent(this, InfoActivity.class);
            tabhost.addTab(tabhost.newTabSpec("iInfo")
                    .setIndicator(getResources().getString(R.string.info), getResources().getDrawable(R.drawable.message1))
            .setContent(iInfo));
            iSearch = new Intent(this,MeActivity.class);
            tabhost.addTab(tabhost.newTabSpec("iMe")
                    .setIndicator(getResources().getString(R.string.me), getResources().getDrawable(R.drawable.username1))
            .setContent(iSearch));

            radioButton0 = (RadioButton) findViewById(R.id.radio_button0);
            radioButton1 = (RadioButton) findViewById(R.id.radio_button1);
            radioButton2 = (RadioButton) findViewById(R.id.radio_button2);
            radioButton3 = (RadioButton) findViewById(R.id.radio_button3);

        }
        public void onCheckedChanged(RadioGroup group, int checkedId) {

            switch(checkedId){
                case R.id.radio_button0:
                    Drawable drawable0 = getResources().getDrawable(R.drawable.home2);
                    drawable0.setBounds(0, 0, drawable0.getMinimumWidth(),
                            drawable0.getMinimumHeight());
                    Drawable drawable1 = getResources().getDrawable(R.drawable.info1);
                    drawable1.setBounds(0, 0, drawable1.getMinimumWidth(),
                            drawable1.getMinimumHeight());
                    Drawable drawable2 = getResources().getDrawable(R.drawable.message1);
                    drawable2.setBounds(0, 0, drawable2.getMinimumWidth(),
                            drawable2.getMinimumHeight());
                    Drawable drawable3 = getResources().getDrawable(R.drawable.username1);
                    drawable3.setBounds(0, 0, drawable3.getMinimumWidth(),
                            drawable3.getMinimumHeight());
                    radioButton0.setCompoundDrawablesWithIntrinsicBounds(null,
                            drawable0,null,null);
                    radioButton1.setCompoundDrawablesWithIntrinsicBounds(null,
                            drawable1,null,null);
                    radioButton2.setCompoundDrawablesWithIntrinsicBounds(null,
                            drawable2,null,null);
                    radioButton3.setCompoundDrawablesWithIntrinsicBounds(null,
                            drawable3,null,null);
                    radioButton0.setTextColor(getResources().getColorStateList(R.color.colorcheck));
                    radioButton1.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    radioButton2.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    radioButton3.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    this.tabhost.setCurrentTabByTag("iHome");
                    break;
                case R.id.radio_button1:
                    radioButton0.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.home1),null,null);
                    radioButton1.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.info2),null,null);
                    radioButton2.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.message1),null,null);
                    radioButton3.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.username1),null,null);
                    radioButton0.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    radioButton1.setTextColor(getResources().getColorStateList(R.color.colorcheck));
                    radioButton2.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    radioButton3.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    this.tabhost.setCurrentTabByTag("iNews");
                    break;
                case R.id.radio_button2:
                    radioButton0.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.home1),null,null);
                    radioButton1.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.info1),null,null);
                    radioButton2.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.message2),null,null);
                    radioButton3.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.username1),null,null);
                    radioButton0.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    radioButton1.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    radioButton2.setTextColor(getResources().getColorStateList(R.color.colorcheck));
                    radioButton3.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    this.tabhost.setCurrentTabByTag("iInfo");
                    break;
                case R.id.radio_button3:
                    radioButton0.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.home1),null,null);
                    radioButton1.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.info1),null,null);
                    radioButton2.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.message1),null,null);
                    radioButton3.setCompoundDrawablesWithIntrinsicBounds(null,
                            getResources().getDrawable(R.drawable.username2),null,null);
                    radioButton0.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    radioButton1.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    radioButton2.setTextColor(getResources().getColorStateList(R.color.colornocheck));
                    radioButton3.setTextColor(getResources().getColorStateList(R.color.colorcheck));
                    this.tabhost.setCurrentTabByTag("iMe");
                    break;
                }
            }
}
