import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {Platform} from 'react-native';

interface MovieData {
  url: string;
  title: string;
  thumbnail: string[] | string;
  torrlinks: {
    torrName: string;
    downlink: string;
  }[];
  magLinks: string[] | string;
  updatedOn: string | null;
}

interface RenderItemProps {
  item: MovieData;
  index: number;
  setThumbFocus: (value: any) => void;
  setFocusDownload: React.Dispatch<React.SetStateAction<number | null>>;
  setFocusedMenu: React.Dispatch<React.SetStateAction<number | null>>;
  setAlbum: React.Dispatch<React.SetStateAction<MovieData | null>>;
  focusThumb: number | null;
  setShowLinks: React.Dispatch<React.SetStateAction<boolean>>;
}

const Movies: React.FC<RenderItemProps> = ({
  item,
  index,
  setThumbFocus,
  setFocusDownload,
  setFocusedMenu,
  setAlbum,
  focusThumb,
  setShowLinks,
}) => (
  <TouchableOpacity
    activeOpacity={1}
    key={index}
    onFocus={() => (
      setThumbFocus(index),
      setFocusDownload(null),
      setFocusedMenu(null),
      setAlbum(item)
    )}
    onPress={() => (
      setThumbFocus(index),
      setFocusDownload(null),
      setFocusedMenu(null),
      setAlbum(item),
      setShowLinks(true)
    )}
    style={[
      styles.container,
      {
        borderWidth: focusThumb === index ? 3 : 0,
        height: 200,
        width: focusThumb === index ? 130 : 120,
      },
    ]}>
    {/* Use ImageBackground for TouchableOpacity's background */}
    <ImageBackground
      source={require('./images/vertBg.jpg')} // Use the actual image URL from your data
      style={styles.thumbnail}>
      <ImageBackground
        source={{
          uri:
            item.thumbnail[0] !== null &&
            item.thumbnail[0] !== '' &&
            item.thumbnail[0] !== 'default'
              ? item.thumbnail[0]
              : 'https://picsum.photos/200/300',
        }} // Use the actual image URL from your data
        style={styles.thumbnailWrapper}>
        <View
          style={[
            styles.movieTitleContainer,
            {
              backgroundColor:
                focusThumb === index
                  ? 'rgba(0,0,0, 0.5)'
                  : 'rgba(255, 255, 255, 0)',
            },
          ]}>
          <Text
            style={[
              styles.movieTitle,
              {
                fontSize: Platform.isTV ? 7 : 12,
                backgroundColor: Platform.isTV ? 'transparent' : 'black',
              },
            ]}>
            {item.title
              .match(/^(.*?\))/)?.[1]
              .trim()
              .slice(0, 15) || ''}
          </Text>
        </View>
      </ImageBackground>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    borderColor: 'blue',
    margin: 5,
    // height: 160,
    // width: 100,
    borderRadius: 10,
    overflow: 'hidden', // Clip image to the rounded corners
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    flex: 1,
    width: '100%', // Ensure the image takes the full width of the container
    resizeMode: 'cover', // Maintain the image's aspect ratio
  },
  thumbnailWrapper: {
    flex: 1,
    width: '100%', // Ensure the image takes the full width of the container
    resizeMode: 'cover', // Maintain the image's aspect ratio
  },
  movieTitleContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end', // Adjust as needed
  },
  movieTitle: {
    borderRadius: 5,
    textAlign: 'center',
    color: 'white',
    opacity: 0.8,
    // flex: 1,
    height: 20,
    margin: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Movies;
