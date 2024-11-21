import React from 'react';

import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';

import {pickDocument} from '../utils/FileUtils';
import LoadFileCard from '../components/load/LoadFileCard';
import {
  Canvas,
  fitbox,
  Group,
  ImageSVG,
  rect,
  SkSVG,
  useSVG,
} from '@shopify/react-native-skia';

type FileInfo = {
  uri: string;
  name: string;
};

export default function LoadDataScreen() {
  const addFileSvg = useSVG(require('../assets/svg/add_files.svg'));

  const [fileList, setFileList] = React.useState<FileInfo[]>([]);

  const handleUploadPress = async () => {
    const pickedFile = await pickDocument();
    if (!pickedFile) return;

    setFileList([
      ...fileList,
      {
        uri: pickedFile.uri,
        name: pickedFile.name ?? `File ${fileList.length + 1}`,
      },
    ]);
  };

  const handleClose = (index: number) => () => {
    setFileList(fileList.filter((_, i) => i !== index));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {fileList.map((file, index) => (
          <LoadFileCard
            key={index}
            uri={file.uri}
            name={file.name}
            onClose={handleClose(index)}
          />
        ))}
        {fileList.length === 0 && <AddFilesComponent svg={addFileSvg} />}
        <Button mode="contained" icon={'upload'} onPress={handleUploadPress}>
          Load file
        </Button>
      </View>
    </ScrollView>
  );
}

const AddFilesComponent = (props: {svg: SkSVG | null}) => {
  const width = 128;
  const height = 128;
  const src = rect(0, 0, props.svg?.width() ?? 0, props.svg?.height() ?? 0);
  const dst = rect(0, 0, width, height);

  return (
    <View style={styles.addFilesContainer}>
      <Canvas style={styles.addFilesCanvas}>
        {props.svg && (
          <Group transform={fitbox('contain', src, dst)}>
            <ImageSVG svg={props.svg} x={0} y={0} width={64} height={64} />
          </Group>
        )}
      </Canvas>
      <Text variant="labelLarge">No CSV files selected!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  addFilesContainer: {
    height: 256,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  addFilesCanvas: {
    height: 128,
    width: 128,
  },
});
