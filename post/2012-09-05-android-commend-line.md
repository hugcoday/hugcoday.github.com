##命令行环境使用phonegap

###环境（必须）：
	ant-1.82
	android-tools
	jdk-1.6
	phonegap 2.0

###windows环境配置如下：
将android工具包下tool、planform-tool配置到系统环境变量path中

将jdk配置到系统环境变量中

	D:\Android\android-sdk-windows\platform-tools
	D:\Android\android-sdk-windows\tools

将ant配置到系统环境变量中

	D:\Java\apache-ant-1.8.2\bin

将phonegap配置到环境变量中

	D:\Engine\phonegap2\lib\android\bin

创建项目

	create e:\android\app com.syscde.app facechange 
编译项目

	执行e:\android\app\ant debug
	
模拟运行

	执行e:\android\app\caordova\emulate.bat

不知道怎么回事，总是模拟不起来，只好用手机直接跑
使用命令：

	ant clean debug install
这个不用签名
签名方式如下：

	ant clean release 
创建签名

	keytool -genkey -v -keystore facechange.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
给apk 签名

	jarsigner -keystore facechange.keystore -digestalg SHA1 -sigalg MD5withRSA bin/facechange-release-unsigned.apk release