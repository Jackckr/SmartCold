package com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame;

import android.content.Context;
import android.graphics.Canvas;
import android.util.AttributeSet;
import android.webkit.WebView;

/**
 * Created by yanan.xu on 16/10/17.
 * h5打包app时候使用
 */
public class MainView extends WebView{
    public interface PlayFinish{
        void After();
    }
    PlayFinish df;
    private boolean isRendered = false;
    public void setDf(PlayFinish playFinish) {
        this.df = playFinish;
    }
    public MainView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
    public MainView(Context context) {
        super(context);
    }
    //onDraw表示显示完毕
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if(!isRendered){
            isRendered = getContentHeight() >0;
            if(df!= null){
                df.After();
            }
        }
    }
}