package com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame.guide;

import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.yananxu.smartcold.R;

/**
 * Created by yanan.xu on 16/10/15.
 */
public class TwoFragment extends Fragment{
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        View view = inflater.inflate(R.layout.fragment2, container, false);
        return view;
    }
}
