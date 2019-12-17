### how to build

`docker build -t quic-test ./docker`

### how to start

`docker run -idt --name quic --restart=always -v /opt/result:/opt/puppeteer/src/result quic-test`

### how to update

`docker exec -ti quic /bin/bash`

then

`cd /opt/puppeteer/ && /bin/sh pull.sh`