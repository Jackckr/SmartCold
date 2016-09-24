package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.smartcold.bgzigbee.manage.dao.RdcMapper;
import com.smartcold.bgzigbee.manage.dao.RoleUserMapper;
import com.smartcold.bgzigbee.manage.dao.UserMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.NgRemoteValidateDTO;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.RdcEntity;
import com.smartcold.bgzigbee.manage.entity.RoleUser;
import com.smartcold.bgzigbee.manage.entity.UserEntity;
import com.smartcold.bgzigbee.manage.sc360.dao.CompanyMapper;
import com.smartcold.bgzigbee.manage.sc360.dao.CompanyRdcMapper;
import com.smartcold.bgzigbee.manage.sc360.dao.CompanyUserMapper;
import com.smartcold.bgzigbee.manage.sc360.entity.Company;
import com.smartcold.bgzigbee.manage.sc360.entity.CompanyRdc;
import com.smartcold.bgzigbee.manage.sc360.entity.CompanyUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping(value = "/company")
public class CompanyController extends BaseController {

    @Autowired
    private CompanyMapper companyDao;

    @Autowired
    private CompanyRdcMapper companyRdcDao;

    @Autowired
    private CompanyUserMapper companyUserDao;

    @Autowired
    private RoleUserMapper roleUserDao;

    @Autowired
    private RdcMapper rdcDao;

    @Autowired
    private UserMapper userDao;

    @RequestMapping(value = "/findCompanyList", method = RequestMethod.POST)
    @ResponseBody
    public Object findCompanyList(@RequestParam(value = "pageNum", required = false) Integer pageNum,
                                  @RequestParam(value = "pageSize") Integer pageSize,
                                  @RequestParam(value = "keyword", required = false) String keyword) {
        pageNum = pageNum == null ? 1 : pageNum;
        pageSize = pageSize == null ? 12 : pageSize;
        PageHelper.startPage(pageNum, pageSize);
        return new PageInfo<Company>(companyDao.findAllCompany(keyword));
    }

    @RequestMapping(value = "/findCompanyById", method = RequestMethod.POST)
    @ResponseBody
    public Object findCompanyById(@RequestParam(value = "companyId", required = false) Integer companyId) {
        Company company = companyDao.selectByPrimaryKey(companyId);
        return company;
    }

    @RequestMapping(value = "/deleteCompany", method = RequestMethod.GET)
    @ResponseBody
    public Object deleteAdmin(int companyID) {
        companyDao.deleteCompany(companyID);
        return new BaseDto(0);
    }

    @RequestMapping(value = "/deleteByCompanyIDs", method = RequestMethod.DELETE)
    @ResponseBody
    public Object deleteByCompanyIDs(Integer[] companyIDs) {
        for (Integer companyID : companyIDs) {
            companyDao.deleteCompany(companyID);
        }
        return new BaseDto(0);
    }

    @RequestMapping(value = "/addCompany", method = RequestMethod.GET)
    @ResponseBody
    public Object addCompany(Company company) throws UnsupportedEncodingException {
        if (company.getName() == null) {
            return new ResultDto(-1, "集团名称不能为空");
        }
        company.setName(URLDecoder.decode(company.getName(), "UTF-8"));
        company.setAddress(URLDecoder.decode(company.getAddress(), "UTF-8"));
        company.setAddtime(new Date());
        companyDao.insertSelective(company);
        return new BaseDto(0);
    }

    @ResponseBody
    @RequestMapping(value = "/checkCompanyName", method = RequestMethod.GET)
    public Object checkCompanyName(@RequestParam("value") String companyname) {
        companyname = StringUtils.trimAllWhitespace(companyname);
        NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
        ngRemoteValidateDTO.setValid(companyDao.findCompanyByName(companyname) == null ? true : false);
        return ngRemoteValidateDTO;
    }

    @RequestMapping(value = "/addCompanyRdc", method = RequestMethod.POST)
    @ResponseBody
    public Object addCompanyRdc(@RequestParam(value = "rdcId", required = false) Integer rdcId, @RequestParam(value = "companyId", required = false) Integer companyId) {
        List<CompanyRdc> companyRdcs = companyRdcDao.selectByCompId(companyId);
        if (!CollectionUtils.isEmpty(companyRdcs)) {
            List<Integer> rdcIds = Lists.transform(companyRdcs, new Function<CompanyRdc, Integer>() {
                @Override
                public Integer apply(CompanyRdc companyRdc) {
                    return companyRdc.getRdcid();
                }
            });
            if (rdcIds.contains(rdcId)) {
                return new BaseDto(0);
            }
        }
        CompanyRdc companyRdc = new CompanyRdc();
        companyRdc.setCompanyid(companyId);
        companyRdc.setRdcid(rdcId);
        companyRdc.setAddtime(new Date());
        companyRdcDao.insertSelective(companyRdc);
        return new BaseDto(0);
    }

