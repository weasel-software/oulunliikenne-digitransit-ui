@ECHO OFF
START "Start node server" CMD /K "CD..&& set NODE_ENV=development&& set CONFIG=oulu&& set NODE_OPTIONS=--trace-deprecation&& nodemon -e js,css,scss,html --watch ./app/ server/server.js"
START "Start node hot load server" CMD /K "CD..&& set NODE_ENV=development&& set NODE_OPTIONS=--trace-deprecation&& set CONFIG=oulu&& yarn run webpack-dev-server"
