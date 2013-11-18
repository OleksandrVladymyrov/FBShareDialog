FBShareDialog
=============

A JavaScript plugin to share stories to facebook's wall

This is an interface component for websites and facebook applications which allows your users to make a selection of one of their friend or themself to share stories on the wall. The friend is returned as an array of facebook ID, the post_id is returned as an object after successful post.


![This is what it looks like.](http://oleksandrvladymyrov.github.io/FBShareDialog/pic/design.png)

## Viewing the example

You can view the example at [page](http://oleksandrvladymyrov.github.io/FBShareDialog/), or you can check out this repository and run it yourself. You'll need to put the files on a web server - facebook apps won't run off the local file system.

Just edit `example.js` and set your facebook `appId`.

## Using the plugin

### Include required HTML

- Copy the `div` element with the ID `FBShareDialog` (and all of its children) from `index.html`.
- There is some text in the HTML. This is where you can localise the plugin to the desired language.

### Include required CSS

- Include the `fbsharedialog.css` stylesheet in your document.


### Include required JavaScript

- Include jQuery in your document.
- Include the facebook [JavaScript SDK](http://developers.facebook.com/docs/reference/javascript/). (Technically, this step is optional. We have provided a `setFriends` function if you have loaded the friends on the serverside and want to avoid the JavaScript SDK.)
- Include [Bootstrap](http://getbootstrap.com/) in your document.
- Include `fbsharedialog.js`.
- Optional: We are using an HTML5 placeholder attribute on the search field. If you want the placeholder to work in older browsers, include a [placeholder polyfill](https://github.com/mathiasbynens/Placeholder-jQuery-Plugin).
- Note: we haven't minified the script for you but you might like to [minify it](http://refresh-sf.com/yui/) and concatenate it into a single file with your other plugins.

### The fun stuff (using the plugin)

1 - Create a facebook application, as shown below.
![This is what it looks like.](http://oleksandrvladymyrov.github.io/FBShareDialog/pic/facebook_app.png)

1.1 - Make sure your user has authenticated your facebook app.

2 - Initialise the plugin. Here you can set options like toggling debug messages, your preferred classnames, etc.

	FBShareDialog.init({debug: true});

3 - Create an instance of the plugin. We allow multiple instances per page because sometimes you will need users to select friends for more than one thing. You can pass in options here which will only effect this instance, for example a callback to deal with the friends that are selected.

	selector1 = FBShareDialog.newInstance({
		callbackSubmit: function(selectedFriendIds) {
			console.log("The following friends were selected: " + selectedFriendIds.join(", "));
		}
	});

4 - Display the plugin instance when you need it. The plugin will automatically load the facebook friends of the logged in user (and they will be cached and reused across all instances on the page).

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

<table>
  <tr>
    <th> </th><th>Event Type</th><th>Description</th>
  </tr>
  <tr>
    <td>1</td><td>FBShareDialog:share</td><td>This event fires immediately when the answer from faceBook received</td>
  </tr>
  <tr>
    <td>2</td><td>FBShareDialog:friendSelected</td><td>This event is fired when friend selected</td>
  </tr>
  <tr>
    <td>3</td><td>FBShareDialog:friendUnselected</td><td>This event is fired when friend unselected</td>
  </tr>
</table>



     $("#FBShareDialog").on('FBShareDialog:share', function (e, eventInfo){
        // do something…
    });
     $("#FBShareDialog").on('FBShareDialog:friendSelected', function (e, eventInfo){
        // do something…
     });
     $("#FBShareDialog").on('FBShareDialog:friendUnselected', function (e, eventInfo){
        // do something…
    });


8 - CallBacks

   The library provides the opportunity to interact through a callback function

- callbackFriendSelected
- callbackFriendUnselected
- callbackSubmit
- callbackCancel

9 - Using fbredirect.html and fbredirect.php

 They are required(one of them on your choice) to return control to your application after share story to faceBook's wall at desktop design.

10 - Parameters

 You can specify all parameters that support [Feed and Share Dialogs](https://developers.facebook.com/docs/reference/dialogs/feed/).
If you don't specify the 'display' property or set `auto` than in desktop design will be applied `iframe` display type and `touch` in mobile as well. You can also force the `popup` or `page` or `dialog` or `iframe` or `touch` display types, if necessary.


## Thanks

This library was wrote on [These Days Labs Facebook-friend-selector](https://github.com/thesedays/Facebook-friend-selector) base.
