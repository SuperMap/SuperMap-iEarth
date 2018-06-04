/**
 * iPortal 模态对话框鼠标拖动对话框组件，依赖于jQuery
 */
define([
    "jquery"
], function($) {
    function DragLibrary(tarElem, dragElem) {
        this.tarElem = tarElem;
        this.dragElem = dragElem;
        this.offsetY = null;
        this.offsetX = null;
        this.startDragHandler = this.bind(this.startDrag, this);
        this.doDragHandler = this.bind(this.doDrag, this);
        this.stopDragHandler = this.bind(this.stopDrag, this);
        var $tarE = $(tarElem);
        var wLeft = $tarE.offset().left;
        var hTop = $tarE.offset().top;
        $tarE.css("left", wLeft).css("top", hTop);
        //事件类型
        if("ontouchmove" in document.documentElement) { // Safari、Android移动端触摸事件处理
            this.isWebkit = true;
            this.startEvent = "touchstart";
            this.moveEvent = "touchmove";
            this.endEvent = "touchend";
        } else  if(window.navigator.msPointerEnabled) { // WP移动端触摸事件处理
            document.documentElement.style.msTouchAction = "none"; // disables all pan/zoom behaviors and fire pointer events in javascript instead.
            this.isWP = true;
            this.startEvent = "MSPointerDown";
            this.moveEvent = "MSPointerMove";
            this.endEvent = "MSPointerUp";
        } else { // PC端鼠标事件处理
            this.startEvent = "mousedown";
            this.moveEvent = "mousemove";
            this.endEvent = "mouseup";
        }
    }
    DragLibrary.prototype = {
        drag: function() {
            var target = this.dragElem;
            if(target.addEventListener) {
                target.addEventListener(this.startEvent, this.startDragHandler, false);
            } else {
                target.attachEvent("on" + this.startEvent, this.startDragHandler);
            }
        },
        startDrag:  function(e) {
            var wLeft, hTop, $tarE;

            $tarE = $(this.tarElem);
            wLeft = parseInt($tarE.css("left"), 10);
            hTop = parseInt($tarE.css("top"), 10);

            if(this.isWebkit) {
                this.offsetX = e.targetTouches[0].pageX - wLeft;
                this.offsetY = e.targetTouches[0].pageY - hTop;
            } else if(e.pageX && e.pageY) {
                this.offsetX = e.pageX - wLeft;
                this.offsetY = e.pageY - hTop;
            } else {
                this.offsetX = e.clientX + document.body.scrollLeft - document.body.clientLeft - wLeft;
                this.offsetY = e.clientY + document.body.scrollTop - document.body.clientTop - hTop;
            }
            
            if(document.addEventListener) {
                document.addEventListener(this.moveEvent, this.doDragHandler, false);
                document.addEventListener(this.endEvent, this.stopDragHandler, false);
            } else {
                document.attachEvent("on" + this.moveEvent, this.doDragHandler);
                document.attachEvent("on" + this.endEvent, this.stopDragHandler);
            }
            
            return false;
        },
        doDrag: function(e) {
            e = e ? e : window.event;
            if(e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            var x, y;
            if(this.isWebkit) {
                x = e.changedTouches[0].pageX - this.offsetX;
                y = e.changedTouches[0].pageY - this.offsetY;
            } else if(e.pageX && e.pageY) {
                x = e.pageX - this.offsetX;
                y = e.pageY - this.offsetY;
            } else {
                x = e.clientX + document.body.scrollLeft - document.body.clientLeft - this.offsetX;
                y = e.clientY + document.body.scrollTop - document.body.clientTop - this.offsetY;
            }
            
            $(this.tarElem).css("left", x).css("top", y);
        },
        stopDrag: function() {
            if(document.addEventListener) {
                document.removeEventListener(this.moveEvent, this.doDragHandler, false);
                document.removeEventListener(this.endEvent, this.stopDragHandler, false);
            } else {
                document.detachEvent("on" + this.moveEvent, this.doDragHandler);
                document.detachEvent("on" + this.endEvent, this.stopDragHandler);
            }
        },    
        bind: function(func, obj) {
            // create a reference to all arguments past the second one
            var args = Array.prototype.slice.apply(arguments, [2]);
            return function() {
                // Push on any additional arguments from the actual function call.
                // These will come after those sent to the bind call.
                var newArgs = args.concat(
                    Array.prototype.slice.apply(arguments, [0])
                );
                return func.apply(obj, newArgs);
            };
        }
    }
    var old = $.fn.dragLibrary

    $.fn.dragLibrary = function () {
        return this.each(function () {
            $(this).find(".modal-dialog").each(function() {
                var $modalDialog = $(this);
                new DragLibrary(this, $modalDialog.find(".modal-header").get(0)).drag();
            })
        });
    }

    $.fn.dragLibrary.Constructor = DragLibrary


    // MODAL NO CONFLICT
    // =================

    $.fn.dragLibrary.noConflict = function () {
        $.fn.dragLibrary = old
        return this
    }
    // $(window).on('load', function () {
    //     $(".modal-dialog").each(function () {
    //         var $modalDialog = $(this);
    //         new DragLibrary(this, $modalDialog.find(".modal-header").get(0)).drag();
    //     });
    // });
});