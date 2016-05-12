    var express = require('express');
    var app = express();
// new for exer 8
    var React = require('react');
    var ReactDOMServer = require('react-dom/server');
    var DOM = React.DOM;
    var body = DOM.body;
    var div = DOM.div;
    var script = DOM.script;
    
    var browserify = require('browserify');
    var babelify = require("babelify");
// end new

    app.set('port', (process.argv[2] || 3000));
    app.set('view engine', 'jsx');
    app.set('views', __dirname + '/views');
    app.engine('jsx', require('express-react-views').createEngine({ transformViews: false }));
    
    require('babel/register')({
        ignore: false
    });

//new for 8
    var TodoBox = require('./views/exer8.jsx');
    
    var data = [
      {'title':'Shopping', 'detail' : process.argv[3]},
      {'title':'Hair cut', 'detail': process.argv[4]}
    ];

//new for 8
    app.use('/bundle.js', function (req, res) {
        res.setHeader('content-type', 'application/javascript');
    
        browserify({ debug: true })
            .transform(babelify.configure({
                presets: ["react", "es2015"]
            }))
            .require("./app8.js", { entry: true })
            .bundle()
            .pipe(res);
    });


    app.use('/', function(req, res) {
//new for 8
       var initialData = JSON.stringify(data);
        var markup = ReactDOMServer.renderToString(React.createElement(TodoBox, {data: data}));
    
        res.setHeader('Content-Type', 'text/html');
    
        var html = ReactDOMServer.renderToStaticMarkup(body(null,
            div({id: 'app', dangerouslySetInnerHTML: {__html: markup}}),
            script({
                id: 'initial-data',
                type: 'text/plain',
                'data-json': initialData
            }),
            script({src: '/bundle.js'})
        ));
    
        res.end(html);
//      res.render('exer8', {data: data});
    });
    
    app.listen(app.get('port'), function() {});

