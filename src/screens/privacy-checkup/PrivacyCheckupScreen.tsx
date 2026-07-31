import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader} from '../../components/common/ScreenHeader';
import {RootStackParamList} from '../../navigation/types';
import {useColors, ColorPalette} from '../../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'PrivacyCheckup'>;
};

type Step = 'location' | 'data' | 'ads' | 'done';

const STEP_ORDER: Step[] = ['location', 'data', 'ads', 'done'];

export function PrivacyCheckupScreen({navigation}: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('location');
  const [locationMode, setLocationMode] = useState<'always' | 'while-using' | 'never'>('while-using');
  const [shareForResearch, setShareForResearch] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);

  useEffect(() => {
    console.log('[Ubert] PrivacyCheckupScreen mounted', step);
  }, [step]);

  const idx = STEP_ORDER.indexOf(step);
  const totalSteps = STEP_ORDER.length - 1; // excludes 'done'
  const progress = ((idx) / totalSteps) * 100;

  const next = () => {
    if (idx < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[idx + 1]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Quick privacy checkup" onBack={() => navigation.goBack()} />

      {step !== 'done' && (
        <View style={styles.progressWrap}>
          <Text style={styles.progressText}>
            {idx + 1} of {totalSteps}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, {width: `${Math.max(8, progress + 100 / totalSteps)}%`}]}
            />
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={{paddingBottom: insets.bottom + 120}}
        showsVerticalScrollIndicator={false}>
        {step === 'location' && (
          <StepCard
            icon="location-on"
            title="Review location settings"
            sub="Choose when Uber can access your location. We use it to match you with nearby drivers and improve ETAs.">
            {([
              {key: 'always', label: 'Always', desc: 'Most accurate pickups, including in the background.'},
              {key: 'while-using', label: 'While using app', desc: 'Best balance of privacy and accuracy. Recommended.'},
              {key: 'never', label: 'Never', desc: "You'll need to enter every address manually."},
            ] as const).map(opt => {
              const active = locationMode === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.optionRow,
                    active && styles.optionRowActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setLocationMode(opt.key)}>
                  <View style={[styles.radio, active && styles.radioOn]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                  <View style={{flex: 1, marginLeft: 12}}>
                    <Text style={styles.optionLabel}>{opt.label}</Text>
                    <Text style={styles.optionDesc}>{opt.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </StepCard>
        )}

        {step === 'data' && (
          <StepCard
            icon="folder-shared"
            title="Review data shared with partners"
            sub="Some data helps researchers improve safety and mobility. You can opt out anytime.">
            <View style={styles.toggleRow}>
              <View style={{flex: 1, marginRight: 12}}>
                <Text style={styles.toggleTitle}>Share trip data for research</Text>
                <Text style={styles.toggleDesc}>
                  Help improve safety and urban mobility studies (anonymized).
                </Text>
              </View>
              <Switch
                value={shareForResearch}
                onValueChange={setShareForResearch}
                trackColor={{false: '#E5E7EB', true: Colors.black}}
                thumbColor={Colors.white}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </StepCard>
        )}

        {step === 'ads' && (
          <StepCard
            icon="campaign"
            title="Review ad personalization"
            sub="See offers based on your trips and orders, or opt out for generic promotions only.">
            <View style={styles.toggleRow}>
              <View style={{flex: 1, marginRight: 12}}>
                <Text style={styles.toggleTitle}>Personalized ads</Text>
                <Text style={styles.toggleDesc}>
                  Tailor promos to places you go and food you like.
                </Text>
              </View>
              <Switch
                value={personalizedAds}
                onValueChange={setPersonalizedAds}
                trackColor={{false: '#E5E7EB', true: Colors.black}}
                thumbColor={Colors.white}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </StepCard>
        )}

        {step === 'done' && (
          <View style={styles.doneWrap}>
            <View style={styles.checkCircle}>
              <Icon name="check" size={48} color={Colors.white} />
            </View>
            <Text style={styles.doneTitle}>You're all set</Text>
            <Text style={styles.doneSub}>
              Your privacy preferences are saved. You can revisit Privacy &
              data settings any time.
            </Text>
            <View style={styles.summaryCard}>
              <SummaryRow label="Location" value={locationMode === 'always' ? 'Always' : locationMode === 'while-using' ? 'While using' : 'Never'} />
              <SummaryRow label="Research data" value={shareForResearch ? 'Shared' : 'Not shared'} />
              <SummaryRow label="Personalized ads" value={personalizedAds ? 'On' : 'Off'} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        {step !== 'done' ? (
          <TouchableOpacity
            style={styles.nextBtn}
            activeOpacity={0.85}
            onPress={next}>
            <Text style={styles.nextBtnText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextBtn}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}>
            <Text style={styles.nextBtnText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function StepCard({
  icon,
  title,
  sub,
  children,
}: {
  icon: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepIcon}>
        <Icon name={icon} size={28} color={Colors.white} />
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepSub}>{sub}</Text>
      <View style={{marginTop: 14}}>{children}</View>
    </View>
  );
}

function SummaryRow({label, value}: {label: string; value: string}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const makeStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.white},
    progressWrap: {paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8},
    progressBar: {
      height: 6,
      backgroundColor: Colors.surfaceMuted,
      borderRadius: 3,
      overflow: 'hidden',
      marginTop: 6,
    },
    progressFill: {
      height: 6,
      backgroundColor: Colors.black,
      borderRadius: 3,
    },
    progressText: {fontSize: 12, color: '#6B6B6B', fontWeight: '700', letterSpacing: 0.4},
    stepCard: {paddingHorizontal: 20, paddingTop: 16},
    stepIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: Colors.black,
      letterSpacing: -0.3,
      marginTop: 16,
    },
    stepSub: {fontSize: 15, color: '#444', marginTop: 8, lineHeight: 22},
    optionRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      marginTop: 10,
    },
    optionRowActive: {borderColor: Colors.black, backgroundColor: '#FAFAFA'},
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: '#C0C0C0',
      marginTop: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: {borderColor: Colors.black},
    radioDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: Colors.black,
    },
    optionLabel: {fontSize: 15, fontWeight: '700', color: Colors.black},
    optionDesc: {fontSize: 13, color: '#6B6B6B', marginTop: 4, lineHeight: 18},
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 12,
      backgroundColor: '#F6F6F6',
    },
    toggleTitle: {fontSize: 15, fontWeight: '700', color: Colors.black},
    toggleDesc: {fontSize: 13, color: '#6B6B6B', marginTop: 4, lineHeight: 18},
    doneWrap: {alignItems: 'center', padding: 32},
    checkCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: '#05944F',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    doneTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: Colors.black,
      marginTop: 24,
      letterSpacing: -0.3,
    },
    doneSub: {
      fontSize: 15,
      color: '#444',
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 22,
    },
    summaryCard: {
      width: '100%',
      marginTop: 24,
      backgroundColor: '#F6F6F6',
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E7EB',
    },
    summaryLabel: {fontSize: 14, color: '#6B6B6B'},
    summaryValue: {fontSize: 14, fontWeight: '700', color: Colors.black},
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 10,
      backgroundColor: Colors.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#E5E7EB',
    },
    nextBtn: {
      backgroundColor: Colors.black,
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
    },
    nextBtnText: {color: Colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.2},
  });
