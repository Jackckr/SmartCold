package com.smartcold.zigbee.manage.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.zigbee.manage.dao.WebvisitMapper;

@Service
public class WebvistsService  {
	private static int release = 0; // -6
	private static int share = 0; // -3
	private static int coldlist = 0; // 1
	private static int map = 0; // 2
	private static int position = 0; // 3
	private static int good = 0; // 4
	private static int car = 0; // 5
	private static int rrdc = 0; // 6
	private static int rposition = 0; // 7
	private static int rgood = 0; // 8
	private static int rcar = 0; // 9
	private static int traces = 0; // 10
	private static int sc360 = 0; // 11
	private static int news = 0; // 12
	private static int msg =0; // 13
  
	@Autowired
	private WebvisitMapper webvisit;
	
	public static void addCount(int index) {
		switch (index) {
		case -6: release++; break;
		case -3: share++; break;
		case 1: coldlist++; break;
		case 2: map++; break;
		case 3: position++; break;
		case 4: good++; break;
		case 5: car++; break;
		case 6: rrdc++; break;
		case 7: rposition++; break;
		case 8: rgood++; break;
		case 9: rcar++; break;
		case 10: traces++; break;
		case 11: sc360++; break;
		case 12: news++; break;
		case 13: msg++; break;
		default: break;
		}
	}
	public static List<Object[]> getCount(){
		List<Object[]> datalist = new ArrayList<Object[]>();
		datalist.add(new Object[] {"冷库 " ,          coldlist        });
		datalist.add(new Object[] {"地图" ,          map             });
		datalist.add(new Object[] {"共享-3" ,          share        });
		datalist.add(new Object[] {"仓位 " ,          position        });
		datalist.add(new Object[] {"货品" ,          good            });
		datalist.add(new Object[] {"货运" ,          car             });
		datalist.add(new Object[] {"发布-6" ,          release        });
		datalist.add(new Object[] {"发布冷库",          rrdc            });
		datalist.add(new Object[] {"发布仓位",          rposition       });
		datalist.add(new Object[] {"发布货品",          rgood           });
		datalist.add(new Object[] {"发布冷运",          rcar            });
		datalist.add(new Object[] {"追溯"  ,          traces          });
		datalist.add(new Object[] {"360"  ,          sc360  });
		datalist.add(new Object[] {"资讯"  ,          news            });
		datalist.add(new Object[] {"消息"  ,          msg             });
	return datalist;  
	} 
	/**
	 * 半小时自动保存一次
	 * 	@Scheduled(cron = "0 0/30 * * * ?")
	 */
//	@Scheduled(cron = "0/10 * * * * ?")
	private void saveCount() {
		if (share != 0) { this.webvisit.updateWebvisits( -3, share);share = 0;}
		if (release != 0) { this.webvisit.updateWebvisits( -6, release);release = 0;}
		if (coldlist != 0) { this.webvisit.updateWebvisits( 1, coldlist);coldlist = 0;}
		if (map      != 0) { this.webvisit.updateWebvisits( 2, map );map = 0;}
		if (position != 0) { this.webvisit.updateWebvisits( 3, position ); position = 0; }
		if (good     != 0) { this.webvisit.updateWebvisits( 4, good ); good = 0; }
		if (car      != 0) { this.webvisit.updateWebvisits( 5, car ); car = 0; }
		if (rrdc     != 0) { this.webvisit.updateWebvisits( 6, rrdc); rrdc = 0; }
		if (rposition!= 0) { this.webvisit.updateWebvisits( 7, rposition  ); rposition = 0; }
		if (rgood    != 0) { this.webvisit.updateWebvisits( 8, rgood ); rgood = 0; }
		if (rcar     != 0) { this.webvisit.updateWebvisits( 9, rcar ); rcar = 0; }
		if (traces   != 0) { this.webvisit.updateWebvisits( 10, traces ); traces = 0; }
		if (sc360    != 0) { this.webvisit.updateWebvisits( 11, sc360 ); sc360 = 0; }
		if (news     != 0) { this.webvisit.updateWebvisits( 12, news ); news = 0; }
		if (msg      != 0) { this.webvisit.updateWebvisits( 13, msg); msg = 0; }
	}
	
	

}
