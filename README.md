FBShareDialog
=============

A JavaScript plugin to share stories to Facebook's wall

This is an interface component for websites and Facebook applications which allows your users to make a selection of one of their friend or themself to share stories on the wall. The friend is returned as an array of Facebook ID.
It is similar to the `fb:multi-friend-selector` component by Facebook, except it can be used to select friends for anything, not just application requests.

![This is what it looks like.](http://oleksandrvladymyrov.github.io/FBShareDialog/pic/design.png)

## Viewing the example

You can view the example at [page](http://oleksandrvladymyrov.github.io/FBShareDialog/), or you can check out this repository and run it yourself. You'll need to put the files on a web server - Facebook apps won't run off the local file system.

Just edit `example.js` and set your Facebook `appId`.

## Using the plugin

### Include required HTML

- Copy the `div` element with the ID `FBShareDialog` (and all of its children) from `index.html`.
- There is some text in the HTML. This is where you can localise the plugin to the desired language.

### Include required CSS

- Include the `fbsharedialog.css` stylesheet in your document.


### Include required JavaScript

- Include jQuery in your document. We are considering making this plugin library independent, but currently jQuery is required.
- Include the Facebook [JavaScript SDK](http://developers.facebook.com/docs/reference/javascript/). (Technically, this step is optional. We have provided a `setFriends` function if you have loaded the friends on the serverside and want to avoid the JavaScript SDK.)
- Include Bootstrap in your document. We are considering making this plugin library independent, but currently Bootstrap is required.
- Include `fbsharedialog.js`.
- Optional: We are using an HTML5 placeholder attribute on the search field. If you want the placeholder to work in older browsers, include a [placeholder polyfill](https://github.com/mathiasbynens/Placeholder-jQuery-Plugin).
- Note: we haven't minified the script for you but you might like to [minify it](http://refresh-sf.com/yui/) and concatenate it into a single file with your other plugins.

### The fun stuff (using the plugin)

1 - Make sure your user has authenticated your Facebook app.

2 - Initialise the plugin. Here you can set options like toggling debug messages, your preferred classnames, etc.

	FBShareDialog.init({debug: true});

3 - Create an instance of the plugin. We allow multiple instances per page because sometimes you will need users to select friends for more than one thing. You can pass in options here which will only effect this instance, for example a callback to deal with the friends that are selected.

	selector1 = FBShareDialog.newInstance({
		callbackSubmit: function(selectedFriendIds) {
			console.log("The following friends were selected: " + selectedFriendIds.join(", "));
		}
	});

4 - Display the plugin instance when you need it. The plugin will automatically load the Facebook friends of the logged in user (and they will be cached and reused across all instances on the page).

	$("#btnSelect1").click(function (e) {
		e.preventDefault();
		selector1.showFriendSelector();
	});

5 - According to the dimension(width) of browser's window there are two options of design. We called it desktop and mobile. The desktop design will automatically deployed with width of browser's window >=768px otherwise will be deployed mobile design. The mobile design is oriented to use with touchscreen interface, but can be used on desktop as well.

![This is what it looks like.](http://oleksandrvladymyrov.github.io/FBShareDialog/pic/design.png)

6 - According to design, the library propose different types of the share dialog

![This is what it looks like.](http://oleksandrvladymyrov.github.io/FBShareDialog/pic/dialog.png)

7 - Events
    Library exposes a few events for hooking into modal functionality.

    Event Type	Description
    FBShareDialog:share 	This event fires immediately when the answer from FaceBook received.
    FBShareDialog:friendSelected	This event is fired when friend selected.
    FBShareDialog:friendUnselected	This event is fired when friend unselected.


    $("#FBShareDialog").on('FBShareDialog:share', function (e, eventInfo){
        // do something…
    });

    $("#FBShareDialog").on('FBShareDialog:friendSelected', function (e, eventInfo){
        // do something…
    });

    $("#FBShareDialog").on('FBShareDialog:friendUnselected', function (e, eventInfo){
        // do something…
    });

8- CallBacks
   The library provides the opportunity to interact through a callback function

- callbackFriendSelected   :
- callbackFriendUnselected :
- callbackSubmit           :
- callbackCancel           :

## Thanks

This library was write on [These Days Labs Facebook-friend-selector](https://github.com/thesedays/Facebook-friend-selector) base.