/*jslint devel: true, bitwise: false, undef: false, browser: true, continue: false, debug: false, eqeq: false, es5: false, type: false, evil: false, vars: false, forin: false, white: true, newcap: false, nomen: true, plusplus: false, regexp: true, sloppy: true */
/*globals $, jQuery, FB, FBShareDialog */

window.fbAsyncInit = function () {

    FB.init({appId: '219476688176789', status: true, cookie: false, xfbml: false, oauth: true});

    $(document).ready(function () {

        var selector1, selector2, selector3, selector4, selector5, selector9,
            logActivity, callbackFriendSelected, callbackFriendUnselected,
            callbackSubmit, callbackCancel;


        // When a friend is selected, log their name and ID
        callbackFriendSelected = function (friendId) {
            var friend, name;
            friend = FBShareDialog.getFriendById(friendId);
            name = friend.name;
            logActivity('Selected ' + name + ' (ID: ' + friendId + ')');
        };

        // When a friend is deselected, log their name and ID
        callbackFriendUnselected = function (friendId) {
            var friend, name;
            friend = FBShareDialog.getFriendById(friendId);
            name = friend.name;
            logActivity('Unselected ' + name + ' (ID: ' + friendId + ')');
        };

        // When the user clicks OK, log a message
        callbackSubmit = function (selectedFriendIds, answer) {
            logActivity('Clicked OK with the following friends selected: ' + selectedFriendIds.join(", "));
            logActivity('Answer from FaceBook. Status : ' + answer.status + ' ID : ' + answer.fb_answer.post_id);
        };

        // When the user clicks Cancel or press 'Esc' button, log a message
        callbackCancel = function () {
            logActivity('Clicked Cancel(x)');
        };


        // Initialise the Friend Selector with options that will apply to all instances
        FBShareDialog.init({debug: true});


        // Create some Friend Selector instances
        selector1 = FBShareDialog.newInstance({
            callbackFriendSelected   : callbackFriendSelected,
            callbackFriendUnselected : callbackFriendUnselected,
            callbackSubmit           : callbackSubmit,
            callbackCancel           : callbackCancel,
            autoDeselection          : true,
            app_id                   : 219476688176789,
            link                     : 'http://stackoverflow.com/questions/18424798/twitter-bootstrap-3-how-to-use-media-queries',
            display                  : 'touch',
            caption                  : 'An example caption',
            description              : "my-description",
            picture                  : 'http://www.google.com.ua/images/srpr/logo11w.png',
            name                     : 'My NAME',
            properties               : JSON.stringify({title: "Conference", date: {"text": "today", "href": "https://github.com/"}}),
            actions                  : JSON.stringify({name: "MYLINK ", link: "http://getbootstrap.com/css/#responsive-utilities"}),
            ref                      : "MYref"
        });

        // Create some Friend Selector instances
        selector2 = FBShareDialog.newInstance({
            callbackFriendSelected   : callbackFriendSelected,
            callbackFriendUnselected : callbackFriendUnselected,
            callbackSubmit           : callbackSubmit,
            callbackCancel           : callbackCancel,
            autoDeselection          : true,
            app_id                   : 219476688176789,
            link                     : 'http://stackoverflow.com/questions/18424798/twitter-bootstrap-3-how-to-use-media-queries',
            display                  : 'popup',
            caption                  : 'An example caption',
            description              : "my-description",
            picture                  : 'http://www.google.com.ua/images/srpr/logo11w.png',
            name                     : 'My NAME',
            properties               : JSON.stringify({title: "Conference", date: {"text": "today", "href": "https://github.com/"}}),
            actions                  : JSON.stringify({name: "MYLINK ", link: "http://getbootstrap.com/css/#responsive-utilities"}),
            ref                      : "MYref"
        });

        // Create some Friend Selector instances
        selector3 = FBShareDialog.newInstance({
            callbackFriendSelected   : callbackFriendSelected,
            callbackFriendUnselected : callbackFriendUnselected,
            callbackSubmit           : callbackSubmit,
            callbackCancel           : callbackCancel,
            autoDeselection          : true,
            app_id                   : 219476688176789,
            link                     : 'http://stackoverflow.com/questions/18424798/twitter-bootstrap-3-how-to-use-media-queries',
            display                  : 'dialog',
            caption                  : 'An example caption',
            description              : "my-description",
            picture                  : 'http://www.google.com.ua/images/srpr/logo11w.png',
            name                     : 'My NAME',
            properties               : JSON.stringify({title: "Conference", date: {"text": "today", "href": "https://github.com/"}}),
            actions                  : JSON.stringify({name: "MYLINK ", link: "http://getbootstrap.com/css/#responsive-utilities"}),
            ref                      : "MYref"
        });

        // Create some Friend Selector instances
        selector4 = FBShareDialog.newInstance({
            callbackFriendSelected   : callbackFriendSelected,
            callbackFriendUnselected : callbackFriendUnselected,
            callbackSubmit           : callbackSubmit,
            callbackCancel           : callbackCancel,
            autoDeselection          : true,
            app_id                   : 219476688176789,
            link                     : 'http://stackoverflow.com/questions/18424798/twitter-bootstrap-3-how-to-use-media-queries',
            display                  : 'iframe',
            caption                  : 'An example caption',
            description              : "my-description",
            picture                  : 'http://www.google.com.ua/images/srpr/logo11w.png',
            name                     : 'My NAME',
            properties               : JSON.stringify({title: "Conference", date: {"text": "today", "href": "https://github.com/"}}),
            actions                  : JSON.stringify({name: "MYLINK ", link: "http://getbootstrap.com/css/#responsive-utilities"}),
            ref                      : "MYref"
        });

        // Create some Friend Selector instances
        selector5 = FBShareDialog.newInstance({
            callbackFriendSelected   : callbackFriendSelected,
            callbackFriendUnselected : callbackFriendUnselected,
            callbackSubmit           : callbackSubmit,
            callbackCancel           : callbackCancel,
            autoDeselection          : true,
            app_id                   : 219476688176789,
            link                     : 'http://stackoverflow.com/questions/18424798/twitter-bootstrap-3-how-to-use-media-queries',
            display                  : 'page',
            caption                  : 'An example caption',
            description              : "my-description",
            picture                  : 'http://www.google.com.ua/images/srpr/logo11w.png',
            name                     : 'My NAME',
            properties               : JSON.stringify({title: "Conference", date: {"text": "today", "href": "https://github.com/"}}),
            actions                  : JSON.stringify({name: "MYLINK ", link: "http://getbootstrap.com/css/#responsive-utilities"}),
            ref                      : "MYref"
        });

        // Create some Friend Selector instances
        selector9 = FBShareDialog.newInstance({
            callbackFriendSelected   : callbackFriendSelected,
            callbackFriendUnselected : callbackFriendUnselected,
            callbackSubmit           : callbackSubmit,
            callbackCancel           : callbackCancel,
            autoDeselection          : true,
            app_id                   : 219476688176789,
            link                     : 'http://stackoverflow.com/questions/18424798/twitter-bootstrap-3-how-to-use-media-queries',
            display                  : 'auto',
            caption                  : 'An example caption',
            description              : "my-description",
            picture                  : 'http://www.google.com.ua/images/srpr/logo11w.png',
            name                     : 'My NAME',
            properties               : JSON.stringify({title: "Conference", date: {"text": "today", "href": "https://github.com/"}}),
            actions                  : JSON.stringify({name: "MYLINK ", link: "http://getbootstrap.com/css/#responsive-utilities"}),
            ref                      : "MYref"
        });


        FB.getLoginStatus(function (response) {
            if (response.authResponse) {
                $("#login-status").html("Logged in");
                $("ul li a.run.disabled").removeClass('disabled');
                $("ul > span").hide('slow');
            } else {
                $("#login-status").html("Not logged in");
            }
        });

        $("#btnLogin").click(function (e) {
            e.preventDefault();
            FB.login(function (response) {
                if (response.authResponse) {
                    console.log("Logged in");
                    $("#login-status").html("Logged in");
                    $("ul li a.run.disabled").removeClass('disabled');
                    $("ul > span").hide('slow');
                } else {
                    console.log("Not logged in");
                    $("#login-status").html("Not logged in");
                    $("ul li a.run").addClass('disabled');
                    $("ul > span").show('fast');
                }
            }, {});
        });

        $("#btnLogout").click(function (e) {
            e.preventDefault();
            FB.logout();
            $("#login-status").html("Not logged in");
            $("ul li a.run").addClass('disabled');
            $("ul > span").show('fast');
        });

        $("#btnSelect1").click(function (e) {
            e.preventDefault();
            selector1.showFriendSelector();
        });

        $("#btnSelect2").click(function (e) {
            e.preventDefault();
            selector2.showFriendSelector();
        });

        $("#btnSelect3").click(function (e) {
            e.preventDefault();
            selector3.showFriendSelector();
        });

        $("#btnSelect4").click(function (e) {
            e.preventDefault();
            selector4.showFriendSelector();
        });

        $("#btnSelect5").click(function (e) {
            e.preventDefault();
            selector5.showFriendSelector();
        });

        $("#btnSelect9").click(function (e) {
            e.preventDefault();
            selector9.showFriendSelector();
        });

        $("#FBShareDialog").on('FBShareDialog:share', function (e, eventInfo) {
            logActivity('Catched event: ' + e.type + ' Status: ' + eventInfo.status);
        });


        $("#FBShareDialog").on('FBShareDialog:friendSelected', function (e, eventInfo) {
            logActivity('Catched event: ' + e.type + ' ID: ' + eventInfo);
        });

        $("#FBShareDialog").on('FBShareDialog:friendUnselected', function (e, eventInfo) {
            logActivity('Catched event: ' + e.type + ' ID: ' + eventInfo);
        });

        logActivity = function (message) {
            $("#results").append('<div>' + new Date() + ' - ' + message + '</div>');
        };

        $('div#info').text($(window).height() + '-height ' + $(window).width() + '-width');
    });
};

(function () {
    var e = document.createElement('script');
    e.async = true;
//    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.src = document.location.protocol + "//connect.facebook.net/en_US/all/debug.js";
    document.getElementById('fb-root').appendChild(e);
}());

