export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'apple-pay' | 'cash';
  label: string;
  detail: string;
  iconBg: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'visa-4242',
    type: 'visa',
    label: 'Visa',
    detail: '•••• 4242',
    iconBg: '#1A56DB',
  },
  {
    id: 'mc-8821',
    type: 'mastercard',
    label: 'Mastercard',
    detail: '•••• 8821',
    iconBg: '#EB001B',
  },
  {
    id: 'apple-pay',
    type: 'apple-pay',
    label: 'Apple Pay',
    detail: 'Default device wallet',
    iconBg: '#000000',
  },
  {
    id: 'cash',
    type: 'cash',
    label: 'Cash',
    detail: 'Pay driver in person',
    iconBg: '#05944F',
  },
];

export const defaultPaymentMethod = paymentMethods[0];
