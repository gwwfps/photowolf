package main

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/gwwfps/photowolf/gallery"
	"github.com/gwwfps/photowolf/graph"
	"github.com/gwwfps/photowolf/graph/generated"
	"github.com/gwwfps/photowolf/tagger"
	"github.com/kelseyhightower/envconfig"
	"github.com/valyala/fasthttp"
	"github.com/valyala/fasthttp/fasthttpadaptor"
	"log"
	"net/http/httputil"
	"net/url"
	"strings"
)

type Config struct {
	Port    string `default:"8080"`
	WebPort string
	ImgDir  string `required:"true"`
	DbDir   string `required:"true"`
}

func main() {
	var c Config
	err := envconfig.Process("photowolf", &c)
	if err != nil {
		log.Fatal(err)
	}

	staticFs := &fasthttp.FS{
		Root: "./static",
	}
	static := staticFs.NewRequestHandler()
	if c.WebPort != "" {
		u, _ := url.Parse("http://localhost:" + c.WebPort)
		static = fasthttpadaptor.NewFastHTTPHandler(httputil.NewSingleHostReverseProxy(u))
	}

	imgFs := &fasthttp.FS{
		Root:        c.ImgDir,
		PathRewrite: fasthttp.NewPathSlashesStripper(1),
	}
	imgs := imgFs.NewRequestHandler()

	g := gallery.New(c.ImgDir)
	t := tagger.New(c.DbDir)
	go t.Start()
	r := graph.NewResolver(g, t)
	srv := fasthttpadaptor.NewFastHTTPHandler(handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: r})))

	h := func(ctx *fasthttp.RequestCtx) {
		path := string(ctx.Path())
		if path == "/graphql" {
			srv(ctx)
		} else if strings.HasPrefix(path, "/photos/") {
			imgs(ctx)
		} else {
			static(ctx)
		}
	}

	log.Printf("starting server on %s", c.Port)
	log.Fatal(fasthttp.ListenAndServe(":"+c.Port, h))
}
