package com.example.yananxu.smartcold.com.example.yananxu.smartcold.share;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

import com.example.yananxu.smartcold.R;

/**
 * Created by yanan.xu on 16/9/1.
 */
public class ShareActivity extends Activity {


    private ImageButton share_cangwei_btn;
    private ImageButton share_huopin_btn;
    private ImageButton share_lengyun_btn;

    public void  onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_share);

        share_cangwei_btn = (ImageButton) findViewById(R.id.share_cangwei_btn);
        share_huopin_btn = (ImageButton) findViewById(R.id.share_huopin_btn);
        share_lengyun_btn = (ImageButton) findViewById(R.id.share_lengku_btn);

        share_cangwei_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent =new Intent();
                intent.setClass(ShareActivity.this, CangweiActivity.class);
                startActivity(intent);
            }
        });

        share_huopin_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setClass(ShareActivity.this, HuopinActivity.class);
                startActivity(intent);

            }
        });

        share_lengyun_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setClass(ShareActivity.this, LengyunActivity.class);
                startActivity(intent);
            }
        });

    }
}
