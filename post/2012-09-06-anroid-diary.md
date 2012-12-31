##android-phonegap开发日记


##启动慢，黑屏处理方式
	super.setIntegerProperty("splashscreen", R.drawable.splash);
	super.loadUrl("file:///android_asset/www/index.html", 5000);

然后在res目录下的几个drawable目录下放splash.png图片即可
