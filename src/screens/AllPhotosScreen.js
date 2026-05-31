import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import PhotoGrid from '../components/PhotoGrid';
import { listPhotos } from '../storage';

// Ecran 2 : toutes les photos prises. Un appui ouvre la photo en grand
// pour pouvoir l'ajouter a un dossier.
export default function AllPhotosScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);

  // Recharge la liste a chaque fois que l'ecran reprend le focus
  // (nouvelle photo prise, retour depuis le detail, etc.).
  useFocusEffect(
    useCallback(() => {
      setPhotos(listPhotos());
    }, [])
  );

  return (
    <PhotoGrid
      photos={photos}
      emptyText={'Aucune photo.\nPrends une photo depuis l\'onglet Camera.'}
      onPressPhoto={(photo) => navigation.navigate('PhotoDetail', { photo })}
    />
  );
}
