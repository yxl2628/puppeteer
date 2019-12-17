FROM ubuntu:18.04
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bakcup; \
  touch /etc/apt/sources.list; \
  echo "deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse" >> /etc/apt/sources.list; \
  echo "deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse" >> /etc/apt/sources.list; \
  echo "deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse" >> /etc/apt/sources.list; \
  echo "deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse" >> /etc/apt/sources.list; \
  echo "deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse" >> /etc/apt/sources.list; \
  echo "deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse" >> /etc/apt/sources.list; \
  echo "deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse" >> /etc/apt/sources.list; \
  echo "deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse" >> /etc/apt/sources.list; \
  echo "deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse" >> /etc/apt/sources.list; \
  echo "deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse" >> /etc/apt/sources.list; \
  apt-get clean; \
  apt-get update
RUN apt-get install curl wget -y \
  && cd /opt \
  && lastVersion="node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\-linux-x64.tar.gz</a>.*|\1|p')}-linux-x64" \
  && curl "https://nodejs.org/dist/latest/${lastVersion}.tar.gz" > "node-latest.tar.gz" \
  && cd /opt && tar zxvf node-latest.tar.gz \
  && mv "${lastVersion}" nodejs \
  && ln -s /opt/nodejs/bin/node /usr/local/bin/node \
  && ln -s /opt/nodejs/bin/npm /usr/local/bin/npm \
  && npm install -g cnpm --registry=https://registry.npm.taobao.org \
  && ln -s /opt/nodejs/bin/cnpm /usr/local/bin/cnpm \
  && rm -rf node-latest.tar.gz
RUN apt-get install git zip unzip libx11-xcb1 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 libnss3 libxss1 -y \
  && cd /opt \
  && git clone http://yangxl:flyinsky2628@10.0.250.70:8088/yangxl/puppeteer.git \
  && cd /opt/puppeteer/ \
  && cnpm i