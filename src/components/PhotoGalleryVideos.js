/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { createThumbnail } from 'react-native-create-thumbnail';
import ImageView from 'react-native-image-viewing';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveHeight } from '../utils/helperFunctions';
import colors from '../assets/colors';
import { ShowToast } from '../GlobalFunctions';

const PhotoGalleryVideos = ({ gallery = [] }) => {
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState({});
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  // Generate thumbnails for videos
  useEffect(() => {
    gallery.forEach(item => {
      const url = String(item || '');
      const isVideo = /\.(mp4|mov|m4v|webm|ogg|mpeg)$/i.test(url);
      if (isVideo && !thumbnails[url]) {
        createThumbnail({ url })
          .then(response => {
            setThumbnails(prev => ({ ...prev, [url]: response.path }));
          })
          .catch(err => {
            console.log('Thumbnail generation failed for', url, err);
          });
      }
    });
  }, [gallery]);

  // Create image items for image viewer
  const imageItems = useMemo(() => {
    const imgs = gallery.filter(u =>
      /\.(jpe?g|png|gif|webp|jpeg)$/i.test(String(u || '')),
    );
    return imgs.map(u => ({ uri: String(u) }));
  }, [gallery]);

  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: responsiveHeight(1) }}
        data={gallery.filter(Boolean)}
        keyExtractor={(item, index) => String(index) + '-' + String(item)}
        renderItem={({ item }) => {
          const url = String(item || '');
          const isVideo = /\.(mp4|mov|m4v|webm|ogg|mpeg)$/i.test(url);
          if (isVideo) {
            const thumb = thumbnails[url];
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedVideo(url);
                  setVideoLoading(true);
                  setVideoModalVisible(true);
                }}
                style={{ marginRight: responsiveHeight(1) }}
              >
                {thumb ? (
                  <FastImage 
                    source={{ uri: thumb, priority: FastImage.priority.normal }} 
                    style={styles.photoThumb} 
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View
                    style={[styles.photoThumb, { backgroundColor: '#000' }]}
                  />
                )}
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  pointerEvents="none"
                >
                  <Ionicons name="play-circle" color={colors.white} size={36} />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              onPress={() => {
                const idx = imageItems.findIndex(i => i.uri === url);
                setImageViewerIndex(idx >= 0 ? idx : 0);
                setImageViewerVisible(true);
              }}
            >
              <FastImage 
                source={{ uri: url, priority: FastImage.priority.normal }} 
                style={styles.photoThumb} 
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          );
        }}
      />

      <Modal
        visible={videoModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: colors.black }}>
          <TouchableOpacity
            onPress={() => setVideoModalVisible(false)}
            style={{
              position: 'absolute',
              top: responsiveHeight(5),
              right: responsiveHeight(5),
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: responsiveHeight(1),
              borderRadius: responsiveHeight(3),
            }}
          >
            <Ionicons name="close" color={colors.white} size={30} />
          </TouchableOpacity>

          {selectedVideo && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {videoLoading && (
                <ActivityIndicator
                  size="large"
                  color={colors.white}
                  style={{ position: 'absolute', zIndex: 5 }}
                />
              )}
              <Video
                source={{ uri: selectedVideo }}
                style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                }}
                controls
                resizeMode="contain"
                paused={false}
                repeat={false}
                playWhenInactive={false}
                playInBackground={false}
                ignoreSilentSwitch="ignore"
                progressUpdateInterval={250}
                maxBitRate={2000000}
                bufferConfig={{
                  minBufferMs: 2000,
                  maxBufferMs: 10000,
                  bufferForPlaybackMs: 1500,
                  bufferForPlaybackAfterRebufferMs: 2000,
                }}
                onLoad={() => {
                  console.log('Video loaded:', selectedVideo);
                  setVideoLoading(false);
                }}
                onEnd={() => setVideoModalVisible(false)}
                onError={err => {
                  console.log('Video playback error:', err);
                  setVideoLoading(false);
                  ShowToast(
                    'error',
                    'Video playback failed — opening external player',
                  );
                  if (selectedVideo) {
                    Linking.openURL(selectedVideo).catch(e => {
                      console.log('Failed to open external player', e);
                      ShowToast('error', 'Could not open external player');
                    });
                  }
                }}
                onBuffer={buf => {
                  console.log('Video buffering:', buf);
                }}
                onLoadStart={() => {
                  console.log('Video load started for', selectedVideo);
                  setVideoLoading(true);
                }}
              />
            </View>
          )}
        </View>
      </Modal>

      <ImageView
        images={imageItems}
        imageIndex={imageViewerIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  photoThumb: {
    width: responsiveHeight(14),
    height: responsiveHeight(12),
    borderRadius: responsiveHeight(1.5),
  },
});

export default PhotoGalleryVideos;
