'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Scores = new Module('scores');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Scores.register(function(app, auth, database/*, circles, swagger*/) {

  //We enable routing. By default the Package Object is passed to the routes
    Scores.routes(app, auth, database);

    Scores.aggregateAsset('css', 'scores.css');

  //We are adding a link to the main menu for all authenticated users


    Scores.menus.add({
   title: 'ניקוד',
   link: 'scores',
   roles: ['authenticated'],
   menu: 'main'
   });

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Categories.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Categories.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Categories.settings(function(err, settings) {
        //you now have the settings object
    });
    */
/*  swagger.add(__dirname);*/

  return Scores;
});
