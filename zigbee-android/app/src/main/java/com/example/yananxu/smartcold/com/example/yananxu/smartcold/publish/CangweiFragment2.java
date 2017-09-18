package com.example.yananxu.smartcold.com.example.yananxu.smartcold.publish;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import com.example.yananxu.smartcold.R;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yanan.xu on 16/10/15.
 */
public class CangweiFragment2 extends Fragment{

    //省-下拉列表
    private Spinner province_spinner;
    private List<String> province_data_list;
    private ArrayAdapter<String> province_adapter;
    //市-下拉列表
    private Spinner city_spinner;
    private List<String> city_data_list;
    private ArrayAdapter<String> city_adapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        View view = inflater.inflate(R.layout.fragment_publish_cangwei2, container, false);
        ///////////省-下拉列表
        province_spinner = (Spinner) view.findViewById(R.id.province_spinner);
        //省-数据
        province_data_list = new ArrayList<String>();
        province_data_list.add("山西省");
        province_data_list.add("河北省");
        province_data_list.add("江苏省");
        province_data_list.add("福建省");
        //省-适配器
        province_adapter = new ArrayAdapter<String>(this.getActivity(), android.R.layout.simple_spinner_item, province_data_list);
        province_adapter.setDropDownViewResource(android.R.layout.simple_dropdown_item_1line);
        province_spinner.setAdapter(province_adapter);
        //设置省默认值
        province_spinner.setVisibility(View.VISIBLE);
        //设置监听当前选择项
        province_spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                System.out.println(province_data_list.get(i));
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
                System.out.println("nothing");
            }
        }
        );

        ///////////市-下拉列表
        city_spinner = (Spinner) view.findViewById(R.id.city_spinner);
        //省-数据
        city_data_list = new ArrayList<String>();
        city_data_list.add("晋城市");
        city_data_list.add("大同市");
        city_data_list.add("太原市");
        city_data_list.add("运城市");
        //省-适配器
        city_adapter = new ArrayAdapter<String>(this.getActivity(), android.R.layout.simple_spinner_item, city_data_list);
        city_adapter.setDropDownViewResource(android.R.layout.simple_dropdown_item_1line);
        city_spinner.setAdapter(city_adapter);
        //设置省默认值
        city_spinner.setVisibility(View.VISIBLE);
        //设置监听当前选择项
        city_spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                System.out.println(city_data_list.get(i));
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
                System.out.println("nothing");
            }
        }
        );

        ///////////冷库温度类型-下拉列表
        city_spinner = (Spinner) view.findViewById(R.id.city_spinner);
        //冷库温度类型-数据
        city_data_list = new ArrayList<String>();
        city_data_list.add("冷藏库");
        //冷库温度类型-适配器
        city_adapter = new ArrayAdapter<String>(this.getActivity(), android.R.layout.simple_spinner_item, city_data_list);
        city_adapter.setDropDownViewResource(android.R.layout.simple_dropdown_item_1line);
        city_spinner.setAdapter(city_adapter);
        //设置冷库温度类型默认值
        city_spinner.setVisibility(View.VISIBLE);
        //设置监听当前选择项
        city_spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                System.out.println(city_data_list.get(i));
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
                System.out.println("nothing");
            }
        }
        );

        ///////////经营类型-下拉列表
        city_spinner = (Spinner) view.findViewById(R.id.city_spinner);
        //经营类型-数据
        city_data_list = new ArrayList<String>();
        city_data_list.add("产地型");
        //经营类型-适配器
        city_adapter = new ArrayAdapter<String>(this.getActivity(), android.R.layout.simple_spinner_item, city_data_list);
        city_adapter.setDropDownViewResource(android.R.layout.simple_dropdown_item_1line);
        city_spinner.setAdapter(city_adapter);
        //设置经营类型默认值
        city_spinner.setVisibility(View.VISIBLE);
        //设置监听当前选择项
        city_spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                System.out.println(city_data_list.get(i));
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
                System.out.println("nothing");
            }
        }
        );
        return view;
    }
}
