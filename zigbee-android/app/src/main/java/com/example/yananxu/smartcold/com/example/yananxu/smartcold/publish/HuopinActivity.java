package com.example.yananxu.smartcold.com.example.yananxu.smartcold.publish;

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
public class HuopinActivity extends FragmentActivity implements View.OnClickListener{

    private Button chuzuBtn;
    private Button qiuzuBtn;
    public static final int FRAGMENT_ONE=0;
    public static final int FRAGMENT_TWO=1;
    public FragmentManager fragmentManager;
    private HuopinFragment1 oneFm;
    private HuopinFragment2 twoFm;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_publish_huopin);

        fragmentManager = getSupportFragmentManager();
        chuzuBtn = (Button) findViewById(R.id.chushou);
        qiuzuBtn = (Button) findViewById(R.id.qiugou);

        chuzuBtn.setOnClickListener(this);
        qiuzuBtn.setOnClickListener(this);

    }
        @Override
        public void onClick(View v) {
            switch (v.getId()){

                case R.id.chushou:
                    showFragment(FRAGMENT_ONE);
                    break;
                case R.id.qiugou:
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
                    oneFm = new HuopinFragment1();
                    ft.add(R.id.huopin_content, oneFm);
                }else {
                    ft.show(oneFm);
                }

                break;
            case FRAGMENT_TWO:
                if (twoFm == null){
                    twoFm = new HuopinFragment2();
                    ft.add(R.id.huopin_content, twoFm);
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

