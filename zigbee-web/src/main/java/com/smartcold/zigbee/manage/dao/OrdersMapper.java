package com.smartcold.zigbee.manage.dao;

import java.util.List;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.entity.OrdersEntity;

public interface OrdersMapper {

	List<OrdersEntity> findAllOrders();

	Page<OrdersEntity> findOrdersByUserId(int userid);

	Page<OrdersEntity> findOrdersByOwnerId(int ownerid); 
	
	Page<OrdersEntity> findOrdersByPersonId(int userid); 
	
	OrdersEntity findOrderByOrderId(int orderid);
	
	List<OrdersEntity> findOrdersByOrderName(String ordername); 
	
	void insertOrder(OrdersEntity ordersEntity);
	
	
}
