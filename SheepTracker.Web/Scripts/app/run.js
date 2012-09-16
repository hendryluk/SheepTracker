﻿/**
 * This file is used to reconfigure parts of the loader at runtime for this application. We've put this extra
 * configuration in a separate file, instead of adding it directly to index.html, because it contains options that
 * can be shared if the application is run on both the client and the server.
 *
 * If you aren't planning on running your app on both the client and the server, you could easily move this
 * configuration into index.html (as a dojoConfig object) if it makes your life easier.
 */
require({
    parseOnLoad: true,
    // A list of packages to register. Strictly speaking, you do not need to register any packages,
    // but you can't require "app" and get app/main.js if you do not register the "app" package (the loader will look
    // for a module at <baseUrl>/app.js instead). Unregistered packages also cannot use the `map` feature, which
    // might be important to you if you need to relocate dependencies. TL;DR, register all your packages all the time:
    // it will make your life easier.
    packages: [
		// If you are registering a package that has an identical name and location, you can just pass a string
		// instead, and it will configure it using that string for both the "name" and "location" properties. Handy!
		'dojo',
		'dijit',
		'dojox',
        'dojorx',
        'xstyle',
        'put-selector',
        'dgrid',
		// For reference, this is what a more verbose package declaration looks like.
		{ name: 'app', location: 'app', map: {} }
    ]
    // Require `app`. This loads the main application module, `app/main`, since we registered the `app` package above.
}, ['dojorx', 'app', 'dojo/domReady!']);