    @RequestMapping(value = "/delCompanyRdc", method = RequestMethod.POST)
    @ResponseBody
    public Object delCompanyRdc(@RequestParam(value = "rdcId", required = false) Integer rdcId, @RequestParam(value = "companyId", required = false) Integer companyId) {
        List<CompanyRdc> companyRdcs = companyRdcDao.selectByCompId(companyId);
        if (!CollectionUtils.isEmpty(companyRdcs)) {
            for (CompanyRdc companyRdc : companyRdcs) {
                if (companyRdc.getRdcid().equals(rdcId)) {
                    companyRdcDao.deleteByPrimaryKey(companyRdc.getId());
                }
            }
        }
        return new BaseDto(0);
    }

    @RequestMapping(value = "/findRelatedRdcs", method = RequestMethod.POST)
    @ResponseBody
    public Object findRelatedRdcs(@RequestParam(value = "companyId", required = false) Integer companyId) {
        List<RdcEntity> result = Lists.newArrayList();
        List<CompanyRdc> companyRdcs = companyRdcDao.selectByCompId(companyId);
        if (!CollectionUtils.isEmpty(companyRdcs)) {
            List<Integer> rdcIds = Lists.transform(companyRdcs, new Function<CompanyRdc, Integer>() {
                @Override
                public Integer apply(CompanyRdc companyRdc) {
                    return companyRdc.getRdcid();
                }
            });
            for (Integer rdcId : rdcIds) {
                List<RdcEntity> rdcByRDCId = rdcDao.findRDCByRDCId(rdcId);
                if (!CollectionUtils.isEmpty(rdcByRDCId)) {
                    result.add(rdcByRDCId.get(0));
                }
            }
        }
        return result;
    }

    @RequestMapping(value = "/addCompanyUser", method = RequestMethod.POST)
    @ResponseBody
    public Object addCompanyUser(@RequestParam(value = "userId", required = false) Integer userId, @RequestParam(value = "companyId", required = false) Integer companyId) {
        List<CompanyUser> companyUsers = companyUserDao.selectByCompanyId(companyId);
        if (!CollectionUtils.isEmpty(companyUsers)) {
            List<Integer> userIds = Lists.transform(companyUsers, new Function<CompanyUser, Integer>() {
                @Override
                public Integer apply(CompanyUser companyUser) {
                    return companyUser.getUserid();
                }
            });
            if (userIds.contains(userId)) {
                return new BaseDto(0);
            }
        }
        // 升级账号 并绑定
        RoleUser roleUserByUserId = roleUserDao.getRoleUserByUserId(userId);
        if (roleUserByUserId != null) {
            if (roleUserByUserId.getRoleid() != 2) {
                roleUserByUserId.setRoleid(2);
                roleUserDao.updateByPrimaryKeySelective(roleUserByUserId);
            }
        } else {
            RoleUser roleUser = new RoleUser();
            roleUser.setUserid(userId);
            roleUser.setRoleid(2); // 集团账号
            roleUser.setAddtime(new Date());
            roleUserDao.insertSelective(roleUser);
        }

        CompanyUser companyuser = new CompanyUser();
        companyuser.setCompanyid(companyId);
        companyuser.setUserid(userId);
        companyuser.setAddtime(new Date());
        companyUserDao.insertSelective(companyuser);
        return new BaseDto(0);
    }

    @RequestMapping(value = "/delCompanyUser", method = RequestMethod.POST)
    @ResponseBody
    public Object delCompanyUser(@RequestParam(value = "userId", required = false) Integer userId, @RequestParam(value = "companyId", required = false) Integer companyId) {
        List<CompanyUser> companyUsers = companyUserDao.selectByCompanyId(companyId);
        if (!CollectionUtils.isEmpty(companyUsers)) {
            for (CompanyUser companyUser : companyUsers) {
                if (companyUser.getUserid().equals(userId)) {
                    companyUserDao.deleteByPrimaryKey(companyUser.getId());
                }
            }
        }
        return new BaseDto(0);
    }

    @RequestMapping(value = "/findRelatedUsers", method = RequestMethod.POST)
    @ResponseBody
    public Object findRelatedUsers(@RequestParam(value = "companyId", required = false) Integer companyId) {
        List<UserEntity> result = Lists.newArrayList();
        List<CompanyUser> companyUsers = companyUserDao.selectByCompanyId(companyId);
        if (!CollectionUtils.isEmpty(companyUsers)) {
            List<Integer> userIds = Lists.transform(companyUsers, new Function<CompanyUser, Integer>() {
                @Override
                public Integer apply(CompanyUser companyUser) {
                    return companyUser.getUserid();
                }
            });
            for (Integer userId : userIds) {
                UserEntity userById = userDao.findUserById(userId);
                if (userById != null) {
                    result.add(userById);
                }
            }
        }
        return result;
    }
}
