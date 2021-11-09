import EmbeddedImagesView from 'Views/images/embedded_images';
import EmbeddedVideoView from 'Views/videos/embedded_video';
import EmbeddedPagesView from 'Views/pages/embedded_pages';
import EmbeddedDocumentView from 'Views/documents/embedded_document';
import EmbeddedQuoteView from 'Views/quotes/embedded_quote';
import EmbeddedNoteView from 'Views/notes/embedded_note';


const EmbedDefs = [
  {
    label: 'images',
    selector: 'div.embed.images',
    migrate_selector: 'figure.image',
    content_view: EmbeddedImagesView,
  },
  {
    label: 'video',
    selector: 'div.embed.video',
    migrate_selector: 'figure.video',
    content_view: EmbeddedVideoView,
  },
  {
    label: 'pages',
    selector: 'div.embed.pages',
    migrate_selector: 'div.pages',
    content_view: EmbeddedPagesView,
  },
  {
    label: 'documents',
    selector: 'div.embed.document',
    migrate_selector: 'figure.document',
    content_view: EmbeddedDocumentView,
  },
  {
    label: 'quote',
    selector: 'div.embed.quote',
    migrate_selector: 'figure.quote',
    content_view: EmbeddedQuoteView,
  },
  {
    label: 'note',
    selector: 'div.embed.note',
    migrate_selector: 'figure.note',
    content_view: EmbeddedNoteView,
  },
];

export default EmbedDefs;
