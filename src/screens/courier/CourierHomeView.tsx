import React, {useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useColors, ColorPalette} from '../../theme';

interface Props {
  onSend: () => void;
  onReceive: () => void;
  onHistory: () => void;
}

export function CourierHomeView({onSend, onReceive, onHistory}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  useEffect(() => {
    console.log('[Ubert] CourierHomeView mounted');
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Uber Connect brand lockup */}
      <View style={styles.lockupRow}>
        <View style={styles.lockupIcon}>
          <Icon name="local-shipping" size={22} color={Colors.white} />
        </View>
        <View style={{flex: 1, marginLeft: 12}}>
          <View style={styles.brandRow}>
            <Text style={styles.brandWord}>Uber</Text>
            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>Connect</Text>
            </View>
          </View>
          <Text style={styles.brandSub}>
            Same-day courier. Pickup in 15 minutes or less.
          </Text>
        </View>
      </View>

      {/* Two large tappable hero cards */}
      <View style={styles.heroRow}>
        <TouchableOpacity
          style={styles.heroCard}
          activeOpacity={0.85}
          onPress={onSend}>
          <View style={styles.heroIconWrap}>
            <Icon name="upload" size={26} color={Colors.white} />
          </View>
          <Text style={styles.heroTitle}>Send a package</Text>
          <Text style={styles.heroSub}>
            From you to someone, in one trip.
          </Text>
          <View style={styles.heroChev}>
            <Icon name="chevron-right" size={20} color={Colors.white} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.heroCard, styles.heroCardLight]}
          activeOpacity={0.85}
          onPress={onReceive}>
          <View style={[styles.heroIconWrap, styles.heroIconWrapLight]}>
            <Icon name="download" size={26} color={Colors.black} />
          </View>
          <Text style={[styles.heroTitle, {color: Colors.black}]}>
            Receive a package
          </Text>
          <Text style={[styles.heroSub, {color: '#444'}]}>
            Have someone bring it to you.
          </Text>
          <View style={styles.heroChev}>
            <Icon name="chevron-right" size={20} color={Colors.black} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent deliveries — empty state */}
      <Text style={styles.sectionTitle}>Recent deliveries</Text>
      <TouchableOpacity
        style={styles.emptyCard}
        activeOpacity={0.7}
        onPress={onHistory}>
        <View style={styles.emptyIconWrap}>
          <Icon name="inventory-2" size={26} color="#6B6B6B" />
        </View>
        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={styles.emptyTitle}>No deliveries yet</Text>
          <Text style={styles.emptySub}>
            Once you send a package, it'll show up here.
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color="#6B6B6B" />
      </TouchableOpacity>

      <View style={styles.faqWrap}>
        <Text style={styles.faqTitle}>How Connect works</Text>
        <FaqRow
          n={1}
          title="Set up your package"
          desc="Choose size, add a quick description and special instructions."
        />
        <FaqRow
          n={2}
          title="Add sender and recipient"
          desc="We'll text both of them tracking links automatically."
        />
        <FaqRow
          n={3}
          title="Track in real time"
          desc="See your courier's location until they hand it off."
        />
      </View>
    </ScrollView>
  );
}

function FaqRow({n, title, desc}: {n: number; title: string; desc: string}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.faqRow}>
      <View style={styles.faqNum}>
        <Text style={styles.faqNumText}>{n}</Text>
      </View>
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={styles.faqRowTitle}>{title}</Text>
        <Text style={styles.faqRowDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    lockupRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 14,
    },
    lockupIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
    brandWord: {
      fontSize: 22,
      fontWeight: '900',
      color: Colors.black,
      letterSpacing: -0.5,
    },
    brandPill: {
      backgroundColor: Colors.black,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    brandPillText: {
      color: Colors.white,
      fontWeight: '900',
      fontSize: 14,
      letterSpacing: 0.4,
    },
    brandSub: {fontSize: 13, color: '#6B6B6B', marginTop: 4, lineHeight: 18},
    heroRow: {paddingHorizontal: 16, marginTop: 20, gap: 12},
    heroCard: {
      backgroundColor: Colors.black,
      borderRadius: 16,
      padding: 18,
      minHeight: 130,
      justifyContent: 'space-between',
    },
    heroCardLight: {backgroundColor: Colors.surfaceMuted},
    heroIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroIconWrapLight: {backgroundColor: 'rgba(0,0,0,0.06)'},
    heroTitle: {
      color: Colors.white,
      fontSize: 19,
      fontWeight: '800',
      marginTop: 12,
      letterSpacing: -0.2,
    },
    heroSub: {
      color: 'rgba(255,255,255,0.78)',
      fontSize: 13,
      marginTop: 2,
      lineHeight: 18,
    },
    heroChev: {position: 'absolute', right: 16, top: 16},
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: Colors.black,
      marginHorizontal: 16,
      marginTop: 24,
      marginBottom: 10,
      letterSpacing: -0.2,
    },
    emptyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      padding: 14,
      borderRadius: 14,
      backgroundColor: '#F6F6F6',
    },
    emptyIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {fontSize: 15, fontWeight: '700', color: Colors.black},
    emptySub: {fontSize: 13, color: '#6B6B6B', marginTop: 2, lineHeight: 18},
    faqWrap: {paddingHorizontal: 16, marginTop: 24, marginBottom: 12},
    faqTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: Colors.black,
      marginBottom: 8,
      letterSpacing: -0.2,
    },
    faqRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 10,
    },
    faqNum: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    faqNumText: {color: Colors.white, fontWeight: '800', fontSize: 13},
    faqRowTitle: {fontSize: 15, fontWeight: '700', color: Colors.black},
    faqRowDesc: {fontSize: 13, color: '#6B6B6B', marginTop: 4, lineHeight: 18},
  });
