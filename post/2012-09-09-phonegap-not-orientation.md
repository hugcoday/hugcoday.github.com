##phonegap小技巧

###phonegap禁止屏幕旋转
在AndroidManifest.xml中增加android:screenOrientation="landscape",如：

	<activity android:name="faceturn" android:label="@string/app_name" 
		android:configChanges="orientation|keyboardHidden"
		android:screenOrientation="landscape">

landscape是横向，portrait是纵向

###phonegap全屏展示
