package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"github.com/gwwfps/photowolf/graph/generated"
	"github.com/gwwfps/photowolf/graph/model"
)

func (r *mutationResolver) UploadPhoto(ctx context.Context, input model.UploadPhotoInput) (*model.Photo, error) {
	photo, err := r.gallery.UploadPhoto(input.B64data)
	if err != nil {
		return nil, err
	}
	return r.imageFileToPhoto(photo), nil
}

func (r *mutationResolver) DownloadPhoto(ctx context.Context, input model.DownloadPhotoInput) (*model.Photo, error) {
	photo, err := r.gallery.DownloadPhoto(input.URL, input.Referrer)
	if err != nil {
		return nil, err
	}
	return r.imageFileToPhoto(photo), nil
}

func (r *mutationResolver) DeletePhoto(ctx context.Context, input model.DeletePhotoInput) (*model.Photo, error) {
	err := r.gallery.DeletePhoto(input.Name)
	if err != nil {
		return nil, err
	}
	return &model.Photo{Name: input.Name, Deleted: true}, nil
}

func (r *mutationResolver) TagPhoto(ctx context.Context, input model.TagPhotoInput) (*model.Photo, error) {
	file, err := r.gallery.LookupFile(input.Name)
	if err != nil {
		return nil, err
	}
	r.tagger.TagImage(input.Name, input.Tag)
	return r.imageFileToPhoto(file), nil
}

func (r *mutationResolver) AddNotes(ctx context.Context, input model.AddNotesInput) (*model.Photo, error) {
	file, err := r.gallery.LookupFile(input.Name)
	if err != nil {
		return nil, err
	}
	r.tagger.SetImageNotes(input.Name, input.Notes)
	return r.imageFileToPhoto(file), nil
}

func (r *queryResolver) Photos(ctx context.Context) ([]*model.Photo, error) {
	files, err := r.gallery.ListFiles()
	if err != nil {
		return nil, err
	}
	var photos []*model.Photo
	for _, file := range files {
		photos = append(photos, r.imageFileToPhoto(&file))
	}
	return photos, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
