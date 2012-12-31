##关于octopress中文乱码

修改文件

	convertible.rb

文件路径：

	E:\engine\Ruby193\lib\ruby\gems\1.9.1\gems\jekyll-0.11.2\lib\jekyll

27行

	def read_yaml(base, name)
      self.content = File.read(File.join(base, name))
	  
增加 
	
	:encoding => "utf-8"
	
具体如下：

	def read_yaml(base, name)
      self.content = File.read(File.join(base, name), :encoding => "utf-8")

另外，写文章的时候，编码格式一定是__UTF-8无BOM__格式编码，其他编码会异常。