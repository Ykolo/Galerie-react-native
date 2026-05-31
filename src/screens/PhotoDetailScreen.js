import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  assignPhotoToFolder,
  getFolders,
  getPhotoFolder,
  removePhotoFromFolder,
} from '../storage';

// "Big picture" : la photo en grand avec "select folder" + "add".
// Une photo ne pouvant etre que dans un seul dossier, ajouter a un nouveau
// dossier remplace l'affectation precedente.
export default function PhotoDetailScreen({ route, navigation }) {
  const { photo } = route.params;

  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [list, assigned] = await Promise.all([
          getFolders(),
          getPhotoFolder(photo.name),
        ]);
        if (!active) return;
        setFolders(list);
        setCurrentFolderId(assigned);
        setSelectedFolderId(assigned);
      })();
      return () => {
        active = false;
      };
    }, [photo.name])
  );

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const currentFolder = folders.find((f) => f.id === currentFolderId);

  async function handleAdd() {
    if (!selectedFolderId) {
      setPickerVisible(true);
      return;
    }
    await assignPhotoToFolder(photo.name, selectedFolderId);
    setCurrentFolderId(selectedFolderId);
    navigation.goBack();
  }

  async function handleRemove() {
    await removePhotoFromFolder(photo.name);
    setCurrentFolderId(null);
    setSelectedFolderId(null);
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="contain" />

      <View style={styles.panel}>
        {currentFolder ? (
          <Text style={styles.status}>
            Actuellement dans : <Text style={styles.bold}>{currentFolder.name}</Text>
          </Text>
        ) : (
          <Text style={styles.status}>Cette photo n'est dans aucun dossier.</Text>
        )}

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.selectButton]}
            onPress={() => setPickerVisible(true)}
          >
            <Text style={styles.selectButtonText} numberOfLines={1}>
              {selectedFolder ? selectedFolder.name : 'select folder'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.addButton, !selectedFolderId && styles.disabled]}
            onPress={handleAdd}
            disabled={!selectedFolderId}
          >
            <Text style={styles.addButtonText}>add</Text>
          </TouchableOpacity>
        </View>

        {currentFolder ? (
          <TouchableOpacity onPress={handleRemove}>
            <Text style={styles.removeLink}>retirer du dossier</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FolderPicker
        visible={pickerVisible}
        folders={folders}
        onClose={() => setPickerVisible(false)}
        onSelect={(id) => {
          setSelectedFolderId(id);
          setPickerVisible(false);
        }}
      />
    </View>
  );
}

function FolderPicker({ visible, folders, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Choisir un dossier</Text>
          {folders.length ? (
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.sheetItem} onPress={() => onSelect(item.id)}>
                  <Text style={styles.sheetItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.sheetEmpty}>
              Aucun dossier. Cree un dossier dans l'onglet Dossiers.
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  photo: { flex: 1, width: '100%' },
  panel: { backgroundColor: '#fff', padding: 20, paddingBottom: 32 },
  status: { fontSize: 15, color: '#374151', marginBottom: 16, textAlign: 'center' },
  bold: { fontWeight: '700' },
  row: { flexDirection: 'row', gap: 12 },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButton: { borderWidth: 1, borderColor: '#9ca3af', backgroundColor: '#f9fafb' },
  selectButtonText: { color: '#111827', fontWeight: '600' },
  addButton: { backgroundColor: '#2563eb' },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.4 },
  removeLink: {
    marginTop: 16,
    textAlign: 'center',
    color: '#dc2626',
    fontWeight: '600',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  sheetItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  sheetItemText: { fontSize: 16 },
  sheetEmpty: { color: '#6b7280', paddingVertical: 16 },
});
