##Flex 鼠标手势


Flex鼠标手势、自定义光标

一、直接用默认的API
	CursorManager.setBusyCursor();//鼠标变成小钟
	CursorManager.removeBusyCursor();//由小钟恢复成箭头
如果是继承自Sprite的组件，可以使用useHandCursor属性控制鼠标是手型还是箭头(一般像按钮那样直接设置这个属性就可以了)；
 
二、使用 JPEG、GIF、PNG 或 SVG 图像、Sprite 对象或者 SWF 文件来作为光标图像。

 
	[Embed(source="ClickHand.gif")]
	public var clickHand:Class;//图标
	var cursorID:Number = CursorManager.setCursor(clickHand);//更改鼠标图标
	CursorManager.removeCursor(cursorID);//还原鼠标图标
 

三、用自定义类显示光标，下面的例子讲光标设为一个圆(具体参考)
例如：

	package com{
	import flash.display.Sprite;
	publicclass Ellipseextends Sprite
	{publicfunction Ellipse()
	{
	this.graphics.lineStyle( 1 , 0x000000 , 1 );
	this.graphics.drawEllipse( 0 , 0 , 50 , 10 );
	super();
	}
	}
	}

//在需要改变的地方加上：

	CursorManager.setCursor(Ellipse);

简单的鼠标手型 增加属性 
 
	buttonMode="true" useHandCursor="true"
 
总结：改变鼠标手势的方式有很多种，可以根据实际需求来选择，有些时候可能需要交互，比如需要根据用户输入的参数来显示光标的大小和颜色，这个自己发挥吧。