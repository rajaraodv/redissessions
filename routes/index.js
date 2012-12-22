
/*
 * GET home page.
 */

exports.index = function(req, res){
  req.session.count = req.session.count ? ++req.session.count : 1;
  var hostPort = (process.env.VCAP_APP_HOST || 3000) + ":" +  (process.env.VCAP_APP_PORT || 80);
  res.render('index', { title: 'Express', count: req.session.count, hostPort: hostPort });
};