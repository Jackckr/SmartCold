package com.example.yananxu.smartcold.com.example.yananxu.smartcold.publish;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

import com.example.yananxu.smartcold.R;

/**
 * Created by yanan.xu on 16/9/1.
 */
public class PublishActivity extends Activity {


    private ImageButton publish_rdc_btn;
    private ImageButton publish_cangwei_btn;
    private ImageButton publish_huopin_btn;
    private ImageButton publish_lengku_btn;

    public void  onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_publish);

        publish_rdc_btn = (ImageButton) findViewById(R.id.publish_rdc_btn);
        publish_cangwei_btn = (ImageButton) findViewById(R.id.publish_cangwei_btn);
        publish_huopin_btn = (ImageButton) findViewById(R.id.publish_huopin_btn);
        publish_lengku_btn = (ImageButton) findViewById(R.id.publish_lengku_btn);

        publish_rdc_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setClass(PublishActivity.this, RdcActivity.class);
                startActivity(intent);
            }
        });

        publish_cangwei_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setClass(PublishActivity.this, CangweiActivity.class);
                startActivity(intent);
            }
        });

        publish_huopin_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setClass(PublishActivity.this, HuopinActivity.class);
                startActivity(intent);
            }
        });

        publish_lengku_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setClass(PublishActivity.this, LengyunActivity.class);
                startActivity(intent);
            }
        });
    }
}
