import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { createFolder, deleteFolder, getFolders } from '../storage';

// Ecran 3 : liste des dossiers + creation d'un nouveau dossier.
export default function FoldersScreen({ navigation }) {
  const [folders, setFolders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');

  const refresh = useCallback(() => {
    getFolders().then(setFolders);
  }, []);

  useFocusEffect(refresh);

  async function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    await createFolder(trimmed);
    setName('');
    setModalVisible(false);
    refresh();
  }

  function handleLongPress(folder) {
    Alert.alert('Supprimer le dossier', `Supprimer "${folder.name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteFolder(folder.id);
          refresh();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun dossier pour l'instant.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.folder}
            onPress={() =>
              navigation.navigate('FolderView', { folderId: item.id, folderName: item.name })
            }
            onLongPress={() => handleLongPress(item)}
          >
            <Text style={styles.folderIcon}>📁</Text>
            <Text style={styles.folderName}>{item.name}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.newFolder} onPress={() => setModalVisible(true)}>
        <Text style={styles.newFolderText}>+ nouveau dossier</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Nouveau dossier</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du dossier"
              value={name}
              onChangeText={setName}
              autoFocus
            />
            <View style={styles.dialogRow}>
              <TouchableOpacity
                onPress={() => {
                  setName('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate}>
                <Text style={styles.confirm}>Creer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 12 },
  empty: { textAlign: 'center', color: '#6b7280', marginTop: 40 },
  folder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  folderIcon: { fontSize: 22, marginRight: 12 },
  folderName: { flex: 1, fontSize: 16, fontWeight: '600', fontStyle: 'italic' },
  chevron: { fontSize: 24, color: '#9ca3af' },
  newFolder: {
    margin: 12,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  newFolderText: { color: '#2563eb', fontWeight: '700', fontSize: 16 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: { backgroundColor: '#fff', borderRadius: 14, padding: 20, width: '100%' },
  dialogTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  dialogRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
    marginTop: 18,
  },
  cancel: { color: '#6b7280', fontWeight: '600', fontSize: 16 },
  confirm: { color: '#2563eb', fontWeight: '700', fontSize: 16 },
});
