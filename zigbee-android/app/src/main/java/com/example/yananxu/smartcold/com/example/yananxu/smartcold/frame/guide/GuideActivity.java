package com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame.guide;

/**
 * Created by yanan.xu on 16/10/15.
 */
import java.util.ArrayList;
import java.util.List;

import android.graphics.PixelFormat;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.Window;
import android.view.WindowManager;

import com.example.yananxu.smartcold.R;

public class GuideActivity extends FragmentActivity{

    /**
     * 作为页面容器的ViewPager
     */
    ViewPager mViewPager;
    /**
     * 页面集合
     */
    List<Fragment> fragmentList;

    /**
     * 3个Fragment（页面）
     */
    OneFragment oneFragment;
    TwoFragment twoFragment;
    ThreeFragment threeFragment;

    //屏幕宽度
    int screenWidth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFormat(PixelFormat.RGBA_8888);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_DITHER);
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_guide);

        mViewPager=(ViewPager) findViewById(R.id.viewpager);

        fragmentList=new ArrayList<Fragment>();
        oneFragment=new OneFragment();
        twoFragment=new TwoFragment();
        threeFragment = new ThreeFragment();

        fragmentList.add(oneFragment);
        fragmentList.add(twoFragment);
        fragmentList.add(threeFragment);

        screenWidth=getResources().getDisplayMetrics().widthPixels;

        mViewPager.setAdapter(new MyFrageStatePagerAdapter(getSupportFragmentManager()));
    }

    /**
     * 定义自己的ViewPager适配器。
     * 也可以使用FragmentPagerAdapter。关于这两者之间的区别，可以自己去搜一下。
     */
    class MyFrageStatePagerAdapter extends FragmentStatePagerAdapter {

        public MyFrageStatePagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            return fragmentList.get(position);
        }

        @Override
        public int getCount() {
            return fragmentList.size();
        }
    }

}
