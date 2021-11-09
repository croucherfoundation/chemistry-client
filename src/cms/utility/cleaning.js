// HTML tidying
// Here we strip out the controls we put in: the back end will also sanitize.

const controlSelectors = [
  '[data-cms]',
  '.cms-controls',
  '.cms-embed-controls',
  '.cms-page-controls',
];

const editingAttributes = [
  'contenteditable',
  'data-placeholder',
  'data-medium-editor-element',
  'data-medium-editor-editor-index',
  'data-medium-focused',
  'medium-editor-index',
  'role',
  'spellcheck',
  'aria-multiline',
];

const editingClasses = [
  'medium-editor-element',
  'cms-shimmy',
  'animate',
  'cms-page-list',
];

function cleanCopy(el) {
  const cleaner = document.createElement('div');
  cleaner.append(el.cloneNode(true));

  // Remove control elements entirely: buttons, menus, etc
  const controlsSelector = controlSelectors.join(', ');
  cleaner.querySelectorAll(controlsSelector).forEach((dirtyEl) => {
    dirtyEl.remove();
  });

  // Clear editing attributes from content elements
  const attributesSelector = editingAttributes.map((att) => `[${att}]`).join(', ');
  cleaner.querySelectorAll(attributesSelector).forEach((dirtyEl) => {
    editingAttributes.forEach((att) => dirtyEl.removeAttribute(att));
  });

  // Remove editing classes
  const classesSelector = editingClasses.map((att) => `.${att}`).join(', ');
  cleaner.querySelectorAll(classesSelector).forEach((dirtyEl) => {
    editingClasses.forEach((cls) => dirtyEl.classList.remove(cls));
  });

  return cleaner.firstChild;
}

// remove cms machinery and return remaining html
function stripControls(el) {
  const cleanEl = cleanCopy(el);
  return cleanEl.outerHTML;
}

// remove cms machinery and return text content
function stripHtml(el) {
  const cleanEl = cleanCopy(el);
  return cleanEl.innerText.trim();
}

// simple html-remover
function textOnly(value = '') {
  const input = value.trim();
  if (!input) {
    return '';
  }
  const cleaner = document.createElement('div');
  cleaner.innerHTML = input;
  return cleaner.innerText;
}

export {
  cleanCopy,
  stripControls,
  stripHtml,
  textOnly,
};
