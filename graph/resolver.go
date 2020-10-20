package graph

import (
	"github.com/gwwfps/photowolf/gallery"
	"github.com/gwwfps/photowolf/graph/model"
	"github.com/gwwfps/photowolf/tagger"
)

//go:generate go run github.com/99designs/gqlgen

type Resolver struct {
	gallery *gallery.Gallery
	tagger  *tagger.Tagger
}

func NewResolver(gallery *gallery.Gallery, tagger *tagger.Tagger) *Resolver {
	return &Resolver{gallery: gallery, tagger: tagger}
}

func (r *Resolver) imageFileToPhoto(img *gallery.ImageFile) *model.Photo {
	tags := r.tagger.FindImageTags(img.Name)
	notes := &tags.Notes
	if tags.Notes == "" {
		notes = nil
	}
	return &model.Photo{
		Name:    img.Name,
		Notes:   notes,
		Tags:    tags.Tags,
		Updated: img.Updated,
	}
}
