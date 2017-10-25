package com.smartcold.manage.cold.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;



//@Controller  
//@RequestMapping("/yhmq")  
public class MessageController {  
    @Autowired  
    private MqttPahoMessageHandler mqtt;  
      
    @RequestMapping(value="/send")  
    public void sendMessage(){  
        Message<String> message = MessageBuilder.withPayload("==========1111111111111111111111111=========").setHeader(MqttHeaders.TOPIC, "robot_server").build();  
        mqtt.handleMessage(message);  
        System.out.println("成功");  
    }  
} 