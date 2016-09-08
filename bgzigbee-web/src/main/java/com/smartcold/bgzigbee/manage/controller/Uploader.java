package com.smartcold.bgzigbee.manage.controller;



import com.baidu.ueditor.define.State;
import com.baidu.ueditor.upload.Base64Uploader;
import com.baidu.ueditor.upload.BinaryUploader;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public class Uploader {
    
      private HttpServletRequest request = null;
      private Map<String, Object> conf = null;

      public Uploader(HttpServletRequest request, Map<String, Object> conf) {
        this.request = request;
        this.conf = conf;
      }

      public final State doExec() {
        String filedName = (String)this.conf.get("fieldName");
        State state = null;

        //保留原有逻辑,在json.config中加入是否使用FTP上传配置项
        if ("true".equals(this.conf.get("isBase64")))
          state = Base64Uploader.save(this.request.getParameter(filedName), 
            this.conf);
        else {
          if("true".equals(this.conf.get("useFtpUpload")))
              state = FtpUploader.save(request, conf);
          else
            state = BinaryUploader.save(this.request, this.conf);
        }

        return state;
      }
}
