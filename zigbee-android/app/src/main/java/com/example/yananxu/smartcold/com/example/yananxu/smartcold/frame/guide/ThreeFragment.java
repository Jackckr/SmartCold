package com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame.guide;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.example.yananxu.smartcold.R;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame.MainActivity;
import com.example.yananxu.smartcold.com.example.yananxu.smartcold.frame.MenuMainActivity;

/**
 * Created by yanan.xu on 16/10/15.
 */
public class ThreeFragment extends Fragment{

    private Button enterbtn;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        View view = inflater.inflate(R.layout.fragment3, container, false);

        enterbtn = (Button) view.findViewById(R.id.enter_btn);
        enterbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //h5的时候使用
                Intent mainIntent = new Intent(getActivity(), MainActivity.class);
                //原生的时候使用
                //Intent mainIntent = new Intent(getActivity(), MenuMainActivity.class);
                getActivity().startActivity(mainIntent);
                getActivity().finish();

            }
        });
        return view;
    }

}
