package com.smartcold.manage.cold.test;

public class User {

	 private int id;
	 private int age;
	 private int sex;
	 private String name;
	 
	 
	public User() {
		super();
	}
	public User(int id, int age, int sex, String name) {
		super();
		this.id = id;
		this.age = age;
		this.sex = sex;
		this.name = name;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public int getSex() {
		return sex;
	}
	public void setSex(int sex) {
		this.sex = sex;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	 
}
