package com.smartcold.manage.cold.util.socket.entity;

import javolution.io.Struct;

public  class UserInfo_t extends Struct {
    public final Unsigned32 id = new Unsigned32();
    public final Unsigned32 age = new Unsigned32();
    public final Unsigned32 weight = new Unsigned32();
    public final Signed64 coin = new Signed64();
    public final Unsigned32 reserve = new Unsigned32();
   }
