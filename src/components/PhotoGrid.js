import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Grille de photos reutilisable (3 colonnes). Affiche un message si vide.
export default function PhotoGrid({ photos, onPressPhoto, emptyText }) {
  if (!photos.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.name}
      numColumns={3}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.cell} onPress={() => onPressPhoto(item)}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 2 },
  cell: { flex: 1 / 3, aspectRatio: 1, padding: 2 },
  image: { flex: 1, borderRadius: 6, backgroundColor: '#e5e7eb' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { color: '#6b7280', fontSize: 16, textAlign: 'center' },
});
