
/*!
 * FaceBook Share Dialog
 * @authors: Oleksandr Vladymyrov
 */
var FBShareDialog = (function(module, $) {

	// Public functions
	var init, setFriends, getFriends, getFriendById, newInstance,

	// Private variables
	settings, friends, maxSelection = 1,
	$friends, $container, $friendsContainer, $searchField, $buttonClose, $buttonOK, $selectedName,
    $containerIframe, $Iframe,

	// Private functions
	$getFriendById, buildFriendSelector, sortFriends, log;

	/////////////////////////////////////////
	// PUBLIC FUNCTIONS FOR GLOBAL PLUGIN
	// They are public because they are added to module and returned
	/////////////////////////////////////////

	/**
	 * Initialise the plugin and define global options
	 */
	init = function(options) {

		// Default settings
		settings = {
			speed                    : 500,
			debug                    : false,
			disabledClass            : 'FBShareDialog_disabled',
			friendSelectedClass      : 'FBShareDialog_friendSelected',
			friendDisabledClass      : 'FBShareDialog_friendDisabled',
			friendFilteredClass      : 'FBShareDialog_friendFiltered',
			containerSelector        : '#FBShareDialog',
			friendsContainerSelector : '.FBShareDialog_friendsContainer',
			searchFieldSelector      : '#FBShareDialog_searchField',
			buttonCloseSelector      : '#FBShareDialog_buttonClose',
			buttonOKSelector         : '#FBShareDialog_buttonOK',
            selectedNameContainer    : '.FBShareDialog_selectedNameContainer',
            containerIframe          : '.FBShareDialog_Iframe_loading'
		};

		// Override defaults with arguments
		$.extend(settings, options);

		// Select DOM elements
		$container        = $(settings.containerSelector);
		$friendsContainer = $container.find(settings.friendsContainerSelector);
		$searchField      = $container.find(settings.searchFieldSelector);
		$buttonClose      = $container.find(settings.buttonCloseSelector);
		$buttonOK         = $container.find(settings.buttonOKSelector);
        $selectedName     = $container.find(settings.selectedNameContainer);
        $containerIframe  = $container.find(settings.containerIframe);

        $Iframe           = $containerIframe.find('iframe');

    };

	/**
	 * If your website has already loaded the user's Facebook friends, pass them in here to avoid another API call.
	 */
	setFriends = function(input) {
		var i, len;
		if (!input || input.length === 0) {
			return;
		}
		input = Array.prototype.slice.call(input);
        me = input.shift();
        me.upperCaseName = me.name.toUpperCase();
		for (i = 0, len = input.length; i < len; i += 1) {
			input[i].upperCaseName = input[i].name.toUpperCase();
		}
		input = input.sort(sortFriends);
        input.unshift(me);
		friends = input;
	};

	getFriends = function() {
		return friends;
	};

	/**
	 * Use this function if you have a friend ID and need to know their name
	 */
	getFriendById = function(id) {
		var i, len;
		id = id.toString();
		for (i = 0, len = friends.length; i < len; i += 1) {
			if (friends[i].id === id) {
				return friends[i];
			}
		}
		return null;
	};

	/**
	 * Create a new instance of the friend selector
	 * @param options An object containing settings that are relevant to this particular instance
	 */
	newInstance = function(options) {
		// Public functions
		var showFriendSelector, hideFriendSelector, getSelectedFriendIds, setDisabledFriendIds, filterFriends, reset,

		// Private variables
		instanceSettings, selectedFriendIds = [], disabledFriendIds = [], numFilteredFriends = 0, intervalID,

        // Private functions
		bindEvents, unbindEvents, updateFriendsContainer, selectFriend, share, close, showIframe, hideIframe, src,
        resizeFriendsContainer, matchMediaMaxWidth, matchMediaOrientation;

		if (!settings) {
			log('Cannot create a new instance of FBShareDialog because the plugin not initialised.');
			return false;
		}

		// Default settings
		instanceSettings = {
			autoDeselection          : false, // Allow the user to keep on selecting once they reach maxSelection, and just deselect the first selected friend
			filterCharacters         : 1, // Set to 3 if you would like the filter to only run after the user has typed 3 or more chars
			callbackFriendSelected   : null,
			callbackFriendUnselected : null,
			callbackSubmit           : null,
            callbackCancel           : null,
            app_id                   : 0,
            redirect_uri             : window.location.protocol + '//' + window.location.host + '/fbredirect.html?idDialog=' + encodeURIComponent(settings.containerSelector),
            display                  : 'auto',
            link                     : null,
            picture                  : null,
            source                   : null,
            name                     : null,
            caption                  : null,
            description              : null,
            properties               : null,
            actions                  : null,
            ref                      : null
        };

        if (!options.app_id) {
            log('Cannot create a new instance of FBShareDialog because the app_id don\'t passed.');
            return false;
        }

		// Override defaults with arguments
		$.extend(instanceSettings, options);

		/////////////////////////////////////////
		// PUBLIC FUNCTIONS FOR AN INSTANCE
		/////////////////////////////////////////

		/**
		 * Call this function to show the interface
		 */
		showFriendSelector = function(callback) {
			var i, len;
			log('FBShareDialog - newInstance - showFriendSelector');
			if (!$friends) {
				return buildFriendSelector(function() {
					showFriendSelector(callback);
				});
			} else {
				bindEvents();
				// Update classnames to represent the selections for this instance
				$friends.removeClass(settings.friendSelectedClass + ' ' + settings.friendDisabledClass + ' ' + settings.friendFilteredClass);
				for (i = 0, len = friends.length; i < len; i += 1) {
					if ($.inArray(friends[i].id, selectedFriendIds) !== -1) {
						$($friends[i]).addClass(settings.friendSelectedClass);
					}
					if ($.inArray(friends[i].id, disabledFriendIds) !== -1) {
						$($friends[i]).addClass(settings.friendDisabledClass);
					}
				}
				// Reset filtering
				numFilteredFriends = 0;
				$searchField.val("");
				updateFriendsContainer();
				$container.fadeIn(settings.speed);
				if (typeof callback === 'function') {
					callback();
				}
			}
            resizeFriendsContainer();
		};

		hideFriendSelector = function() {
            log('FBShareDialog - newInstance - hideFriendSelector');
            unbindEvents();
			$container.fadeOut(settings.speed);
		};

		getSelectedFriendIds = function() {
			return selectedFriendIds;
		};

		/**
		 * Disabled friends are greyed out in the interface and are not selectable.
		 */
		setDisabledFriendIds = function(input) {
            log('FBShareDialog - newInstance - disabledFriendIds');
			disabledFriendIds = input;
		};

		/**
		 * Hides friends whose names do not match the filter
		 */
		filterFriends = function(filter) {
			var i, len;
			numFilteredFriends = 0;
			$friends.removeClass(settings.friendFilteredClass);
			if (filter.length >= instanceSettings.filterCharacters) {
				filter = filter.toUpperCase();
				for (i = 0, len = friends.length; i < len; i += 1) {
					if (friends[i].upperCaseName.indexOf(filter) === -1) {
						$($friends[i]).addClass(settings.friendFilteredClass);
						numFilteredFriends += 1;
					}
				}
			}
			updateFriendsContainer();
		};

		/**
		 * Remove selections, clear disabled list, go to page 1, etc
		 */
		reset = function() {
            log('FBShareDialog - newInstance - reset');
			if (!friends || friends.length === 0) {
				return;
			}
			$friendsContainer.empty();
			selectedFriendIds = [];
			disabledFriendIds = [];
			numFilteredFriends = 0;
			$searchField.val("");
            $searchField.prop('placeholder', 'Search friends');
            $selectedName.text('Please make your choice');
		};

		/////////////////////////////////////////
		// PRIVATE FUNCTIONS FOR AN INSTANCE
		/////////////////////////////////////////

		// Add event listeners
		bindEvents = function() {
            log('FBShareDialog - bindEvents');
			$buttonClose.bind('click', function(e) {
				e.preventDefault();
                if (typeof instanceSettings.callbackCancel === "function") { instanceSettings.callbackCancel(); }
                close();

            });

			$buttonOK.bind('click', function(e) {
				e.preventDefault();
                share(selectedFriendIds);
                close();
			});

			$searchField.bind('keyup', function(e) {
				filterFriends($(this).val());
			});

            $searchField.bind('click', function(e) {
                hideIframe();
            });

			// The enter key shouldnt do anything in the search field
			$searchField.bind('keydown', function(e) {
				if (e.which === 13) {
					e.preventDefault();
					e.stopPropagation();
				}
			});

			$(window).bind('keydown', function(e) {
				if (e.which === 13) {
					// The enter key hasnt the same effect as the OK button
					e.preventDefault();
					e.stopPropagation();
				} else if (e.which === 27) {
					// The escape key has the same effect as the close button
					e.preventDefault();
					e.stopPropagation();
                    if (typeof instanceSettings.callbackCancel === "function") { instanceSettings.callbackCancel(); }
                    close();
				}
			});

            $Iframe.bind('load', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $containerIframe.find('img').hide();
                $Iframe.show();
            });

            $Iframe.bind('FBShareDialog:iframe', function(e, answer) {
                e.preventDefault();
                e.stopPropagation();
                $container.trigger('FBShareDialog:share', answer);
                if (answer.status === 'posted') {
                    if (typeof instanceSettings.callbackSubmit === "function") {
                        instanceSettings.callbackSubmit(selectedFriendIds, answer);
                    }
                } else {
                    if (typeof instanceSettings.callbackCancel === "function") {
                        instanceSettings.callbackCancel();
                    }
                }
                close();
            });

            if (window.matchMedia) {
                log('FBShareDialog - bindEvents - window.matchMedia');
                if (window.matchMedia("(max-width:767px)").addListener) {
                    window.matchMedia("(max-width:767px)").addListener(matchMediaMaxWidth);
                    window.matchMedia("(orientation: portrait)").addListener(matchMediaOrientation);
                }
            }

            intervalID = setInterval(resizeFriendsContainer, 1000);
//            setTimeout(resizeFriendsContainer, 10000);
//            setTimeout(resizeFriendsContainer, 20000);
        };

        share = function(selectedFriendIds){
            var answer;
            log('FBShareDialog - newInstance - share');
            FB.ui({
                method: 'feed',
                app_id: instanceSettings.app_id,
                link: instanceSettings.link ,
                caption: instanceSettings.caption,
                description: instanceSettings.description,
                to: selectedFriendIds[0],
                picture: instanceSettings.picture,
                display: ((instanceSettings.display == 'auto')?'touch': instanceSettings.display),
                name: instanceSettings.name,
                properties: instanceSettings.properties,
                actions: instanceSettings.actions,
                ref: instanceSettings.ref
            }, function(response){
                if (response && response.post_id) {
                    log('FBShareDialog - newInstance - share - post');
                    answer = {status: 'posted', fb_answer: response};
                    if (typeof instanceSettings.callbackSubmit === "function") { instanceSettings.callbackSubmit(selectedFriendIds, answer); }
                } else {
                    log('FBShareDialog - newInstance - share - post canceled');
                    answer = {status: 'canceled', fb_answer: response};
                    if (typeof instanceSettings.callbackCancel === "function") { instanceSettings.callbackCancel(); }
                }
                $container.trigger('FBShareDialog:share', answer);
            });
        };

        close = function(){
            $container.hide();
            hideIframe();
            hideFriendSelector();
            reset();
        };


        showIframe = function(to){
            log('FBShareDialog - newInstance - showiframe');
            if ($containerIframe.parent().css('display') !== 'none') {
                $containerIframe.show();
                $Iframe.prop('src', src(to)).hide();
                $containerIframe.find('img').show();
                $friendsContainer.hide();
                $searchField.prop('placeholder', 'Please click here to make another choice');
            }

        };

        hideIframe = function(){
            log('FBShareDialog - newInstance - hideIframe');
            if ($containerIframe.parent().css('display') !== 'none') {
                $containerIframe.hide();
                $containerIframe.find('img').hide();
                $friendsContainer.show();
                $searchField.prop('placeholder', $selectedName.text());
            }
        };

        matchMediaMaxWidth = function (e){
            log('FBShareDialog - newInstance - matchMediaMaxWidth');
            if (e.matches){
                resizeFriendsContainer();
            }
        };

        matchMediaOrientation = function (e){
            log('FBShareDialog - newInstance - matchMediaOrientation');
            resizeFriendsContainer();
        };


        resizeFriendsContainer = function() {
            var FBShareDialog_height, FBShareDialog_outer_height_true, FBShareDialog_outer_height_false, window_height,
                container_outer_height, container_outer_height_false;

            window_height = $(window).height(); //+ ' window_height');
            container_outer_height = $container.outerHeight(true); //+ ' container_outer_height');
            container_outer_height_false = $container.outerHeight(false); //+ ' container_outer_height_false');
            FBShareDialog_outer_height_true = $friendsContainer.outerHeight(true); //+ ' FBShareDialog_outer_height_true');
            FBShareDialog_outer_height_false = $friendsContainer.outerHeight(); //+ ' FBShareDialog_outer_height_false');

            FBShareDialog_height = window_height - container_outer_height;
            FBShareDialog_height -= FBShareDialog_outer_height_true - FBShareDialog_outer_height_false;
            FBShareDialog_height += FBShareDialog_outer_height_false;
            $friendsContainer.css('max-height', FBShareDialog_height + 'px');
        };

		// Remove event listeners
		unbindEvents = function() {
			$buttonClose.unbind('click');
			$buttonOK.unbind('click');
			$friendsContainer.children().unbind('click');
			$searchField.unbind('keyup');
			$searchField.unbind('keydown');
			$(window).unbind('keydown');
            $Iframe.unbind('load');
            $Iframe.unbind('FBShareDialog:iframe');
            if (window.matchMedia) {
                if (window.matchMedia("(max-width:767px)").addListener) {
                    window.matchMedia("(max-width:767px)").removeListener(matchMediaMaxWidth);
                    window.matchMedia("(orientation: portrait)").removeListener(matchMediaOrientation);
                }
            }
            clearInterval(intervalID);

		};

		// Set the contents of the friends container

		updateFriendsContainer = function() {
            $friendsContainer.html($friends.not("." + settings.friendFilteredClass));
			$friendsContainer.children().bind('click', function(e) {
				e.preventDefault();
				selectFriend($(this));
			});
		};

		selectFriend = function($friend) {
			var friendId, i, len, removedId;
			friendId = $friend.attr('data-id');

			// If the friend is disabled, ignore this
			if ($friend.hasClass(settings.friendDisabledClass)) {
				return;
			}

			if (!$friend.hasClass(settings.friendSelectedClass)) {
				// If autoDeselection is enabled and they have already selected the max number of friends, deselect the first friend
                if (instanceSettings.autoDeselection && selectedFriendIds.length === maxSelection) {
					removedId = selectedFriendIds.splice(0, 1);
					$getFriendById(removedId).removeClass(settings.friendSelectedClass);
				}
				if (selectedFriendIds.length < maxSelection) {
					// Add friend to selectedFriendIds
					if ($.inArray(friendId, selectedFriendIds) === -1) {
						selectedFriendIds.push(friendId);
						$friend.addClass(settings.friendSelectedClass);
                        $searchField.prop('placeholder', getFriendById(friendId).name + ' selected');
                        $selectedName.text(getFriendById(friendId).name + ' selected');
                        showIframe(friendId);
                        log('FBShareDialog - newInstance - selectFriend - selected IDs: ', selectedFriendIds);
                        $container.trigger('FBShareDialog:friendSelected', friendId);
						if (typeof instanceSettings.callbackFriendSelected === "function") { instanceSettings.callbackFriendSelected(friendId); }
					} else {
						log('FBShareDialog - newInstance - selectFriend - ID already stored');
					}
				}

			} else {
				// Remove friend from selectedFriendIds
				for (i = 0, len = selectedFriendIds.length; i < len; i += 1) {
					if (selectedFriendIds[i] === friendId) {
						selectedFriendIds.splice(i, 1);
						$friend.removeClass(settings.friendSelectedClass);
                        $searchField.prop('placeholder', 'Search friends - Nobody selected');
                        $selectedName.text('Please make your choice');
                        hideIframe();
                        $container.trigger('FBShareDialog:friendUnselected', friendId);
						if (typeof instanceSettings.callbackFriendUnselected === "function") { instanceSettings.callbackFriendUnselected(friendId); }
						return false;
					}
				}
			}
		};

        src = function (to) {
            log('FBShareDialog - newInstance - src');
            return "https://www.facebook.com/dialog/feed?"
                +"app_id=" + encodeURIComponent(instanceSettings.app_id)
                +((instanceSettings.display == 'auto')?"&display=iframe": "&display="+ encodeURIComponent(instanceSettings.display))
                +((instanceSettings.link)?"&link=" + encodeURIComponent(instanceSettings.link):'')
                +"&redirect_uri=" + encodeURIComponent(instanceSettings.redirect_uri)
                +"&access_token=" + FB.getAccessToken()
                +((instanceSettings.picture)?"&picture=" + encodeURIComponent(instanceSettings.picture):'')
                +((instanceSettings.name)?"&name=" + encodeURIComponent(instanceSettings.name):'')
                +((instanceSettings.caption)?"&caption=" + encodeURIComponent(instanceSettings.caption):'')
                +((instanceSettings.description)?"&description=" + encodeURIComponent(instanceSettings.description):'')
                +((instanceSettings.properties)?"&properties=" + encodeURIComponent(instanceSettings.properties):'')
                +((instanceSettings.actions)?"&actions=" + encodeURIComponent(instanceSettings.actions):'')
                +((instanceSettings.ref)?"&ref=" + encodeURIComponent(instanceSettings.ref):'')
                +((to.length >0)?"&to=" + encodeURIComponent(to) :"")
                ;
        };

		// Return an object with access to the public members
		return {
			showFriendSelector   : showFriendSelector,
			hideFriendSelector   : hideFriendSelector,
			getSelectedFriendIds : getSelectedFriendIds,
			setDisabledFriendIds : setDisabledFriendIds,
			filterFriends        : filterFriends,
			reset                : reset
		};
	};

	/////////////////////////////////////////
	// PRIVATE FUNCTIONS FOR GLOBAL PLUGIN
	/////////////////////////////////////////

	$getFriendById = function(id) {
		var i, len;
		id = id.toString();
		for (i = 0, len = friends.length; i < len; i += 1) {
			if (friends[i].id === id) {
				return $($friends[i]);
			}
		}
		return $("");
	};

	/**
	 * Load the Facebook friends and build the markup
	 */
	buildFriendSelector = function(callback) {
		var buildMarkup, buildFriendMarkup;
		log("buildFriendSelector");

		if (!FB) {
			log('The Facebook SDK must be initialised before showing the friend selector');
			return false;
		}

		// Check that the user is logged in to Facebook
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				// Load Facebook friends
                FB.api('/me?fields=friends,id,name', function(response) {
                    if (response.friends.data) {
                        // Add yourself to the list of friends
                        response.friends.data.unshift({id: response.id, name: "Me"});
						setFriends(response.friends.data);
						// Build the markup
						buildMarkup();
						// Call the callback
						if (typeof callback === 'function') { callback(); }
					} else {
						log('FBShareDialog - buildFriendSelector - No friends returned');
						return false;
					}
				});
			} else {
				log('FBShareDialog - buildFriendSelector - User is not logged in to Facebook');
				return false;
			}
		});

		// Build the markup of the friend selector
		buildMarkup = function() {
			var i, len, html = '';
			for (i = 0, len = friends.length; i < len; i += 1) {
				html += buildFriendMarkup(friends[i]);
			}
			$friends = $(html);
		};

		// Return the markup for a single friend
		buildFriendMarkup = function(friend) {
			return '<a href="#" class="FBShareDialog_friend FBShareDialog_clearfix" data-id="' + friend.id + '">' +
					'<img src="//graph.facebook.com/' + friend.id + '/picture?type=square" width="50" height="50" alt="' + friend.name + '" class="FBShareDialog_friendAvatar" />' +
					'<div class="FBShareDialog_friendName">' + 
						'<span>' + friend.name + '</span>' +
					'</div>' +
				'</a>';
		};
	};

	sortFriends = function(friend1, friend2) {
		if (friend1.upperCaseName === friend2.upperCaseName) { return 0; }
		if (friend1.upperCaseName > friend2.upperCaseName) { return 1; }
		if (friend1.upperCaseName < friend2.upperCaseName) { return -1; }
	};

	log = function() {
		if (settings && settings.debug && window.console) {
			console.log(Array.prototype.slice.call(arguments));
		}
	};

	module = {
		init          : init,
		setFriends    : setFriends,
		getFriends    : getFriends,
		getFriendById : getFriendById,
		newInstance   : newInstance
	};
	return module;

}(FBShareDialog || {}, jQuery));

