import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { removePhotoFromFolder } from '../storage';

// Detail d'une photo ouverte depuis un dossier : la photo en grand avec
// un bouton "remove" qui la retire du dossier.
export default function FolderPhotoDetailScreen({ route, navigation }) {
  const { photo, folderName } = route.params;

  async function handleRemove() {
    await removePhotoFromFolder(photo.name);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="contain" />
      <View style={styles.panel}>
        <Text style={styles.caption}>
          Dans le dossier <Text style={styles.bold}>{folderName}</Text>
        </Text>
        <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
          <Text style={styles.removeButtonText}>remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  photo: { flex: 1, width: '100%' },
  panel: { backgroundColor: '#fff', padding: 20, paddingBottom: 32 },
  caption: { textAlign: 'center', color: '#374151', marginBottom: 16, fontSize: 15 },
  bold: { fontWeight: '700' },
  removeButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  removeButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
