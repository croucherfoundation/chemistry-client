// HTML sanitizing
// Very restrictive, allowing only HTML elements and styles that our tools are able to create
// Anything else is stripped out, and almost all attributes and styles are removed.
// One exception: tables are allowed, in anticipation of a future 'embed table' control.

const permittedTags = new Set(['p', 'ul', 'ol', 'li', 'h2', 'h3', 'strong', 'em', 'u', 's', 'a', 'code', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span']);
const discardedEmptyTags = new Set(['span', 'b', 'i', 'u', 'strong', 'em', 's']);
const permittedAttributes = new Set(['src', 'href', 'target', 'title', 'role']);
// const permittedStyles = new Set([]);

const permittedProtocols = ['https://', 'http://', 'data://'];
const tagChanges = {
  i: 'em',
  b: 'strong',
  h1: 'h2',
  h4: 'h3',
  h5: 'h3',
  form: 'div',
  fieldset: 'div',
};

function nodeIsDiscarded(node) {
  return discardedEmptyTags.has(node.tagName.toLowerCase()) && node.innerText.trim() === '';
}

function tagNameForNode(node) {
  const tagName = node.tagName.toLowerCase();
  return tagChanges[tagName];
}

function nodeIsPermitted(node) {
  return permittedTags.has(node.tagName.toLowerCase());
}

function attributeIsPermitted(attribute) {
  return permittedAttributes.has(attribute.toLowerCase());
}

function addressIsPermitted(value) {
  return permittedProtocols.find((prot) => value.slice(0, prot.length) === prot);
}

// function styleIsPermitted(name) {
//   return permittedStyles.has(name);
// }

function sanitizeNode(node) {
  if (node.nodeType === 3) {
    return node.cloneNode(true);
  }

  if (nodeIsDiscarded(node)) {
    return '';
  }

  if (!nodeIsPermitted(node) && !tagNameForNode(node)) {
    return '';
  }

  // create new node of permitted type
  const tagName = tagNameForNode(node) || node.tagName;
  const newNode = document.createElement(tagName);

  // assign permitted attributes
  Array.from(node.attributes).forEach((attr) => {
    let ok;
    let value;
    if (attr.name === 'style)') {
      ok = false;
      value = ''; // todo: iterate through styles choosing only the whitelisted
    } else if (attr.name === 'src' || attr.name === 'href') {
      ok = attributeIsPermitted(attr.name) && addressIsPermitted(attr.value);
      value = attr.value;
    } else {
      ok = attributeIsPermitted(attr.name);
      value = attr.value;
    }
    if (ok) {
      newNode.setAttribute(attr.name, value);
    }
  });

  // copy permitted child nodes
  Array.from(node.childNodes).forEach((childNode) => {
    const childCopy = sanitizeNode(childNode);
    if (childCopy) {
      newNode.append(childCopy);
    }
  });

  // return new node
  return newNode;
}

function sanitize(el) {
  return sanitizeNode(el);
}

function sanitizeContents(el) {
  Array.from(el.childNodes).forEach((childNode) => {
    const cleaned = sanitizeNode(childNode);
    childNode.replaceWith(cleaned);
  });
}


export {
  sanitize,
  sanitizeContents,
};

