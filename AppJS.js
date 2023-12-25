import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {Platform} from 'react-native';

import trendingMoviesData from './src/trendingMovies.json';

const defImage =
  'https://fastly.picsum.photos/id/609/536/354.jpg?hmac=tVnz1exGJpbwT-2P8MWOvapIg7nTpSQ5SCeUHyu_7mU';

const App = () => {
  const [ready, setReady] = useState(false);
  const [trend, setTrend] = useState(false);
  const [tel, setTel] = useState(false);
  const [eng, setEng] = useState(false);
  const [logMessage, setLogMessage] = useState('');

  const [data, setData] = useState(false);
  const [visibleData, setVisibleData] = useState(false);
  const [background, setBackground] = useState(false);
  const [album, setAlbum] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(false);

  const [focusMenu, setFocusedMenu] = useState(null);
  const [menu, selectMenu] = useState(null);

  const [focusDownload, setFocusDownload] = useState(null);
  const [download, setDownload] = useState(null);

  const [focusThumb, setThumbFocus] = useState(null);
  const [thumb, setThumb] = useState(null);

  const Menu = ['Trending', 'Telugu', 'English'];

  const handleOpenTorentClick = async magnetLink => {
    // console.log('magnet Link clicked : ' + magnetLink);
    // const isSupported = await Linking.canOpenURL(magnetLink);

    // await Linking.openURL(magnetLink);
    // if (isSupported) {
    //   await Linking.openURL(magnetLink);
    // } else {
    //   console.log('Magnet link cannot be opened.');
    // }

    Alert.alert(
      'Stream or Download confirmation',
      'You link was ready. So you can play, stream or  download...',
      [
        {
          text: 'Hide',
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'open',
          onPress: () => {
            console.log('OK Pressed');
            Linking.openURL(magnetLink);
          },
        },
      ],
    );
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={index}
      activeOpacity={1}
      onFocus={() => (
        setFocusedMenu(index), setThumbFocus(null), setFocusDownload(null)
      )}
      onPress={() => {
        selectMenu(index);
        console.log(item);
        if (item === 'English') {
          setData(eng);
          setVisibleData(eng.slice(0, 20));
          setAlbum(data[0]);
          setCurrentIndex(0);
        } else if (item === 'Telugu') {
          setData(tel);
          setVisibleData(tel.slice(0, 20));
          setAlbum(data[0]);
          setCurrentIndex(0);
        } else if (item === 'Trending') {
          setData(trend);
          setVisibleData(trend.slice(0, 20));
          setAlbum(data[0]);
          setCurrentIndex(0);
        } else {
          setVisibleData(trend);
          setAlbum(data[0]);
          setCurrentIndex(0);
        }
      }}
      style={{
        margin: 10,
        padding: focusDownload === index ? 0 : 10,
        boxSizing: 'border-box', // Include border in height and width
        backgroundColor: menu === index ? '#5cb85c' : 'white',
        borderWidth: focusMenu === index ? 3 : 0,
        borderColor: 'blue',
        marginRight: 10,
        height: 45,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        opacity: focusMenu === index ? 1 : menu === index ? 1 : 0.7,
      }}>
      <Text style={{color: menu === index ? 'white' : 'black'}}>{item}</Text>
    </TouchableOpacity>
  );

  const renderDownLoads = ({item, index}) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          right: 0,
          opacity: focusDownload === index ? 1 : 0.7,
        }}>
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          onFocus={() => (
            setFocusDownload(index), setThumbFocus(null), setFocusedMenu(null)
          )}
          //   onPress={() => selectMenu(index)}
          onPress={() => handleOpenTorentClick(album?.magLinks[index])}
          style={{}}>
          <LinearGradient
            // colors={['#4c669f', '#3b5998', '#192f6a']}
            colors={['#00cc00', '#006600']}
            style={{
              margin: 10,
              padding: focusDownload === index ? 0 : 10,
              backgroundColor: download === index ? 'lightblue' : 'white',
              borderWidth: focusDownload === index ? 3 : 0,
              borderColor: 'blue',
              marginRight: 10,
              height: 45,
              width: 400,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              boxSizing: 'border-box',
            }}>
            <Text
              style={{
                color: 'white',
              }}>
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

  const renderThums = ({item, index}) => (
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
        setThumb(index),
        setThumbFocus(index),
        setFocusDownload(null),
        setFocusedMenu(null),
        setAlbum(item)
      )}
      style={{
        borderWidth: focusThumb === index ? 3 : 0,
        borderColor: 'blue',
        margin: 5,
        height: 160,
        width: 100,
        borderRadius: 10,
        overflow: 'hidden', // Clip image to the rounded corners
      }}>
      {/* Use ImageBackground for TouchableOpacity's background */}
      <ImageBackground
        source={require('./src/vertBg.jpg')} // Use the actual image URL from your data
        style={{
          flex: 1,
          width: '100%', // Ensure the image takes the full width of the container
          resizeMode: 'cover', // Maintain the image's aspect ratio
        }}>
        <ImageBackground
          source={{
            uri:
              item.thumbnail[0] !== null &&
              item.thumbnail[0] !== '' &&
              item.thumbnail[0] !== 'default'
                ? item.thumbnail[0]
                : 'https://picsum.photos/200/300',
          }} // Use the actual image URL from your data
          style={{
            flex: 1,
            width: '100%', // Ensure the image takes the full width of the container
            resizeMode: 'cover', // Maintain the image's aspect ratio
          }}>
          <View
            style={{
              flex: 1,
              padding: 10,
              justifyContent: 'flex-end', // Adjust as needed
              backgroundColor:
                focusThumb === index
                  ? 'rgba(0,0,0, 0.5)'
                  : 'rgba(255, 255, 255, 0)',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: Platform.isTV ? 7 : 12,
                backgroundColor: Platform.isTV ? 'transparent' : 'black',
                borderRadius: 5,
                color: 'white',
                opacity: 0.8,
                // flex: 1,
                height: 20,
                margin: -10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
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

  const handleLoadMore = () => {
    const currentLength = visibleData.length;
    const nextData = data.slice(currentLength, currentLength + 20);

    setVisibleData(prevData => [...prevData, ...nextData]);
  };

  useEffect(
    () => {
      const initializeApp = async () => {
        console.log('initializing App...');
        setLogMessage(
          prevLogMessage => prevLogMessage + '\nInitializing App...',
        );

        setTrend(trendingMoviesData);
        setTel(trendingMoviesData.filter(item => item.title.includes('Tel')));
        setEng(trendingMoviesData.filter(item => item.title.includes('Eng')));

        setData(trendingMoviesData);
        setVisibleData(trendingMoviesData.slice(0, 20));

        setBackground(defImage);
        setAlbum(trendingMoviesData[0]);
        setCurrentIndex(0);
        selectMenu(0);
        setLogMessage(
          prevLogMessage => prevLogMessage + '\nApp ready.\nlaunching...',
        );
        console.log('app ready');

        // setTimeout(() => setReady(false), 200);
        setTimeout(() => {
          setReady(true);
        }, 5000);
      };

      const callTrendingAPI = async () => {
        try {
          const resp = await fetch(
            'https://sudheerneo.github.io/json_test_api/trendingMovies.json',
          );

          if (resp.ok) {
            const trendData = await resp.json();
            console.log('api called');
            setLogMessage(
              prevLogMessage => prevLogMessage + '\napi requested...',
            );
            initializeApp(trendData);
            setLogMessage(
              prevLogMessage =>
                prevLogMessage +
                '\nData stored successfully\n' +
                trendData.length +
                ' links of data gathered...',
            );
            console.log('data saved');
            console.log(trendData.length);
          } else {
            console.error('Failed to fetch data:', resp.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
        // initializeApp(trendingMoviesData); test flow with out network call
      };
      !trend &&
        (console.log('no data'),
        setLogMessage(prevLogMessage => prevLogMessage + '\nData retriving...'),
        callTrendingAPI());
    },
    [
      // trend,
      // handleLoadMore,
      // logMessage,
      // setLogMessage,
      // ImageBackground,
      // Image,
      // album,
      // background,
      // ready,
    ],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        prevIndex => (prevIndex + 1) % (album?.thumbnail?.length || 1),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [album?.thumbnail?.length]);

  if (ready) {
    return (
      <ImageBackground
        resizeMode="cover"
        source={require('./src/bgMesh.jpg')}
        style={{
          height: '100%',
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}>
        <View
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        />

        <FlatList
          horizontal
          data={Menu}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={[focusMenu, menu]}
          keyboardShouldPersistTaps="always"
        />
        {/* preview */}
        {Platform.isTV ? (
          // tv code
          <View
            style={{
              // backgroundColor: 'rgba(255, 255, 255, 0.3)',
              position: 'absolute',
              top: 70,
              bottom: 180,
              borderRadius: 15,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              flexDirection: 'row',
            }}>
            <View style={{width: '50%', padding: 10}}>
              <ImageBackground
                source={require('./src/NetBlue.png')}
                style={{
                  flex: 1,
                  resizeMode: 'contain',
                  borderRadius: 10,
                  overflow: 'hidden',
                  // opacity: 0.9,
                  borderColor: 'rgba(0, 0, 0, .1)',
                  borderWidth: 3,
                }}>
                <FastImage
                  source={{
                    uri:
                      album?.thumbnail?.length === 0
                        ? background
                        : album?.thumbnail[currentIndex] === null ||
                          album?.thumbnail[currentIndex] === 'default'
                        ? background
                        : album?.thumbnail[currentIndex] !== '' &&
                          album?.thumbnail[currentIndex],
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    flex: 1,
                    margin: -1,
                    borderRadius: 10,
                    borderColor: 'rgba(0,0,0, 0.5)',
                    borderWidth: 5,
                    padding: 10,
                    overflow: 'hidden',
                    // opacity: 0.9,
                  }}>
                  <LinearGradient
                    style={{
                      // flex: 1,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                    colors={[
                      'rgba(0,0,0,0.2)',
                      'rgba(0,0,0,0.1)',
                      'rgba(0,0,0,0)',
                    ]}
                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 1}}
                  />
                </FastImage>
              </ImageBackground>
            </View>
            <View style={{width: '50%'}}>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white',
                  opacity: 0.8,
                }}>
                {album?.title
                  .match(/^(.*?\))/)?.[1]
                  .trim()
                  .slice(0, 35) || ''}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 12,
                }}>
                <FlatList
                  data={album?.torrlinks.slice(0, 3)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderDownLoads}
                  keyboardShouldPersistTaps="always"
                />
              </View>
            </View>
          </View>
        ) : (
          // mobile code
          <View
            style={{
              // backgroundColor: 'rgba(255, 255, 255, 0.3)',
              flex: 1,
              position: 'relative',
              top: -430,
              borderRadius: 15,
            }}>
            <View style={{padding: 10}}>
              <ImageBackground
                source={require('./src/NetBlue.png')}
                style={{
                  flex: 1,
                  resizeMode: 'contain',
                  borderRadius: 10,
                  overflow: 'hidden',
                  // opacity: 0.9,
                  borderColor: 'rgba(0, 0, 0, .1)',
                  borderWidth: 3,
                }}>
                <FastImage
                  source={{
                    uri:
                      album?.thumbnail?.length === 0
                        ? background
                        : album?.thumbnail[currentIndex] === null ||
                          album?.thumbnail[currentIndex] === 'default'
                        ? background
                        : album?.thumbnail[currentIndex] !== '' &&
                          album?.thumbnail[currentIndex],
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    flex: 1,
                    margin: -1,
                    borderRadius: 10,
                    borderColor: 'rgba(0,0,0, 0.5)',
                    borderWidth: 5,
                    padding: 10,
                    overflow: 'hidden',
                    // opacity: 0.9,
                  }}>
                  <LinearGradient
                    style={{
                      // flex: 1,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                    colors={[
                      'rgba(0,0,0,0.2)',
                      'rgba(0,0,0,0.1)',
                      'rgba(0,0,0,0)',
                    ]}
                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 1}}
                  />
                </FastImage>
              </ImageBackground>
            </View>
            <View style={{}}>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white',
                  opacity: 0.8,
                  textShadowColor: 'white',
                  textShadowRadius: 2,
                }}>
                {album?.title
                  .match(/^(.*?\))/)?.[1]
                  .trim()
                  .slice(0, 35) || ''}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 12,
                }}>
                <FlatList
                  data={album?.torrlinks.slice(0, 3)}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderDownLoads}
                  keyboardShouldPersistTaps="always"
                />
              </View>
            </View>
          </View>
        )}
        {/* albums */}
        <View style={{position: 'absolute', left: 0, bottom: 0}}>
          {focusThumb !== false && (
            <Text
              style={{
                textAlign: 'center',
                margin: Platform.isTV ? 20 : 10,
                fontSize: 12,
                color: 'white',
                marginLeft: Platform.isTV ? '50%' : 0,
                opacity: 0.5,
              }}>
              Rendering {Menu[menu]} Lists : {focusThumb || 0}/
              {visibleData.length} Total :{data.length}
            </Text>
          )}

          <FlatList
            horizontal
            data={visibleData}
            renderItem={renderThums}
            keyExtractor={(item, index) => index.toString()}
            extraData={[focusThumb, thumb]}
            keyboardShouldPersistTaps="always" // <-- Add this line
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
          />
        </View>
      </ImageBackground>
    );
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 30, fontWeight: 'bold', color: 'grey'}}>
          Grabbing data from the server
        </Text>
        <Text style={{margin: 10}} numberOfLines={7}>
          {logMessage}
        </Text>
      </View>
    );
  }
};

export default App;
