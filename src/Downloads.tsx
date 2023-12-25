import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface DownloadsProps {
  item: {
    torrName: string;
    downlink: string;
  };
  index: number;
  focusDownload: number | null;
  setFocusDownload: React.Dispatch<React.SetStateAction<number | null>>;
  setThumbFocus: React.Dispatch<React.SetStateAction<any>>;
  setFocusedMenu: React.Dispatch<React.SetStateAction<any>>;
  handleOpenTorentClick: (downlink: string) => void;
  album?: {
    magLinks: string[] | string;
  } | null;
}

const Downloads: React.FC<DownloadsProps> = ({
  item,
  index,
  focusDownload,
  setFocusDownload,
  setThumbFocus,
  setFocusedMenu,
  handleOpenTorentClick,
  album,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          opacity: focusDownload === index ? 1 : 0.7,
        },
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onFocus={() => {
          setFocusDownload(index);
          setThumbFocus(null);
          setFocusedMenu(null);
        }}
        onPress={() => handleOpenTorentClick(album?.magLinks[index])}>
        <LinearGradient
          colors={['#00cc00', '#006600']}
          style={[
            styles.btnBackground,
            {
              padding: focusDownload === index ? 0 : 10,
              backgroundColor: focusDownload === index ? 'lightblue' : 'white',
              borderWidth: focusDownload === index ? 3 : 0,
            },
          ]}>
          <Text style={{color: 'white'}}>
            {item.torrName
              .split(')')[1]
              .replace('ESub.torrent', '')
              .replace('.mkv.torrent', '')
              .replace('ESub', '')
              .replace('& AAC', '')
              .replace('ESub.mkv.torrent', '')
              .slice(0, 50)}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    right: 0,
  },
  btnBackground: {
    margin: 10,
    borderColor: 'blue',
    marginRight: 10,
    height: 45,
    width: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default Downloads;
