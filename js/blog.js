$(function() {
    $('body').ajaxError(function(event, request, settings, err) {
        console.log(event);
    });
    $.ajaxSetup({
        cache: false
    });


    var blog = {};
    blog.views = {};
    blog.helper = {};
 

    blog.helper.build_main_model = function(data) {
        var result = {};
        result.site_name = data.site_name;
        result.copyright = data.copyright;
        result.navlist = _.map(data.cates, function(cate) {
            return {
                link: '#!cate/' + cate.name,
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

    // 转化引擎
    blog.helper.markdown = new Showdown.converter();

    // 增加多说评论
    blog.helper.addDiscuz = function (_div,file,title){
       
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

  

    //代码高亮
   blog.helper.highlight = function () {
        return $('pre code').each(function(i, e) {
            return hljs.highlightBlock(e, '    ');
        });
    }

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

            var main_model = blog.helper.build_main_model(this.data);
            var main_html = Mustache.to_html(this.template, main_model);
            $(this.el).empty().append(main_html);

            var sidebar_mode = blog.helper.build_sidebar_model(this.data, this.cate);
            var sidebar_view = new blog.views.Sidebar({
                model: sidebar_mode
            });
            this.$(".sidebar-nav").empty().append(sidebar_view.render().el);

            if(this.cate) {
                loadingIndex = false;
                this.$('.navbar-inner .nav li a[href="#!cate/' + this.cate + '"]').parent().addClass('active');
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

                addIndex(this.cate,this.data.articles);



            }

             // 添加评论列表
            blog.helper.addDiscuzList(this.$(".sidebar-comment"));
            blog.helper.addDiscuzUsers(this.$(".sidebar-users"));

            
        }
    });

 


    
    //文章计数
    var curIndex = 0;
    var hasShowedNum = 0;
    var loadingIndex = 0;
    //首页展示
    function addIndex(cate,articles) {

        if(loadingIndex){
            
            if(cate !=null && articles[curIndex].cate !=cate) {
                curIndex++;
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
                $(".article-content").append("<p><a title=\"\" class=\"btn btn-primary pull-left\" href=\"#!show/" + articles[curIndex].file + "\"  onclick=\"\">继续阅读  →</a> </p><br/> <br/>");
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
            "!cate/:cate": "cate",
            "!show/:article": "show"
        },
        make_main_view: function(cate, article) {
            if(!this.main) {
                this.main = new blog.views.Main();
            }
            this.main.cate = cate;
            this.main.article = article;
            this.main.render();
        },
        index: function() {
            this.make_main_view(null, 'index');
            
        },
        cate: function(cate) {
            this.make_main_view(cate, 'index');
        },
        show: function(article) {
            this.make_main_view(null, article);
        }
    });

    app = new blog.App();
    Backbone.history.start();
});