package com.smartcold.manage.cold.enums;

import java.util.Scanner;

/**
 * Created by corly on 16-8-13.
 */
public class EnumsUtil {
    public static void main(String[] args){
        buldEnumSet();
    }

    public static void buldEnumSet(){
        Scanner in = new Scanner(System.in);
        int start = 5;
        while(in.hasNext()) {
            String ori = in.nextLine().trim();
            if (!ori.equals("")) {
                String[] leftStr = ori.split("\\(");
                String name = leftStr[0];
                String[] args = leftStr[1].split(",");
                String res = String.format("%sSET(%s, %sset\", %s,\n", name, args[0], args[1].substring(0, args[1].length()-1), args[2]);
                System.out.println(res);
            }
        }
    }


    public static  void buildEnum( ){
        Scanner in = new Scanner(System.in);
        int start = 5;
        while(in.hasNext()){
            String strset = in.nextLine().trim();
            String str = strset.substring(0,strset.length()-3);
            String result = String.format("%s(%d, \"%s\", \"\"),\n", str.toUpperCase(),start++,str);
            System.out.println(result);
        }
    }
}
