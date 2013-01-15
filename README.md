# [多多de棉花糖](http://hugcoday.github.com)


本博客是基于[小天天博客](https://github.com/onlytiancai/xiaotiantian)  
并在此基础上修改完善。

###本博客特色：

* 纯js博客
* json列表
* 代码高亮展示,默认使用[highlight.js](http://softwaremaniacs.org/soft/highlight/en/)，修改样式直接替换css/default.css样式即可
* 首页显示最新10篇文章简介
* 首页增加最新评论
* 用[多说](http://duoshuo.com)评论


###计划改善

* 首页增加翻页
* 个人信息展示
* 优化分类
* 友情链接
* 广告位
* 多样式切换

###使用方式

* 在post文件夹下新建文件，文件名为：日期+标题，文件以.md结尾，例如：2012-12-12-hello-world.md

* 修改post/index.json文件，其中
	
	site_name为站点名称；
	copyright 为版权标示；
	cates为文章分类；
	articles为文章列表。

例如
	
增加2012-12-12-hello-world.md,articles中增加一条记录
 
	
	{"title": "Hello World", "file": "2012-12-12-hello-world", "cate":"tech"},


评论修改：
	修改index.html中的

	var duoshuoQuery = {short_name:"hugcoday"};

替换hugcoday 为你在多说上注册的二级域名，具体参考多说帮助文档
	
