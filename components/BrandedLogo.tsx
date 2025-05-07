import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface BrandedLogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export function BrandedLogo({ size = 'medium', style }: BrandedLogoProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 100, height: 30 };
      case 'large':
        return { width: 200, height: 60 };
      default:
        return { width: 150, height: 45 };
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../assets/images/app-name.png')}
        style={[styles.image, getSize()]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 45,
  },
}); 