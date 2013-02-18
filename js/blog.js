$(function() {
    $('body').ajaxError(function(event, request, settings, err) {
        console.log(event);
    });
    $.ajaxSetup({
        cache: false
    });

    $.scrollUp({
        scrollName: 'scrollUp', // Element ID
        topDistance: '100', // Distance from top before showing element (px)
        topSpeed: 300, // Speed back to top (ms)
        animation: 'fade', // Fade, slide, none
        animationInSpeed: 200, // Animation in speed (ms)
        animationOutSpeed: 200, // Animation out speed (ms)
        scrollText: 'Top', // Text for element
        activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
    });
	//ceshi
 
    var blog = {};
    blog.views = {};
    blog.helper = {};
 

    blog.helper.build_main_model = function(data) {
        var result = {};
        document.title = data.site_name;
        result.site_name = data.site_name;
        result.copyright = data.copyright;
        result.navlist = _.map(data.cates, function(cate) {
            return {
                link: '#cate/' + cate.name,
                text: cate.text
            };
        });
        return result;
    };

    blog.helper.build_sidebar_model = function(data, cate) {
        var result = {};

        var articles = data.articles;
        if(cate) {
            articles = _.filter(articles, function(article) {
                return article.cate == cate;
            });
        }

        result.months = _.groupBy(articles, function(article) {
            return article.file.substring(0, 7);
        });
        
        result.months = _.map(result.months, function(value, key) {
            return {
                month: key,
                articles: _.map(value, function(article) {
                    return {
                        link: article.file,
                        text: article.title
                    }
                })
            };
        });

        return result;
    };

    // 增加分页条
    blog.helper.build_pagebar_model = function(data,cate){
        var result = {};
        var articles = data.articles;
        if(cate) {
            articles = _.filter(articles, function(article) {
                return article.cate == cate;
            });
        }
        var pages = [];
        var pagecounts = Math.ceil(articles.length/10);
        for (var i = 1; i <= pagecounts; i++) {

            pages[i] = {"num":i} ; 
        };
        result.pages = pages;
        
        return result;

    }

    // 获取当前地址
    blog.helper.getHost = function(url) {
            var host = "null";
            if(typeof url == "undefined"
                            || null == url)
                    url = window.location.href;
            var regex = /.*\:\/\/([^\/]*).*/;
            var match = url.match(regex);
            if(typeof match != "undefined"
                            && null != match)
                    host = match[0];
            var urls = url.split("#show/");
            host = urls[0]+'show/';
            return host;
    }
    
    // 转化引擎
    blog.helper.markdown = new Showdown.converter();

    // 增加多说评论
    blog.helper.addDiscuz = function (_div,file,title){
        var host = blog.helper.getHost();
        
        var el = document.createElement('div');//该div不需要设置class="ds-thread"
        el.setAttribute('data-thread-key', file);//必选参数
        el.setAttribute('data-url', file);//必选参数
        el.setAttribute('data-title', title);//必选参数
        
        el.setAttribute('data-author-key', 'hugcoday@gmail.com');//可选参数
        DUOSHUO.EmbedThread(el);
        _div.append(el);
        
         
    }

    // 评论列表

    blog.helper.addDiscuzList = function(_div){

        var _discuz_title = document.createElement('h3'); 
        _discuz_title.innerHTML="最新评论";
        _div.append(_discuz_title);

        var el = document.createElement('ul'); 
        el.setAttribute('data-num-items', "10");
        el.setAttribute('data-excerpt-length',"70"); 
        el.setAttribute('data-show-title', "0"); 

        
        DUOSHUO.RecentComments(el);
        _div.append(el);
 
       
         
    }

    //近期访客
    blog.helper.addDiscuzUsers = function(_div){

        var _discuz_title = document.createElement('h3'); 
        _discuz_title.innerHTML="近期访客";
        _div.append(_discuz_title);

        var el = document.createElement('ul'); 
        el.setAttribute('data-num-items', "10");
        el.setAttribute('data-excerpt-length',"70"); 
        el.setAttribute('data-show-title', "0"); 

        
        DUOSHUO.RecentVisitors(el);
        _div.append(el);
 
       
         
    }

    blog.helper.addpages = function(index,articles,_div){
        var el = document.createElement('ul'); 
        el.setAttribute('data-num-items', "10");
        el.setAttribute('data-excerpt-length',"70"); 
        el.setAttribute('data-show-title', "0"); 

    }

    
  

  

    //代码高亮
    blog.helper.highlight = function () {
        return $('pre code').each(function(i, e) {
            return hljs.highlightBlock(e, '    ');
        });
    }

    blog.views.Pagebar = Backbone.View.extend({
        template:$('#tpl-pagebar').html(),
        initialize:function(options){
            this.model = options.model;
            _.bindAll(this,'render');
        },
        render:function(){
            var html = Mustache.to_html(this.template, this.model);
           
            $(this.el).append(html);
            return this;
        }
    })

    blog.views.Sidebar = Backbone.View.extend({
        template: $('#tpl-sidebar').html(),
        initialize: function(options) {
            this.model = options.model;
            _.bindAll(this, 'render');
        },
        render: function() {
            var html = Mustache.to_html(this.template, this.model);
            $(this.el).append(html);
            return this;
        }
    });



    blog.views.Article = Backbone.View.extend({
        initialize: function(options) {
            var that = this;
            this.article = options.article;

            _.bindAll(this, 'render');
            $.get('post/' + this.article + '.md', function(data) {
                that.model = data;
                that.render();
            });

        },
        render: function() {
            if(!this.model) return this;
            var html = blog.helper.markdown.makeHtml(this.model);

            $(this.el).html(html);
            blog.helper.highlight();
        }
    });


    blog.views.Main = Backbone.View.extend({
        el: $('.main-body'),
        template: $('#tpl-main').html(),
        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'sync');
        },
        sync: function() {
            var that = this;
            $.getJSON('post/index.json', function(data) {
                that.data = data;
                that.render();
            });
        },
        render: function() {
            if(!this.data) {
                this.sync();
                return this;
            }
            // 主页面
            var main_model = blog.helper.build_main_model(this.data);
            var main_html = Mustache.to_html(this.template, main_model);
            $(this.el).empty().append(main_html);

            //侧边栏
            var sidebar_mode = blog.helper.build_sidebar_model(this.data, this.cate);
            var sidebar_view = new blog.views.Sidebar({
                model: sidebar_mode
            });
            this.$(".sidebar-nav").empty().append(sidebar_view.render().el);

            


            if(this.cate) {
                loadingIndex = false;
                this.$('.navbar-inner .nav li a[href="#cate/' + this.cate + '"]').parent().addClass('active');
            }

            if(this.article!="index") {

                var article_view = new blog.views.Article({
                    article: this.article
                });
                
                loadingIndex = false;

                this.$(".article-content").empty().append(article_view.render().el);
                 
                //添加评论
                blog.helper.addDiscuz(this.$(".article-content"),this.article,"");
               
              
                 
            }


            if(this.article == "index") {
                this.$(".article-content").empty();
                curIndex = 0;
                hasShowedNum = 0;
                loadingIndex = true;
                 
                blog.views.make_main_index(this.cate,this.data.articles,this.pagenum);


                //页码工具条
                var pagebar_model = blog.helper.build_pagebar_model(this.data, this.cate);
                
                var pagebar_view = new blog.views.Pagebar({
                    model: pagebar_model
                });
               
                this.$(".pagebar").empty().append(pagebar_view.render().el);

                

            }

             // 添加评论列表
            blog.helper.addDiscuzList(this.$(".sidebar-comment"));
            blog.helper.addDiscuzUsers(this.$(".sidebar-users"));

            
        }
    });

 


    
    //文章计数
    var curIndex = 0;
    var hasShowedNum = 0;
    var loadingIndex = false;
    var curCate ;
    var curArticles;
    var curPageNum = 1;
    var showArticleNum = 10;

    //首页展示
    blog.views.make_main_index = function addIndex(cate,articles,pagenum) {

        this.curCate = cate;
        this.curArticles = articles;

        if(loadingIndex){
            
            if(cate !=null && articles[curIndex].cate !=cate) {
                //总索引
                curIndex++;
                
                //分页计数
                if(hasShowedNum<showArticleNum*(curPageNum-1)){
                    hasShowedNum ++;
                    return;
                }

                //显示文章计数
                if(curIndex < articles.length && hasShowedNum < 10) {
                    hasShowedNum ++;
                    addIndex(cate,articles);
                }

                return;
            }

            $.get("post/" + articles[curIndex].file + ".md", function(artData) {

                var html;
                if(artData.length >= 200) {
                    html = blog.helper.markdown.makeHtml(artData.substring(0, 200));

                } else {
                    html = blog.helper.markdown.makeHtml(artData);
                }
                
                $(".article-content").append(html);

                //添加继续阅读
                $(".article-content").append("<br/>");
                $(".article-content").append("<p><a title=\"\" class=\"btn btn-primary pull-left\" href=\"#show/" + articles[curIndex].file + "\"  onclick=\"\">继续阅读  →</a> </p><br/> <br/>");
                $(".article-content").append("<div class=\"line_dashed\"></div>");
                
                curIndex++;
                if(curIndex < articles.length && curIndex < 10) {
                    addIndex(cate,articles);
                }
                 

            });
        }
    }

    blog.App = Backbone.Router.extend({
        routes: {
            "": "index",
            "cate/:cate": "cate",
            "show/:article": "show",
            "page/:num":"page"
        },
        make_main_view: function(cate, article,pagenum) {
            if(!this.main) {
                this.main = new blog.views.Main();
            }
            this.main.cate = cate;
            this.main.article = article;
            this.main.pagenum = pagenum
            this.main.render();
        },
        index: function() {
            this.make_main_view(null, 'index',1);
            
        },
        cate: function(cate) {
            this.make_main_view(cate, 'index',1);
        },
        show: function(article) {
            this.make_main_view(null, article,1);
        },
        page: function(num){
            this.make_main_view(cate,'index',num);
        }
    });

    app = new blog.App();
    Backbone.history.start();
});