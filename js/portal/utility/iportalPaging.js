/*
 * iportal 分页组件,依赖于jquery
 * 调用方式：
 * $("#ID").empty().paging({
 *      iDisplayTotal: totalRecordNumber,
 *      iDisplayLength:pageSize,
 *      paged: function(pageIndex) {
 *
 *      }
 *  });
 */
 define([
    "jquery"
], function($) {
    var Paging = function(elem, options) {
        this.$elem = $(elem);
        this.options = $.extend({}, $.fn.paging.defaults, options);
    };

    Paging.prototype = {
        constructor: Paging,
        init: function() { //分页初始化
            var
                me = this,
                ops = me.options,
                iTotal = Math.ceil(ops.iDisplayTotal / ops.iDisplayLength);

            if(iTotal <= 0) return;

            me.create();
            me.active();
        },
        create: function() { //创建分页按钮
            var
                i,
                me = this,
                ops = me.options,
                arrIndex = [],
                iPageIndex = ops.iPageIndex,
                iTotal = Math.ceil(ops.iDisplayTotal / ops.iDisplayLength),
                fnClickHandler = function(e) {
                    me.update(this, e.data.action);
                };

            me.$elem.find("ul>li").unbind("click", fnClickHandler);
            me.$elem.empty();
            me.$elem.append($("<ul class='pagination'>" +
                        "<li><a href='javascript:void(0)'><i class='glyphicon glyphicon-chevron-left'></i></a></li>" +
                        "<li><a href='javascript:void(0)'><i class='glyphicon glyphicon-chevron-right'></i></a></li>" +
                        "</ul>"));
            me.$elem.find("ul>li:nth(0)").bind("click", {action: "prev"}, fnClickHandler);
            me.$elem.find("ul>li:nth(1)").bind("click", {action: "next"}, fnClickHandler);

            if(iTotal <= 13) {
                while(iTotal > 0) {
                    me.$elem.find("ul>li:nth(0)").after("<li><a href='javascript:void(0)'>" + iTotal + "</a></li>");
                    me.$elem.find("ul>li:nth(1)").bind("click", {action: "current"}, fnClickHandler);
                    iTotal--;
                }
            } else {
                if(iPageIndex <= 6) {
                    for(i=1; i<10; i++) {
                        arrIndex.push(i);
                    }
                    arrIndex.push("...", iTotal-1, iTotal);
                } else if (iPageIndex === 7) {
                    for(i=1; i<11; i++) {
                        arrIndex.push(i);
                    }
                    arrIndex.push("...", iTotal-1, iTotal);
                } else if(iTotal - iPageIndex >= 0 && iTotal - iPageIndex <=5) {
                    arrIndex.push(1, 2, "...");
                    for(i=iTotal-8; i<iTotal+1; i++) {
                        arrIndex.push(i);
                    }
                } else if(iTotal - iPageIndex === 6) {
                    arrIndex.push(1, 2, "...");
                    for(i=iTotal-9; i<iTotal+1; i++) {
                        arrIndex.push(i);
                    }
                } else {
                    arrIndex.push(1, 2, "...");
                    for(i=iPageIndex-3; i<iPageIndex+4; i++) {
                        arrIndex.push(i);
                    }
                    arrIndex.push("...", iTotal-1, iTotal);
                }

                for(i=arrIndex.length-1; i>-1; i--) {
                    if(arrIndex[i] !== "...") {
                        me.$elem.find("ul>li:nth(0)").after("<li><a href='javascript:void(0)'>" + arrIndex[i] + "</a></li>");
                        me.$elem.find("ul>li:nth(1)").bind("click", {action: "current"}, fnClickHandler);
                    } else {
                        me.$elem.find("ul>li:nth(0)").after("<li><span href='javascript:void(0)'>" + arrIndex[i] + "</span></li>");
                    }
                }
            }
        },
        update: function(node, action) { //翻页
            var me = this,
                currNode = $(node),
                ops = me.options,
                iTotal = Math.ceil(ops.iDisplayTotal / ops.iDisplayLength),
                iIndex = ops.iPageIndex;

            if(action === "prev") {
                if(iIndex === 1) return;

                iIndex--;
                ops.iPageIndex = iIndex;
            } else if(action === "next") {
                if(iIndex === iTotal) return;

                iIndex++;
                ops.iPageIndex = iIndex;

            } else if(action === "current") {
                if(currNode.hasClass("active")) return;

                iIndex = parseInt(currNode.find("a").html(), 10);
                ops.iPageIndex = iIndex;
            }
            me.active();
            ops.paged&&ops.paged(ops.iPageIndex);
        },
        active: function() { //激活当前选中项
            var
                me = this,
                ops = me.options,
                iPageIndex = ops.iPageIndex,
                iTotal = Math.ceil(ops.iDisplayTotal / ops.iDisplayLength);

            me.create();
            if(iTotal <= 13) {
                me.$elem.find("ul>li:nth(" + iPageIndex+ ")").addClass("active");
            } else {
                if(iPageIndex <= 7) {
                    me.$elem.find("ul>li:nth(" + iPageIndex+ ")").addClass("active");
                } else if(iTotal - iPageIndex >= 0 && iTotal - iPageIndex <= 5) {
                    me.$elem.find("ul>li:nth(" + (12 - iTotal + iPageIndex) + ")").addClass("active");
                } else {
                    me.$elem.find("ul>li:nth(7)").addClass("active");
                }
            }
        }
    };

    $.fn.paging = function(option) {
        return this.each(function() {
            var options = $.extend({}, $.fn.paging.defaults, typeof option === "object" && option),
                data = new Paging(this, options);

            data.init();
        });
    };
    $.fn.paging.defaults = {
        iPageIndex: 1,
        iDisplayLength: 10,
        iDisplayTotal: 0,
        paged: null
    };
    //$.fn.paging.Constructor = Paging;
});