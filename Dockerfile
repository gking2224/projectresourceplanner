# base
FROM 839324330571.dkr.ecr.eu-west-1.amazonaws.com/me.gking2224/npm-base:v2

# details
MAINTAINER Graham King <gking2224@gmail.com>

# labels

# build args
#ARG version

# environment variables
ENV APP_DIR=$WORK_DIR/app
ENV ENVIRONMENT=dev

# create directories

# run as user

# fetch code

# copy code
RUN mkdir $WORK_DIR/app
COPY public $APP_DIR/public
COPY index.js $APP_DIR/index.js
COPY server.js $APP_DIR/server.js

RUN ln -s /tmp/node_modules $APP_DIR/node_modules
RUN npm set progress=false

# executable
CMD NODE_ENV=$ENVIRONMENT node $APP_DIR/server.js
