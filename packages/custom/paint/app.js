'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Paint = new Module('paint');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Paint.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Paint.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
/*  Paint.menus.add({
    title: 'paint example page',
    link: 'paint example page',
    roles: ['authenticated'],
    menu: 'main'
  });*/
  
  Paint.aggregateAsset('css', 'paint.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Paint.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Paint.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Paint.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Paint;
});
