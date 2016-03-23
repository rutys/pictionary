'use strict';
// ================================================
//                           chat
// ================================================
angular.module('mean.socket').directive('chat', function (Global, MeanSocket, $stateParams, MeanUser) {
    return {
        restrict: 'EA',
        scope: {
         /*   messages:"=messages",
            message:"=message",
            send:"&",*/
        },
        templateUrl: 'socket/views/chat.html',
        link: function (scope, elm, attr) {
            scope.user=MeanUser.user;
            scope.channel=$stateParams.category;
            scope.messages=[];
            scope.message='';

            //scroll down on init
            $('.msg_container_base').scrollTop($('.msg_container_base')[0].scrollHeight);

            scope.send = function () {
                if (!scope.message || scope.message === null || typeof scope.message === 'undefined' || scope.message.length === 0) {
                    return;
                }
                MeanSocket.emit('message:send', {
                    message: scope.message,
                    user: scope.user,
                    channel: scope.channel
                });
                scope.message='';
            };

            MeanSocket.on('messages:channel:' + scope.channel, function (messages) {
                if (messages && messages.length !== 0) {
                    console.log("messages: " + messages);
                    scope.messages = messages;
                }
            });

            MeanSocket.on('message:channel:' + scope.channel, function (message) {
                if (message){
                    scope.messages.push(message);
                    //todo: scroll after message pushed
                    //scroll down
                    $('.msg_container_base').scrollTop($('.msg_container_base')[0].scrollHeight);
                }
            });

            MeanSocket.on('clearMessages:' + scope.channel, function () {
                scope.messages = [];
            });

            $(document).on('click', '.panel-heading span.icon_minim', function (e) {
                var $this = $(this);
                if (!$this.hasClass('panel-collapsed')) {
                    $this.parents('.panel').find('.panel-body').slideUp();
                    $this.addClass('panel-collapsed');
                    $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
                } else {
                    $this.parents('.panel').find('.panel-body').slideDown();
                    $this.removeClass('panel-collapsed');
                    $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
                }
            });
            $(document).on('focus', '.panel-footer input.chat_input', function (e) {
                var $this = $(this);
                if ($('#minim_chat_window').hasClass('panel-collapsed')) {
                    $this.parents('.panel').find('.panel-body').slideDown();
                    $('#minim_chat_window').removeClass('panel-collapsed');
                    $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
                }
            });
            $(document).on('click', '#new_chat', function (e) {
                var size = $( ".chat-window:last-child" ).css("margin-left");
                var size_total = parseInt(size) + 400;
                alert(size_total);
                var clone = $( "#chat_window_1" ).clone().appendTo( ".container" );
                clone.css("margin-left", size_total);
            });
            $(document).on('click', '.icon_close', function (e) {
                //$(this).parent().parent().parent().parent().remove();
                $( "#chat_window_1" ).remove();
            });


        }
    };
});

