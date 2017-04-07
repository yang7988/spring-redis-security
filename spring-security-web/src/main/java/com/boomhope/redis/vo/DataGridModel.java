package com.boomhope.redis.vo;

import java.util.List;

public class DataGridModel {
	public static DataGridModel empty = new DataGridModel();
	int total;
	List<?> rows;

	public int getTotal()
	{
		return total;
	}

	public void setTotal(int total)
	{
		this.total = total;
	}

	public List<?> getRows()
	{
		return rows;
	}

	public void setRows(List<?> rows)
	{
		this.rows = rows;
	}
}
