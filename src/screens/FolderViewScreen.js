import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import PhotoGrid from '../components/PhotoGrid';
import { getPhotosInFolder } from '../storage';

// "Pictures in folder" : les photos contenues dans un dossier.
export default function FolderViewScreen({ route, navigation }) {
  const { folderId, folderName } = route.params;
  const [photos, setPhotos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getPhotosInFolder(folderId).then((list) => {
        if (active) setPhotos(list);
      });
      return () => {
        active = false;
      };
    }, [folderId])
  );

  return (
    <PhotoGrid
      photos={photos}
      emptyText={`Le dossier "${folderName}" est vide.`}
      onPressPhoto={(photo) =>
        navigation.navigate('FolderPhotoDetail', { photo, folderName })
      }
    />
  );
}
