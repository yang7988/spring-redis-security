package com.boomhope.redis.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;


public class Resource implements Serializable{
	private static final long serialVersionUID = 1L;
	private Long id;
	private String method;
	private String name;
	private String remark;
	private String url;
	private Long pid;
	private Resource parent;
	private List<Resource> children;
	private Integer sort;
	private Integer type;
	private Integer status;
	private long tag;
	private Date stamp;
	private Date begin;
	private Date end;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
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
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public Long getPid() {
		return pid;
	}
	public void setPid(Long pid) {
		this.pid = pid;
	}
	public Resource getParent() {
		return parent;
	}
	public void setParent(Resource parent) {
		this.parent = parent;
	}
	public List<Resource> getChildren() {
		return children;
	}
	public void setChildren(List<Resource> children) {
		this.children = children;
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
}
