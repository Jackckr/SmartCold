package com.example.yananxu.smartcold.com.example.yananxu.smartcold.publish;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.example.yananxu.smartcold.R;

/**
 * Created by yanan.xu on 16/10/15.
 */
public class LengyunFragment2 extends Fragment{

    private Button passbtn;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        View view = inflater.inflate(R.layout.fragment_publish_lengyun2, container, false);
        return view;
    }
}
