'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Categories = new Module('categories');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Categories.register(function(app, auth, database/*, circles, swagger*/) {

  //We enable routing. By default the Package Object is passed to the routes
  Categories.routes(app, auth, database);

  Categories.aggregateAsset('css', 'categories.css');

  //We are adding a link to the main menu for all authenticated users
/*
  Categories.menus.add({
    'roles': ['authenticated'],
    'title': 'All categories',
    'link': 'all categories'
  });

  Categories.menus.add({
    title: 'create category',
    link: 'create category',
    roles: ['authenticated'],
 /!*   menu: 'main'*!/
  });
*/

  Categories.menus.add({
   title: 'קטגוריות',
   link: 'categories',
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

  return Categories;
});
