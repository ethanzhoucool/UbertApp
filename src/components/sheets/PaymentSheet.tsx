import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BottomSheetModal} from '../common/BottomSheetModal';
import {paymentMethods, PaymentMethod} from '../../data/mockPayments';
import {useTrip} from '../../store/TripContext';
import {Colors} from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function PaymentSheet({visible, onClose}: Props) {
  const {state, dispatch} = useTrip();

  const handleSelect = (method: PaymentMethod) => {
    dispatch({type: 'SET_PAYMENT', payload: method});
    onClose();
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose} title="Payment" maxHeight="70%">
      <Text style={styles.intro}>Choose how you'd like to pay for this ride.</Text>

      {paymentMethods.map(method => {
        const selected = state.paymentMethod.id === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={styles.row}
            onPress={() => handleSelect(method)}
            activeOpacity={0.7}>
            <View style={[styles.iconWrap, {backgroundColor: method.iconBg}]}>
              <Icon
                name={
                  method.type === 'cash'
                    ? 'attach-money'
                    : method.type === 'apple-pay'
                      ? 'phone-iphone'
                      : 'credit-card'
                }
                size={18}
                color={Colors.white}
              />
            </View>
            <View style={styles.text}>
              <Text style={styles.label}>{method.label}</Text>
              <Text style={styles.sub}>{method.detail}</Text>
            </View>
            {selected ? (
              <Icon name="check-circle" size={22} color={Colors.black} />
            ) : (
              <View style={styles.radio} />
            )}
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.addRow} activeOpacity={0.7}>
        <View style={styles.addIcon}>
          <Icon name="add" size={18} color={Colors.black} />
        </View>
        <Text style={styles.addText}>Add payment method</Text>
      </TouchableOpacity>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECECEC',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    marginLeft: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  sub: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.gray300,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  addIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
});
