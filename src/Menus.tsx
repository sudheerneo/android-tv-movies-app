import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

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
  item: string;
  index: number;
  selectMenu: (index: number) => void;
  menu: number;
  setFocusedMenu: (index: number) => void;
  setThumbFocus: (value: any) => void;
  setFocusDownload: (value: any) => void;
  setData: React.Dispatch<React.SetStateAction<MovieData[]>>;
  setVisibleData: React.Dispatch<React.SetStateAction<MovieData[]>>;
  setAlbum: React.Dispatch<React.SetStateAction<MovieData | null>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number | boolean>>;
  data: MovieData[];
  eng: MovieData[];
  tel: MovieData[];
  trend: MovieData[];
  focusDownload: number | null;
  focusMenu: number | null;
}

const Menus = ({
  item,
  index,
  setFocusedMenu,
  setThumbFocus,
  setFocusDownload,
  selectMenu,
  menu,
  setData,
  setVisibleData,
  setAlbum,
  setCurrentIndex,
  data,
  eng,
  tel,
  trend,
  focusDownload,
  focusMenu,
}: RenderItemProps) => (
  <TouchableOpacity
    key={index}
    activeOpacity={1}
    onFocus={() => {
      setFocusedMenu(index);
      setThumbFocus(null);
      setFocusDownload(null);
    }}
    onPress={() => {
      selectMenu(index);
      console.log(item);
      if (item === 'English') {
        setData(eng);
        setVisibleData(eng.slice(0, 20));
        setAlbum(eng[0]);
        setCurrentIndex(0);
      } else if (item === 'Telugu') {
        setData(tel);
        setVisibleData(tel.slice(0, 20));
        setAlbum(tel[0]);
        setCurrentIndex(0);
      } else if (item === 'Trending') {
        setData(trend);
        setVisibleData(trend.slice(0, 20));
        setAlbum(trend[0]);
        setCurrentIndex(0);
      } else {
        setVisibleData(trend);
        setAlbum(trend[0]);
        setCurrentIndex(0);
      }
    }}
    style={[
      styles.container,
      {
        padding: focusDownload === index ? 0 : 10,
        backgroundColor: menu === index ? '#5cb85c' : 'white',
        borderWidth: focusMenu === index ? 3 : 0,
        opacity: focusMenu === index ? 1 : menu === index ? 1 : 0.7,
      },
    ]}>
    <Text style={{color: menu === index ? 'white' : 'black'}}>{item}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderColor: 'blue',
    marginRight: 10,
    height: 45,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default Menus;
