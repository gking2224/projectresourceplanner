# base
FROM me.gking2224/npm-base:v2

# details
MAINTAINER Graham King <gking2224@gmail.com>

# labels

# build args
#ARG version

# environment variables
ENV APP_DIR=$WORK_DIR/app
ENV env=dev

# create directories

# run as user

# fetch code

# copy code
RUN mkdir $WORK_DIR/app
#COPY client $APP_DIR/client
#COPY common $APP_DIR/common
COPY public $APP_DIR/public
#COPY server $APP_DIR/server
#COPY package.json $APP_DIR
#COPY webpack.config.js $APP_DIR
COPY index.js $APP_DIR/index.js
COPY server.js $APP_DIR/server.js
#COPY .babelrc $APP_DIR
#COPY .babelignore $APP_DIR

#RUN cd $APP_DIR && npm install

RUN ln -s /tmp/app/node_modules $APP_DIR/node_modules
RUN npm set progress=false

# executable
CMD NODE_ENV=$env node $APP_DIR/server.js
