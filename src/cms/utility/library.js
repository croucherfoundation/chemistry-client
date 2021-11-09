// The library is a global asset bank and model cache.
// It holds all the assets we know about such that we can fetch more when they are needed.

import PagesCollection from 'Collections/pages';
import PageCategoriesCollection from 'Collections/page_categories';
import PageCollectionsCollection from 'Collections/page_collections';
import ImagesCollection from 'Collections/images';
import DocumentsCollection from 'Collections/documents';
import VideosCollection from 'Collections/videos';

const collections = {};

function sharedCollection(CollectionClass) {
  const key = CollectionClass.key();
  if (!collections[key]) {
    collections[key] = new CollectionClass();
    collections[key].isLibraryCollection = true;
  }
  return collections[key];
}

function libraryImages() {
  return sharedCollection(ImagesCollection);
}

function libraryVideos() {
  return sharedCollection(VideosCollection);
}

function libraryDocuments() {
  return sharedCollection(DocumentsCollection);
}

function libraryPages() {
  return sharedCollection(PagesCollection);
}

function libraryPageCollections() {
  return sharedCollection(PageCollectionsCollection);
}

function libraryPageCategories() {
  return sharedCollection(PageCategoriesCollection);
}

function prepareLibrary() {
  libraryPageCategories().load();
  libraryPageCollections().load();
}

export {
  libraryImages,
  libraryVideos,
  libraryDocuments,
  libraryPages,
  libraryPageCollections,
  libraryPageCategories,
  prepareLibrary,
};
