package com.smartcold.zigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.entity.OrdersEntity;

public interface OrdersMapper {

	List<OrdersEntity> findAllOrders();

	Page<OrdersEntity> findOrdersByUserId(int userid);

	Page<OrdersEntity> findOrdersByOwnerId(int ownerid); 
	
	Page<OrdersEntity> findOrdersByPersonId(@Param("userid") int userid, @Param("keyword") String keyword); 
	
	OrdersEntity findOrderByOrderId(@Param("orderid")int orderid,@Param("userid")int userid);
	
	OrdersEntity findOrderById(@Param("orderid")int orderid);
	
	List<OrdersEntity> findOrdersByOrderName(String ordername); 
	
	void insertOrder(OrdersEntity ordersEntity);
	
	void updateOrderTimes(OrdersEntity ordersEntity);
	
	int deleteByOrderID(@Param("orderID")int orderID,@Param("userid")Integer userid);
	
	int deleteMsgByOrderID(@Param("orderID")int orderID,@Param("userid")Integer userid);
}
