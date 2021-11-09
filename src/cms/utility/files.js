function readLocalFile(file, fn) {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => fn(reader.result, file);
    reader.readAsDataURL(file);
  }
}

function readFileInput(el, fn) {
  const file = el.files[0];
  readLocalFile(file, fn);
}

function readFileDrop(e, fn) {
  if (e && e.dataTransfer && e.dataTransfer.files.length) {
    readLocalFile(e.dataTransfer.files[0], fn);
  }
}

// More file utilities expected
// eslint-disable-next-line
export {
  readLocalFile,
  readFileInput,
  readFileDrop,
};
