package tagger

import (
	"encoding/gob"
	"github.com/pkg/errors"
	"log"
	"os"
	"path/filepath"
	"time"
)

type Tagger struct {
	dbDir string

	images map[string]ImageTags
}

type ImageTags struct {
	Tags  []string
	Notes string
}

func New(dbDir string) *Tagger {
	return &Tagger{dbDir: dbDir}
}

func (t *Tagger) Start() {
	err := t.load()
	if err != nil {
		log.Fatal(err)
	}

	ticker := time.NewTicker(10 * time.Minute)
	for range ticker.C {
		log.Println("saving to db file")
		err := t.save()
		if err != nil {
			log.Printf("cannot save db to file: %s", err)
		}
	}
}

func (t *Tagger) TagImage(img, tag string) ImageTags {
	imageTags := t.images[img]

	exists := false
	for _, tg := range imageTags.Tags {
		if tg == tag {
			exists = true
			break
		}
	}
	if !exists {
		imageTags.Tags = append(imageTags.Tags, tag)
		t.images[img] = imageTags
	}

	return imageTags
}

func (t *Tagger) SetImageNotes(img, notes string) ImageTags {
	imageTags := t.images[img]
	imageTags.Notes = notes
	t.images[img] = imageTags
	return imageTags
}

func (t *Tagger) FindImageTags(img string) ImageTags {
	return t.images[img]
}

func (t *Tagger) dbPath() string {
	return filepath.Join(t.dbDir, "db")
}

func (t *Tagger) save() error {
	dbPath := t.dbPath()
	backupPath := filepath.Join(t.dbDir, "backup")
	err := os.Rename(dbPath, backupPath)
	if err != nil && !os.IsNotExist(err) {
		return errors.WithMessage(err, "cannot make db backup")
	}

	file, err := os.OpenFile(dbPath, os.O_RDWR|os.O_CREATE, 0777)
	if err != nil {
		return errors.WithMessage(err, "cannot open db file to save changes")
	}
	defer file.Close()

	encoder := gob.NewEncoder(file)
	err = encoder.Encode(&t.images)
	if err != nil {
		return errors.WithMessage(err, "cannot write to db file")
	}
	return nil
}

func (t *Tagger) load() error {
	file, err := os.Open(t.dbPath())
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return errors.WithMessage(err, "cannot open db file")
	}
	defer file.Close()

	decoder := gob.NewDecoder(file)
	err = decoder.Decode(&t.images)
	if err != nil {
		return errors.WithMessage(err, "cannot read db file")
	}
	return err
}
