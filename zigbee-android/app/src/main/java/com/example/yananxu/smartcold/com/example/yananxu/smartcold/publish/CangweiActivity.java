package com.example.yananxu.smartcold.com.example.yananxu.smartcold.publish;

import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.view.View;
import android.widget.Button;

import com.example.yananxu.smartcold.R;

/**
 * Created by yanan.xu on 16/10/22.
 */
public class CangweiActivity extends FragmentActivity implements View.OnClickListener{

    private Button chuzuBtn;
    private Button qiuzuBtn;
    public static final int FRAGMENT_ONE=0;
    public static final int FRAGMENT_TWO=1;
    public FragmentManager fragmentManager;
    private CangweiFragment1 oneFm;
    private CangweiFragment2 twoFm;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_publish_cangwei);

        fragmentManager = getSupportFragmentManager();
        chuzuBtn = (Button) findViewById(R.id.chuzu);
        qiuzuBtn = (Button) findViewById(R.id.qiuzu);
        chuzuBtn.setTextColor(Color.rgb(50, 117, 194));
        qiuzuBtn.setTextColor(Color.rgb(205, 205, 193));

        chuzuBtn.setOnClickListener(this);
        qiuzuBtn.setOnClickListener(this);

        showFragment(FRAGMENT_ONE);

    }
        @Override
        public void onClick(View v) {
            switch (v.getId()){

                case R.id.chuzu:
                    chuzuBtn.setTextColor(Color.rgb(50, 117, 194));
                    qiuzuBtn.setTextColor(Color.rgb(205, 205, 193));
                    showFragment(FRAGMENT_ONE);
                    break;
                case R.id.qiuzu:
                    qiuzuBtn.setTextColor(Color.rgb(50, 117, 194));
                    chuzuBtn.setTextColor(Color.rgb(205, 205, 193));
                    showFragment(FRAGMENT_TWO);
                    break;

            }
        }

    public void showFragment(int index){

        FragmentTransaction ft=fragmentManager.beginTransaction();
        hideFragment(ft);

        switch (index){

            case FRAGMENT_ONE:
                /**
                 * 如果Fragment为空，就新建一个实例
                 * 如果不为空，就将它从栈中显示出来
                 */
                if (oneFm == null){
                    oneFm = new CangweiFragment1();
                    ft.add(R.id.cangwei_content, oneFm);
                }else {
                    ft.show(oneFm);
                }

                break;
            case FRAGMENT_TWO:
                if (twoFm == null){
                    twoFm = new CangweiFragment2();
                    ft.add(R.id.cangwei_content, twoFm);
                }else {
                    ft.show(twoFm);
                }

                break;
        }

        ft.commit();
    }

    public void hideFragment(FragmentTransaction ft){
        //如果不为空，就先隐藏起来
        if (oneFm!=null){
            ft.hide(oneFm);
        }
        if(twoFm!=null) {
            ft.hide(twoFm);
        }
    }

}

