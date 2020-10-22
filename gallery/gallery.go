package gallery

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"github.com/pkg/errors"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
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

	hash := sha256.New()
	_, err := hash.Write(data)
	if err != nil {
		return nil, errors.WithMessage(err, "cannot hash data for file name")
	}
	name := fmt.Sprintf("%x.%s", hash.Sum(nil), ext)
	err = ioutil.WriteFile(filepath.Join(g.imgDir, name), data, 0666)
	if err != nil {
		return nil, errors.WithMessage(err, "cannot save file")
	}

	log.Printf("saved file %s", name)
	return &ImageFile{
		Name:    name,
		Updated: int(time.Now().Unix()),
	}, nil
}

func (g *Gallery) DownloadPhoto(url string, referrer *string) (*ImageFile, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, errors.WithMessage(err, "invalid download request")
	}
	if referrer != nil {
		req.Header.Set("Referrer", *referrer)
	}
	client := &http.Client{}
	resp, err := client.Do(req)
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
	data, err := base64.StdEncoding.DecodeString(b64)
	if err != nil {
		return nil, errors.WithMessage(err, "cannot decode image data")
	}

	return g.saveFile(data)
}

func (g *Gallery) DeletePhoto(name string) error {
	return os.Remove(filepath.Join(g.imgDir, name))
}
