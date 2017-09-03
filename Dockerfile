FROM node:6.9.0
RUN apt-get -yq update && apt-get -yq install git bzip2 automake build-essential
RUN \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
  apt-get update && \
  apt-get install -y mongodb-org-server && \
  apt-get install -y mongodb-org && \
  rm -rf /var/lib/apt/lists/*
VOLUME ["/data/db"]
WORKDIR /data
CMD ["mongod"]
EXPOSE 27017
EXPOSE 28017

RUN apt-get install graphicsmagick -y
WORKDIR $HOME/socailcops
COPY package.json .
RUN npm install -g babel-cli
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]