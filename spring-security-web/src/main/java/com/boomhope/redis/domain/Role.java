package com.boomhope.redis.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;


public class Role implements Serializable{
	private static final long serialVersionUID = 1L;
	private String id;
	private String name;
	private String remark;
	private Integer sort;
	private Integer type;
	private Integer status;
	private long tag;
	private Date stamp;
	private Date begin;
	private Date end;
	private List<Resource> resources;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Integer getSort() {
		return sort;
	}
	public void setSort(Integer sort) {
		this.sort = sort;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public long getTag() {
		return tag;
	}
	public void setTag(long tag) {
		this.tag = tag;
	}
	public Date getStamp() {
		return stamp;
	}
	public void setStamp(Date stamp) {
		this.stamp = stamp;
	}
	public Date getBegin() {
		return begin;
	}
	public void setBegin(Date begin) {
		this.begin = begin;
	}
	public Date getEnd() {
		return end;
	}
	public void setEnd(Date end) {
		this.end = end;
	}
	public List<Resource> getResources() {
		return resources;
	}
	public void setResources(List<Resource> resources) {
		this.resources = resources;
	}
	
}
