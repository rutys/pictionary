'use strict';

/*
/!* jshint -W098 *!/
// The Package is past automatically as first parameter
module.exports = function(Categories, app, auth, database) {

  app.get('/api/categories/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/api/categories/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/categories/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/api/categories/example/render', function(req, res, next) {
    Categories.render('index', {
      package: 'categories'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
*/

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && !req.article.user._id.equals(req.user._id)) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

var hasPermissions = function(req, res, next) {

  req.body.permissions = req.body.permissions || ['authenticated'];

  for (var i = 0; i < req.body.permissions.length; i++) {
    var permission = req.body.permissions[i];
    if (req.acl.user.allowed.indexOf(permission) === -1) {
      return res.status(401).send('User not allowed to assign ' + permission + ' permission.');
    };
  };

  next();
};

module.exports = function(Users, app, auth) {

  var users = require('../controllers/scores');

  app.route('/api/scores').get(users.all);
      //.post(auth.requiresLogin, hasPermissions,categories.create);
//  app.route('/api/categories/:categoryId')
  //    .get(auth.isMongoId, categories.show)
      //.put(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, categories.update)
      //.delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, categories.destroy);

  // Finish with setting up the articleId param
  //app.param('categoryId', categories.category);
};
