// Couche de persistance basée sur le file system de l'appareil (expo-file-system).
//
// - Les photos sont stockées comme fichiers dans  <document>/photos/
// - Les dossiers et l'appartenance d'une photo a un dossier sont stockes
//   dans  <document>/data.json
//
// Regle metier : une photo ne peut appartenir qu'a UN seul dossier a la fois
// (cf. "picture can only be in a folder once !").

import { Directory, File, Paths } from 'expo-file-system';

const photosDir = new Directory(Paths.document, 'photos');
const dataFile = new File(Paths.document, 'data.json');

const EMPTY = { folders: [], assignments: {} };

// Cree le dossier des photos et le fichier de metadonnees si besoin.
export function init() {
  if (!photosDir.exists) {
    photosDir.create({ intermediates: true, idempotent: true });
  }
  if (!dataFile.exists) {
    dataFile.create();
    dataFile.write(JSON.stringify(EMPTY));
  }
}

async function loadData() {
  init();
  try {
    const raw = await dataFile.text();
    const data = JSON.parse(raw);
    return { folders: data.folders ?? [], assignments: data.assignments ?? {} };
  } catch {
    return { ...EMPTY };
  }
}

function saveData(data) {
  dataFile.write(JSON.stringify(data));
}

// ---------- Photos ----------

// Liste toutes les photos, les plus recentes en premier.
export function listPhotos() {
  init();
  return photosDir
    .list()
    .filter((entry) => entry instanceof File)
    .map((file) => ({ name: file.name, uri: file.uri }))
    .sort((a, b) => b.name.localeCompare(a.name));
}

// Copie la photo capturee (uri temporaire) dans le stockage de l'app.
export async function savePhoto(tempUri) {
  init();
  const name = `IMG_${Date.now()}.jpg`;
  const source = new File(tempUri);
  source.copy(new File(photosDir, name));
  return name;
}

// Supprime definitivement une photo et son appartenance a un dossier.
export async function deletePhoto(photoName) {
  const data = await loadData();
  delete data.assignments[photoName];
  saveData(data);
  const file = new File(photosDir, photoName);
  if (file.exists) file.delete();
}

// ---------- Dossiers ----------

export async function getFolders() {
  const data = await loadData();
  return data.folders;
}

export async function createFolder(name) {
  const data = await loadData();
  const folder = { id: `${Date.now()}`, name: name.trim() };
  data.folders.push(folder);
  saveData(data);
  return folder;
}

export async function deleteFolder(folderId) {
  const data = await loadData();
  data.folders = data.folders.filter((f) => f.id !== folderId);
  for (const photoName of Object.keys(data.assignments)) {
    if (data.assignments[photoName] === folderId) {
      delete data.assignments[photoName];
    }
  }
  saveData(data);
}

// ---------- Appartenance photo <-> dossier ----------

// Renvoie l'id du dossier d'une photo, ou null si elle n'est dans aucun dossier.
export async function getPhotoFolder(photoName) {
  const data = await loadData();
  return data.assignments[photoName] ?? null;
}

// Affecte la photo a un dossier. Comme une photo ne peut etre que dans un
// dossier a la fois, on ecrase simplement l'affectation precedente.
export async function assignPhotoToFolder(photoName, folderId) {
  const data = await loadData();
  data.assignments[photoName] = folderId;
  saveData(data);
}

export async function removePhotoFromFolder(photoName) {
  const data = await loadData();
  delete data.assignments[photoName];
  saveData(data);
}

// Renvoie les photos contenues dans un dossier.
export async function getPhotosInFolder(folderId) {
  const data = await loadData();
  const names = Object.keys(data.assignments).filter(
    (name) => data.assignments[name] === folderId
  );
  return listPhotos().filter((photo) => names.includes(photo.name));
}
