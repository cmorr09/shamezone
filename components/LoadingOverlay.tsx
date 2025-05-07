import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export function LoadingOverlay() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#FF3B3B" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  spinner: {
    marginTop: 20,
  },
}); 