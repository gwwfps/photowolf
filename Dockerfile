FROM golang:1.15 as go

WORKDIR /go/src/app
ADD . /go/src/app
RUN go get -d -v ./...
RUN go build -o /go/bin/app

FROM node:14.14 as node

RUN npm install -g npm@7 
ADD web /usr/src/app/web
WORKDIR /usr/src/app/web
RUN npm install
RUN npm run build

FROM gcr.io/distroless/base-debian10
COPY --from=go /go/bin/app /
COPY --from=node /usr/src/app/web/dist /static
CMD ["/app"]
