import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  FlatList,
  Text,
  ImageBackground,
  Linking,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {Platform} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

import Menus from './src/Menus';
import Downloads from './src/Downloads';
import Movies from './src/Movies';
import trendingMoviesData from './src/testapi/trendingMovies.json';

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

const defImage: string =
  'https://fastly.picsum.photos/id/609/536/354.jpg?hmac=tVnz1exGJpbwT-2P8MWOvapIg7nTpSQ5SCeUHyu_7mU';

function App(): React.JSX.Element {
  const {type, isConnected} = useNetInfo();

  const [ready, setReady] = useState<boolean>(false);
  const [trend, setTrend] = useState<MovieData[]>([]);
  const [dbDate, setdbDate] = useState<string | null>('');
  const [tel, setTel] = useState<MovieData[]>([]);
  const [eng, setEng] = useState<MovieData[]>([]);
  const [logMessage, setLogMessage] = useState<string>('');

  const [data, setData] = useState<MovieData[]>([]);
  const [visibleData, setVisibleData] = useState<MovieData[]>([]);
  const [background, setBackground] = useState<string>(defImage);
  const [album, setAlbum] = useState<MovieData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | boolean>(false);

  const [focusMenu, setFocusedMenu] = useState<number | null>(null);
  const [menu, selectMenu] = useState<number>(0);

  const [focusDownload, setFocusDownload] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);

  const [focusThumb, setThumbFocus] = useState<number | null>(null);
  const [thumb, setThumb] = useState<number | null>(null);
  const [showLinks, setShowLinks] = useState<boolean>(false);

  const Menu = ['Trending', 'Telugu', 'English'];

  const handleOpenTorentClick = async (magnetLink: string) => {
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

  const handleLoadMore = () => {
    const currentLength: number = visibleData.length;
    const nextData: MovieData[] = data.slice(currentLength, currentLength + 20);

    setVisibleData(prevData => [...prevData, ...nextData]);
  };

  const renderMenu = ({item, index}: {item: string; index: number}) => (
    <Menus
      item={item}
      index={index}
      setFocusedMenu={index => setFocusedMenu(index)}
      setThumbFocus={setThumbFocus}
      setFocusDownload={setFocusDownload}
      selectMenu={index => selectMenu(index)}
      menu={menu}
      setData={setData}
      setVisibleData={setVisibleData}
      setAlbum={setAlbum}
      setCurrentIndex={setCurrentIndex}
      data={data}
      eng={eng}
      tel={tel}
      trend={trend}
      focusDownload={focusDownload}
      focusMenu={focusMenu}
    />
  );

  const renderDownLoads = ({item, index}: {item: any; index: number}) => {
    return (
      <Downloads
        item={item}
        index={index}
        focusDownload={focusDownload}
        setFocusDownload={setFocusDownload}
        setThumbFocus={setThumbFocus}
        setFocusedMenu={setFocusedMenu}
        handleOpenTorentClick={handleOpenTorentClick}
        album={album}
      />
    );
  };

  const renderMovies = ({item, index}: {item: any; index: number}) => {
    // Replace 'any' with the correct type for item
    return (
      <Movies
        item={item}
        index={index}
        setThumbFocus={setThumbFocus}
        setFocusDownload={setFocusDownload}
        setFocusedMenu={setFocusedMenu}
        setAlbum={setAlbum}
        focusThumb={focusThumb}
        setShowLinks={setShowLinks}
      />
    );
  };

  useEffect(() => {
    // console.log(isConnected);
    Platform.isTV
      ? console.log(`tv - ${isConnected}`)
      : console.log(`mobile - ${isConnected}`);

    const initializeApp = async (trendingMoviesData: MovieData[]) => {
      // setLogMessage(prevLogMessage => prevLogMessage + '\nInitializing App...');

      setTrend(trendingMoviesData);
      setTel(trendingMoviesData.filter(item => item.title.includes('Tel')));
      setEng(trendingMoviesData.filter(item => item.title.includes('Eng')));

      setData(trendingMoviesData);
      setVisibleData(trendingMoviesData.slice(0, 20));

      setBackground(defImage);
      setAlbum(trendingMoviesData[0]);
      setCurrentIndex(0);
      selectMenu(0);
      // setLogMessage(
      //   prevLogMessage => prevLogMessage + '\nApp ready.\nlaunching...',
      // );

      setTimeout(() => {
        // setReady(true);
      }, 5000);
    };

    const callTrendingAPI = async () => {
      try {
        const resp = await fetch(
          'https://sudheerneo.github.io/json_test_api/trendingMovies.json',
        );
        if (resp.ok) {
          const trendData = await resp.json();
          // setLogMessage(
          //   prevLogMessage => prevLogMessage + '\napi requested...',
          // );
          initializeApp(trendData);
          // setLogMessage(
          //   prevLogMessage =>
          //     prevLogMessage +
          //     '\nData stored successfully\n' +
          //     trendData.length +
          //     ' links of data gathered...',
          // );
        } else {
          console.error('Failed to fetch data:', resp.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }

      // initializeApp(trendingMoviesData);
    };
    if (trend.length < 1 || !trend || trend === null) {
      setLogMessage(prevLogMessage => prevLogMessage + '\nData retriving...');

      callTrendingAPI();
    }
  }, [trend]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex: number | boolean) =>
        typeof prevIndex === 'number'
          ? (prevIndex + 1) % (album?.thumbnail?.length || 1)
          : 0,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [album?.thumbnail?.length]);

  if (ready) {
    return (
      <>
        {/* tvCode */}
        {Platform.isTV ? (
          // tvCodeBlock
          <ImageBackground
            resizeMode="cover"
            source={require('./src/images/bgMesh.jpg')}
            style={styles.container}>
            <View style={styles.containerWrapper} />
            {/* //launguage selector */}
            <FlatList
              contentContainerStyle={{
                backgroundColor: 'brown',
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 60,
              }}
              horizontal
              data={Menu}
              renderItem={renderMenu}
              keyExtractor={(item, index) => index.toString()}
              // extraData={[focusMenu, menu]}
              keyboardShouldPersistTaps="always"
              disableVirtualization
            />
            {/* //tvcode preview download links area */}
            <View style={styles.tvSlideContainer}>
              <View style={styles.tvslideWrapper}>
                <ImageBackground
                  source={require('./src/images/NetBlue.png')}
                  style={styles.tvSlideBackground}>
                  <FastImage
                    source={{
                      uri:
                        album?.thumbnail?.length === 0
                          ? background
                          : typeof currentIndex === 'number' &&
                            album?.thumbnail &&
                            currentIndex >= 0 &&
                            currentIndex < album.thumbnail.length &&
                            album.thumbnail[currentIndex] !== null &&
                            album.thumbnail[currentIndex] !== 'default'
                          ? album.thumbnail[currentIndex]
                          : background,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={styles.tvSlides}>
                    <LinearGradient
                      style={styles.tvSlideGradient}
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
              <View style={styles.tvMovieNameContainer}>
                <Text style={styles.tvMovieName}>
                  {album?.title
                    .match(/^(.*?\))/)?.[1]
                    .trim()
                    .slice(0, 35) || ''}
                </Text>
                <View style={styles.tvDownloadContainer}>
                  <FlatList
                    data={album?.torrlinks.slice(0, 3)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderDownLoads}
                    keyboardShouldPersistTaps="always"
                    disableVirtualization
                  />
                </View>
              </View>
            </View>
            {/* bottom movie list renderer */}
            <View style={styles.movieStatusContainer}>
              {focusThumb !== null && (
                <Text style={styles.moviesStatus}>
                  {Menu[menu]} Lists : {focusThumb || 0}/{visibleData.length}{' '}
                  Total :{data.length},{' Db on : '}
                  {album?.updatedOn &&
                    new Date(album.updatedOn).toLocaleDateString()}
                </Text>
              )}

              <FlatList
                horizontal
                data={visibleData}
                renderItem={renderMovies}
                keyExtractor={(item, index) => index.toString()}
                extraData={[focusThumb, thumb]}
                keyboardShouldPersistTaps="always" // <-- Add this line
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                disableVirtualization
              />
            </View>
          </ImageBackground>
        ) : (
          // mobileCodeBlock
          <ImageBackground
            resizeMode="cover"
            source={require('./src/images/bgMesh.jpg')}
            style={styles.container}>
            <View style={styles.containerWrapper} />

            {/* hiding status bar */}
            <StatusBar hidden />

            <FlatList
              horizontal
              contentContainerStyle={{
                backgroundColor: 'brown',
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 70,
                paddingBottom: 8,
              }}
              data={Menu}
              renderItem={renderMenu}
              keyExtractor={(item, index) => index.toString()}
              // extraData={[focusMenu, menu]}
              keyboardShouldPersistTaps="always"
              disableVirtualization
            />

            {focusThumb !== null && (
              <Text style={styles.moviesStatus}>
                {Menu[menu]} Lists : {focusThumb || 0}/{visibleData.length}{' '}
                Total :{data.length},{' Db on : '}
                {album?.updatedOn &&
                  new Date(album.updatedOn).toLocaleDateString()}
              </Text>
            )}

            <FlatList
              numColumns={3}
              data={visibleData}
              renderItem={renderMovies}
              keyExtractor={(item, index) => index.toString()}
              extraData={[focusThumb, thumb]}
              keyboardShouldPersistTaps="always" // <-- Add this line
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              disableVirtualization
            />

            {/* preview */}
            {showLinks && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  zIndex: 1000,
                  backgroundColor: 'black',
                  flex: 1,
                }}>
                <View style={styles.slideShowPadding}>
                  <ImageBackground
                    source={require('./src/images/NetBlue.png')}
                    style={styles.slideShowBackground}>
                    <FastImage
                      source={{
                        uri:
                          album?.thumbnail?.length === 0
                            ? background
                            : typeof currentIndex === 'number' &&
                              currentIndex >= 0 &&
                              Array.isArray(album?.thumbnail) &&
                              currentIndex < album?.thumbnail.length
                            ? album?.thumbnail[currentIndex]
                            : background,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                      style={styles.slideShow}>
                      <LinearGradient
                        style={styles.downloadBtnGradient}
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
                  <Text style={styles.movieName}>
                    {album?.title
                      .match(/^(.*?\))/)?.[1]
                      .trim()
                      .slice(0, 35) || ''}
                  </Text>
                  <View style={styles.downloadsContainer}>
                    <FlatList
                      data={album?.torrlinks.slice(0, 4)}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={renderDownLoads}
                      keyboardShouldPersistTaps="always"
                      disableVirtualization
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowLinks(false)}>
                    <LinearGradient
                      colors={['red', 'brown']}
                      style={{
                        marginTop: 20,
                        margin: 10,
                        borderColor: 'blue',
                        marginRight: 10,
                        height: 45,
                        width: 400,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                      }}>
                      <Text style={{color: 'white'}}>Close</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ImageBackground>
        )}
      </>
    );
  } else {
    return (
      <ImageBackground
        resizeMode="cover"
        source={require('./src/images/splash.jpg')}
        style={styles.logContainer}>
        <Text style={styles.logHeading}>gathering content...</Text>
        <ActivityIndicator size="large" style={styles.loader} />
        {/* <Text style={styles.logMessageText} numberOfLines={7}>
          {logMessage}
        </Text> */}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    paddingTop:
      StatusBar.currentHeight !== undefined ? -StatusBar.currentHeight : 0,
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  containerWrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  /////////////////TV styles ////////////////////////////

  tvSlideContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    top: 55,
    bottom: 200,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  tvslideWrapper: {width: '50%', padding: 10},
  tvSlideBackground: {
    flex: 1,
    resizeMode: 'contain',
    borderRadius: 10,
    overflow: 'hidden',
    // opacity: 0.9,
    borderColor: 'rgba(0, 0, 0, .1)',
    borderWidth: 3,
  },
  tvSlides: {
    flex: 1,
    margin: -1,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0, 0.5)',
    borderWidth: 3,
    padding: 10,
    overflow: 'hidden',
    // opacity: 0.9,
  },
  tvSlideGradient: {
    // flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tvMovieName: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    opacity: 0.8,
  },
  tvMovieNameContainer: {width: '50%'},
  tvDownloadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  ///////////////// mobile styles ////////////////////////////
  // slideShowPadding: {padding: 10},
  slideShowPadding: {paddingVertical: '7%'},
  slideShowContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.3)',
    flex: 1,
    position: 'relative',
    top: -430,
    borderRadius: 15,
    paddingVertical: '10%',
  },
  slideShowBackground: {
    height: 400,
    resizeMode: 'contain',
    borderRadius: 10,
    overflow: 'hidden',
    // opacity: 0.9,
    borderColor: 'rgba(0, 0, 0, .1)',
    borderWidth: 3,
  },
  slideShow: {
    flex: 1,
    margin: -1,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0, 0.5)',
    borderWidth: 5,
    padding: 10,
    overflow: 'hidden',
    opacity: 0.9,
  },
  downloadBtnGradient: {
    // flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  movieName: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    opacity: 0.8,
    textShadowColor: 'white',
    textShadowRadius: 2,
  },
  downloadsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  movieStatusContainer: {position: 'absolute', left: 0, bottom: 0},
  moviesStatus: {
    textAlign: 'center',
    margin: Platform.isTV ? 2 : 10,
    fontSize: 12,
    color: 'white',
    marginLeft: Platform.isTV ? '50%' : 0,
    opacity: 0.5,
  },
  logContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  logHeading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'grey',
    marginHorizontal: 20,
    marginVertical: 30,
    marginTop: 250,
  },
  loader: {
    marginHorizontal: 20,
    textAlign: 'center',
  },
  logMessageText: {
    textAlign: 'center',
  },
});
export default App;
