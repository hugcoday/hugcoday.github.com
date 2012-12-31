##windows7 配置如下：

创建_netrc文件，内容为

	machine your.server.com
	login your-username
	password your-password

其中 

	your.server.com
如果是 github.com,修改为：

	github.com

创建run.bat，内容为：

	setx HOME %USERPROFILE%
	copy _netrc %USERPROFILE%
	pause

两个文件放到同一目录下，执行run.bat即可。