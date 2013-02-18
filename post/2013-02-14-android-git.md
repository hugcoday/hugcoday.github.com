#Android上使用git

以后可以手机上写独立博客了，赞一个！
为了在手机上同步github上的博客内容，努力的寻找android上的git客户端，
首先发现：
	
	Agit 
	只能看，不提交，没法用

通过国外的论坛，发现
	
	Terminal IDE 
	支持git的pull、push、commit

可能是版本问题一直配置不对，今天终于pull、push了，记录一下：

1.Create your key (assumes ~/.ssh exists, it did for me):

	terminal++@127.0.0.1:~$ dropbearkey -t rsa -f ~/.ssh/id_rsa

2.Convert the key to openssh format, outputting to the file my_key in the same directory:

    terminal++@127.0.0.1:~$ dropbearkey -y -f ~/.ssh/id_rsa | grep "^ssh-rsa" >> my_key

3.将my_key里面的内容，填写到github上的ssh key里面

4.以上三步，是没有问题的，第四步，创建sssh时候出现问题，原文：

	#!/bin/sh
	#location is ~/sssh
	ssh -i ~/.ssh/id_rsa $*

我用的android设备是小米2，terminal版是1.95，文件地址发生了变化，如下

	#!/system/bin/sh
	#location is ~/sssh
	ssh -i ~/.ssh/id_rsa $*

5.然后编辑~/.bashrc文件，增加	

	export GIT_SSH=~/sssh

6.新建文件夹，然后执行git命令，pull代码
	
	git init
	git remote add origin git@github.com:github用户名/仓库地址.git
	git pull origin master

7.修改代码后，提交
	
	git commit -a
	git push origin master

另，因为terminal 下的git命令不全，没有git-merge命令，如果出现冲突，pull命令就异常

有文章使用下方法，经验证是正确滴：
	
	可能git某些操作的时候会有错误，因为有软链接缺失，看什么错误，到“system/bin/”下执行类似
	ln -s git git-merge
	的命令就可以


