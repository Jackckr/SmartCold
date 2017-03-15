package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;

/**
 * 任务调度中心
 *   1.用于调度用户临时任务
 *   2.禁止干扰主任务状态
 * Copyright (C) DCIS 版权所有 功能描述: TaskService Create on MaQiang
 * 2017年3月5日13:59:59
 **/

public class TaskService {
	 private static int idle = 0;
     private static int minThreads = 1;//最小线程
     private static int maxThreads = 10;//最大线程
	 private static int currThreds = 0;//当前线程数
	 private static int waitThreds = 0;//当前等待线程数
	 private static int pauseThreds = 0;//当前暂停线程数
	 private static int finishThreds = 0;//当前已完成线程数
	 private static ArrayList<Runnable> jobList = new ArrayList<Runnable>(0);//队列中心
    

	
  
	// public methods
	// --------------

	    /**
	     * Submit a task to be executed.
	     * Once a task is submitted, it is guaranteed that either
	     * {@link com.sun.jmx.snmp.tasks.Task#run() task.run()} or
	     * {@link com.sun.jmx.snmp.tasks.Task#cancel() task.cancel()} will be called.
	     * This implementation of TaskServer uses a thread pool to execute
	     * the submitted tasks.
	     * @param task The task to be executed.
	     * @exception IllegalArgumentException if the submitted task is null.
	     **/
//	    public void submitTask(Task task) throws IllegalArgumentException {
//	        submitTask((Runnable)task);
//	    }

	    /**
	     * Submit a task to be executed.
	     * This implementation of TaskServer uses a thread pool to execute
	     * the submitted tasks.
	     * @param task The task to be executed.
	     * @exception IllegalArgumentException if the submitted task is null.
	     **/
	    public void submitTask(Runnable task) throws IllegalArgumentException {
//	        stateCheck();

	        if (task == null) {
	            throw new IllegalArgumentException("No task specified.");
	        }

	        synchronized(jobList) {
	            jobList.add(jobList.size(), task);

	            jobList.notify();
	        }

//	        createThread();
	    }

//	    public Runnable removeTask(Runnable task) {
//	        stateCheck();
//
//	        Runnable removed = null;
//	        synchronized(jobList) {
//	            int lg = jobList.indexOf(task);
//	            if (lg >= 0) {
//	                removed = jobList.remove(lg);
//	            }
//	        }
//	        if (removed != null && removed instanceof Task)
//	            ((Task) removed).cancel();
//	        return removed;
//	    }

	    public void removeAll() {
//	        stateCheck();
//
//	        final Object[] jobs;
//	        synchronized(jobList) {
//	            jobs = jobList.toArray();
//	            jobList.clear();
//	        }
//	        final int len = jobs.length;
//	        for (int i=0; i<len ; i++) {
//	            final Object o = jobs[i];
//	            if (o!= null && o instanceof Task) ((Task)o).cancel();
//	        }
	    }

	    // to terminate
	    public void terminate() {

//	        if (terminated == true) {
//	            return;
//	        }
//
//	        terminated = true;
//
//	        synchronized(jobList) {
//	            jobList.notifyAll();
//	        }
//
//	        removeAll();
//
//	        for (int i=0; i<currThreds; i++) {
//	            try {
//	                threadList[i].interrupt();
//	            } catch (Exception e) {
//	                // TODO
//	            }
//	        }
//
//	        threadList = null;
	    }

	// private classes
	// ---------------

	    // A thread used to execute jobs
	    //
//	    private class ExecutorThread extends Thread {
//	        public ExecutorThread() {
//	            super(threadGroup, "ThreadService-"+counter++);
//	            setDaemon(true);
//
//	            // init
//	            this.setPriority(priority);
//	            this.setContextClassLoader(cloader);
//
//	            idle++;
//	        }
//
//	        public void run() {
//
//	            while(!terminated) {
//	                Runnable job = null;
//
//	                synchronized(jobList) {
//	                    if (jobList.size() > 0) {
//	                        job = jobList.remove(0);
//	                        if (jobList.size() > 0) {
//	                            jobList.notify();
//	                        }
//
//	                    } else {
//	                        try {
//	                            jobList.wait();
//	                        } catch (InterruptedException ie) {
//	                            // terminated ?
//	                        } finally {
//	                        }
//	                        continue;
//	                    }
//	                }
//	                if (job != null) {
//	                    try {
//	                        idle--;
//	                        job.run();
//	                    } catch (Exception e) {
//	                        // TODO
//	                        e.printStackTrace();
//	                    } finally {
//	                        idle++;
//	                    }
//	                }
//
//	                // re-init
//	                this.setPriority(priority);
//	                this.interrupted();
//	                this.setContextClassLoader(cloader);
//	            }
//	        }
//	    }
//
//	// private methods
//	    private void stateCheck() throws IllegalStateException {
//	        if (terminated) {
//	            throw new IllegalStateException("The thread service has been terminated.");
//	        }
//	    }
//
//	    private void createThread() {
//	        if (idle < 1) {
//	            synchronized(threadList) {
//	                if (jobList.size() > 0 && currThreds < minThreads) {
//	                    ExecutorThread et = new ExecutorThread();
//	                    et.start();
//	                    threadList[currThreds++] = et;
//	                }
//	            }
//	        }
//	    }
	
}
