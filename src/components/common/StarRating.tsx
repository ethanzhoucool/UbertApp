import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../theme';

interface Props {
  rating: number;
  onRate?: (star: number) => void;
  size?: number;
  interactive?: boolean;
}

export function StarRating({
  rating,
  onRate,
  size = 36,
  interactive = false,
}: Props) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => interactive && onRate?.(star)}
          disabled={!interactive}
          activeOpacity={interactive ? 0.7 : 1}>
          <Icon
            name={star <= rating ? 'star' : 'star-border'}
            size={size}
            color={star <= rating ? Colors.starYellow : Colors.gray300}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    marginHorizontal: 4,
  },
});
