var http = require('http');
var path = require('path');
var fs = require('fs');

var node = 'desktop.bundle';
var bemtree = require(path.resolve(path.join(node, node + '.bemtree.js'))).BEMTREE;
var bemhtml = require(path.resolve(path.join(node, node + '.bemhtml.js'))).BEMHTML;

http.createServer(function (req, res) {
    if (req.url === '/') {
        bemtree
            .apply({block: 'app'})
            .then(function (tree) {
                res.end(bemhtml.apply(tree));
            });
    } else {
        var file = path.resolve(path.join('desktop.bundle', req.url));
        fs.exists(file, function (yes) {
            if (yes) {
                var stream = fs.createReadStream(file);

                stream
                    .on('open', function () {
                        stream.pipe(res);
                    })
                    .on('error', function (err) {
                        stream.end(err);
                    });
            } else {
                res.statusCode = 404;
                res.end();
            }
        });
    }
}).listen(8080);

console.log('Server is running on 8080 port.');
