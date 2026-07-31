import React, {useEffect, useMemo, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Animated,
  Easing,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PressScale} from '../common/PressScale';
import {RideOption} from '../../data/mockRideOptions';
import {Spacing, useColors, ColorPalette} from '../../theme';

interface Props {
  option: RideOption;
  selected: boolean;
  onSelect: (option: RideOption) => void;
}

export function RideOptionCard({option, selected, onSelect}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  // Selection scale: pulses 1 -> 1.04 -> 1.02 when selected becomes true,
  // settles to 1.02; when deselected, animates back to 1.0.
  // Operates alongside the PressScale wrapper (which handles tap-down feedback).
  const selectionScale = useRef(new Animated.Value(1)).current;
  const prevSelected = useRef(selected);

  useEffect(() => {
    if (selected && !prevSelected.current) {
      // Tactile feedback on select. iOS treats Vibration.vibrate as a single
      // default haptic regardless of the duration arg; Android honors the ms.
      try {
        Vibration.vibrate(10);
      } catch {
        // Silently fail if the platform/simulator doesn't support it.
      }
      // false -> true: brief pulse settling at 1.02 (320ms total)
      Animated.sequence([
        Animated.timing(selectionScale, {
          toValue: 1.04,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(selectionScale, {
          toValue: 1.02,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!selected && prevSelected.current) {
      // true -> false: settle back to 1.0
      Animated.timing(selectionScale, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
    prevSelected.current = selected;
  }, [selected, selectionScale]);

  return (
    <Animated.View style={{transform: [{scale: selectionScale}]}}>
    <PressScale
      style={[styles.card, selected && styles.selected]}
      onPress={() => onSelect(option)}>
      <Image
        source={{uri: option.imageUrl}}
        style={styles.carImage}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{option.name}</Text>
          <View style={styles.capacityBadge}>
            <Icon name="person" size={12} color={Colors.gray500} />
            <Text style={styles.capacityText}>{option.capacity}</Text>
          </View>
        </View>
        <Text style={styles.eta}>
          Arriving in {option.eta} min
        </Text>
        <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">
          {option.description}
        </Text>
      </View>
      {selected && (
        <View style={styles.selectedCheck}>
          <Icon name="check" size={14} color={Colors.white} />
        </View>
      )}
      <View style={styles.priceContainer}>
        <Text style={[styles.price, selected && styles.priceSelected]}>{option.price}</Text>
        {option.multiplier && (
          <Text style={styles.multiplier}>{option.multiplier}</Text>
        )}
      </View>
    </PressScale>
    </Animated.View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: Spacing.base,
      borderRadius: 12,
      marginBottom: 4,
      backgroundColor: 'transparent',
    },
    selected: {
      backgroundColor: Colors.gray100,
      borderLeftWidth: 3,
      borderLeftColor: Colors.black,
      paddingLeft: Spacing.base - 3,
    },
    carImage: {
      width: 96,
      height: 64,
    },
    info: {
      flex: 1,
      minWidth: 0,
      marginLeft: Spacing.md,
      marginRight: 8,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      fontSize: 17,
      fontWeight: '700',
      color: Colors.black,
    },
    capacityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    capacityText: {
      fontSize: 12,
      color: Colors.gray500,
      marginLeft: 2,
    },
    eta: {
      fontSize: 14,
      color: Colors.gray700,
      fontWeight: '500',
      marginTop: 3,
    },
    desc: {
      fontSize: 12,
      color: Colors.gray500,
      marginTop: 1,
    },
    priceContainer: {
      alignItems: 'flex-end',
      minWidth: 60,
    },
    price: {
      fontSize: 17,
      fontWeight: '700',
      color: Colors.black,
    },
    priceSelected: {
      fontWeight: '800',
    },
    multiplier: {
      fontSize: 11,
      color: Colors.gray500,
      marginTop: 2,
    },
    selectedCheck: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
  });
