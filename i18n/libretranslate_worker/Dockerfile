FROM alpine:3.17
COPY ./worker/* .
RUN apk update && apk add nodejs npm && npm install
CMD ["/usr/local/bin/node worker.js"]