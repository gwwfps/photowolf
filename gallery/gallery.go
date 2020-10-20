package gallery

import (
	"encoding/base64"
	"fmt"
	"github.com/pkg/errors"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type Gallery struct {
	imgDir string
}

func New(imgDir string) *Gallery {
	return &Gallery{imgDir: imgDir}
}

var extMappings map[string]string = map[string]string{
	"image/png":  "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
}

type ImageFile struct {
	Name    string
	Updated int
}

func (g *Gallery) ListFiles() ([]ImageFile, error) {
	files, err := ioutil.ReadDir(g.imgDir)
	if err != nil {
		return nil, errors.WithMessage(err, "cannot read dir")
	}

	var ims []ImageFile
	for _, f := range files {
		ims = append(ims, ImageFile{
			Name:    f.Name(),
			Updated: int(f.ModTime().Unix()),
		})
	}
	return ims, nil
}

func (g *Gallery) LookupFile(name string) (*ImageFile, error) {
	stat, err := os.Stat(filepath.Join(g.imgDir, name))
	if err != nil {
		return nil, errors.WithMessage(err, "cannot read file")
	}

	return &ImageFile{
		Name:    name,
		Updated: int(stat.ModTime().Unix()),
	}, nil
}

func (g *Gallery) saveFile(data []byte) (*ImageFile, error) {
	mime := http.DetectContentType(data)
	ext, ok := extMappings[mime]
	if !ok {
		return nil, fmt.Errorf("unsupported image mime type %s", mime)
	}

	name := fmt.Sprintf("%d.%s", time.Now().UnixNano(), ext)
	err := ioutil.WriteFile(filepath.Join(g.imgDir, name), data, 0666)
	if err != nil {
		return nil, errors.WithMessage(err, "cannot save file")
	}

	return &ImageFile{
		Name:    name,
		Updated: int(time.Now().Unix()),
	}, nil
}

func (g *Gallery) DownloadPhoto(url string) (*ImageFile, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, errors.WithMessage(err, "cannot download file")
	}
	defer resp.Body.Close()

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.WithMessage(err, "cannot read remote response")
	}

	return g.saveFile(data)
}

func (g *Gallery) UploadPhoto(b64 string) (*ImageFile, error) {
	decoder := base64.NewDecoder(base64.StdEncoding, strings.NewReader(b64))
	var data []byte
	_, err := decoder.Read(data)
	if err != nil {
		return nil, errors.WithMessage(err, "cannot decode image data")
	}

	return g.saveFile(data)
}
