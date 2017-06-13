package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

/**
 * Created by qiangzi on 2017/5/18.
 */
/*消息表实体类*/
public class MessageRecord {
    private Integer id;
    private Integer uid;//用户id
    private int   tid         ;
    private Integer rdcId;//冷库id
    private Integer type;//消息类型
    private Integer sType;//子集ID
    private String title;//消息标题
    private String message;//消息内容
    private int   state       ;
    private int  isread;
    private int   level       ;
    private String addTime;//消息添加时间
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getRdcId() {
        return rdcId;
    }

    public void setRdcId(Integer rdcId) {
        this.rdcId = rdcId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getsType() {
        return sType;
    }

    public void setsType(Integer sType) {
        this.sType = sType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

   
	public String getAddTime() {
		return addTime;
	}

	public void setAddTime(String addTime) {
		this.addTime = addTime;
	}

	public int getTid() {
		return tid;
	}

	public int getIsread() {
		return isread;
	}

	public void setIsread(int isread) {
		this.isread = isread;
	}

	public void setTid(int tid) {
		this.tid = tid;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}
    
}
