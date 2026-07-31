import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColors, ColorPalette} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string | number;
  scrollable?: boolean;
  showHandle?: boolean;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function BottomSheetModal({
  visible,
  onClose,
  title,
  children,
  maxHeight,
  scrollable = true,
  showHandle = true,
}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  // When a maxHeight is supplied, force the sheet to grow to that height
  // (otherwise the sheet hugs its content). When omitted, fall back to
  // auto-fit-to-content.
  const heightStyle = maxHeight !== undefined
    ? {height: maxHeight as any, maxHeight: maxHeight as any}
    : null;
  // 0 = open (resting), SCREEN_HEIGHT = fully off-screen
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);
  const sheetHeightRef = useRef(SCREEN_HEIGHT);

  // Animate in when visible toggles true; animate out + unmount when false.
  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 80,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMounted(false);
      });
    }
  }, [visible, mounted, translateY, backdropOpacity]);

  const requestClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  // PanResponder for drag-to-dismiss on the handle/header drag area.
  // Only claims the gesture once a clear vertical drag is detected, so taps
  // on the close button still pass through to the underlying TouchableOpacity.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const sheetHeight = sheetHeightRef.current;
        const distanceThreshold = sheetHeight * 0.3;
        const velocityThreshold = 0.6;
        if (gesture.dy > distanceThreshold || gesture.vy > velocityThreshold) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 200,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 0,
              duration: 180,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]).start(() => {
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            tension: 80,
            friction: 11,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!mounted) {
    return null;
  }

  const hasCloseButton = !!title;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={requestClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={requestClose}>
          <Animated.View style={[styles.backdrop, {opacity: backdropOpacity}]} />
        </TouchableWithoutFeedback>

        <Animated.View
          onLayout={e => {
            sheetHeightRef.current = e.nativeEvent.layout.height;
          }}
          style={[
            styles.sheet,
            // @ts-ignore - RN supports string percentages here
            heightStyle,
            {paddingBottom: insets.bottom + 16},
            {transform: [{translateY}]},
          ]}>
          {/* Drag area covers the handle + header for intuitive grip */}
          <View {...panResponder.panHandlers}>
            {showHandle && <View style={styles.handle} />}

            {title && (
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {hasCloseButton && (
                  <TouchableOpacity
                    onPress={requestClose}
                    style={styles.closeBtn}
                    hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
                    <Icon name="close" size={20} color={Colors.black} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {scrollable ? (
            <ScrollView
              style={maxHeight !== undefined ? styles.scrollFill : undefined}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}>
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.content, maxHeight !== undefined && styles.scrollFill]}>{children}</View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: Colors.modalBackdrop,
    },
    sheet: {
      backgroundColor: Colors.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 8,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 24,
      shadowOffset: {width: 0, height: -8},
      elevation: 16,
    },
    handle: {
      width: 40,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: Colors.handleColor,
      alignSelf: 'center',
      marginTop: 8,
      marginBottom: 14,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 16,
      position: 'relative',
    },
    title: {
      flex: 1,
      fontSize: 22,
      fontWeight: '800',
      letterSpacing: -0.3,
      color: Colors.black,
    },
    closeBtn: {
      position: 'absolute',
      top: 12,
      right: 16,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: Colors.closeBtnBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 4,
      flexGrow: 1,
    },
    scrollFill: {
      flex: 1,
    },
  });
