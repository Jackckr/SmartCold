package com.smartcold.zigbee.manage.dao;

import java.util.List;
import com.smartcold.zigbee.manage.entity.OrdersEntity;

public interface OrdersMapper {

	List<OrdersEntity> findAllOrders();

	List<OrdersEntity> findOrdersByUserId(int userid);

	List<OrdersEntity> findOrdersByOwnerId(int ownerid); 
	
	OrdersEntity findOrderByOrderId(int orderid);
	
	List<OrdersEntity> findOrdersByOrderName(String ordername); 
	
	void insertOrder(OrdersEntity ordersEntity);
	
	
}
