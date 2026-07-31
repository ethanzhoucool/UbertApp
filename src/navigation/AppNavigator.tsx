import React from 'react';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import {RootStackParamList} from './types';
import {SplashScreen} from '../screens/SplashScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {SearchScreen} from '../screens/SearchScreen';
import {RideSelectionScreen} from '../screens/RideSelectionScreen';
import {FindingDriverScreen} from '../screens/FindingDriverScreen';
import {DriverMatchedScreen} from '../screens/DriverMatchedScreen';
import {TripInProgressScreen} from '../screens/TripInProgressScreen';
import {TripCompleteScreen} from '../screens/TripCompleteScreen';

// Delivery
import {DeliveryBrowseScreen} from '../screens/delivery/DeliveryBrowseScreen';
import {RestaurantDetailScreen} from '../screens/delivery/RestaurantDetailScreen';
import {RestaurantItemDetailScreen} from '../screens/delivery/RestaurantItemDetailScreen';
import {DeliveryCartScreen} from '../screens/delivery/DeliveryCartScreen';
import {DeliveryCheckoutScreen} from '../screens/delivery/DeliveryCheckoutScreen';
import {DeliveryTrackingScreen} from '../screens/delivery/DeliveryTrackingScreen';

// Package
import {PackageDetailsScreen} from '../screens/package/PackageDetailsScreen';
import {PackageSenderScreen} from '../screens/package/PackageSenderScreen';
import {PackageRecipientScreen} from '../screens/package/PackageRecipientScreen';
import {PackageConfirmScreen} from '../screens/package/PackageConfirmScreen';
import {PackageTrackingScreen} from '../screens/package/PackageTrackingScreen';

// Generic
import {ComingSoonScreen} from '../screens/ComingSoonScreen';

// Reserve
import {ReserveScheduleScreen} from '../screens/reserve/ReserveScheduleScreen';
import {ReserveRideTypeScreen} from '../screens/reserve/ReserveRideTypeScreen';
import {ReserveConfirmScreen} from '../screens/reserve/ReserveConfirmScreen';

// Rent
import {RentBrowseCarsScreen} from '../screens/rent/RentBrowseCarsScreen';
import {RentDetailsScreen} from '../screens/rent/RentDetailsScreen';
import {RentConfirmScreen} from '../screens/rent/RentConfirmScreen';

// Account / settings
import {EditProfileScreen} from '../screens/account/EditProfileScreen';
import {SettingsScreen} from '../screens/account/SettingsScreen';
import {NotificationsSettingsScreen} from '../screens/account/NotificationsSettingsScreen';
import {PrivacySettingsScreen} from '../screens/account/PrivacySettingsScreen';
import {LanguageSettingsScreen} from '../screens/account/LanguageSettingsScreen';
import {HelpScreen} from '../screens/account/HelpScreen';
import {HelpContactScreen} from '../screens/account/HelpContactScreen';
import {PromotionsScreen} from '../screens/account/PromotionsScreen';

// Payment
import {AddPaymentMethodScreen} from '../screens/payment/AddPaymentMethodScreen';
import {WalletScreen} from '../screens/payment/WalletScreen';

// Shops
import {ShopsBrowseScreen} from '../screens/shops/ShopsBrowseScreen';
import {StoreDetailScreen} from '../screens/shops/StoreDetailScreen';
import {AislesScreen} from '../screens/shops/AislesScreen';
import {ProductDetailScreen} from '../screens/shops/ProductDetailScreen';
import {ShopsCartScreen} from '../screens/shops/ShopsCartScreen';

// Safety
import {SafetyHubScreen} from '../screens/safety/SafetyHubScreen';
import {RideCheckScreen} from '../screens/safety/RideCheckScreen';
import {TrustedContactsScreen} from '../screens/safety/TrustedContactsScreen';
import {PinVerificationScreen} from '../screens/safety/PinVerificationScreen';
import {ShareTripSafetyScreen} from '../screens/safety/ShareTripSafetyScreen';

// Uber One
import {UberOneLandingScreen} from '../screens/uber-one/UberOneLandingScreen';
import {UberOneBenefitsScreen} from '../screens/uber-one/UberOneBenefitsScreen';
import {UberOnePaymentScreen} from '../screens/uber-one/UberOnePaymentScreen';
import {UberOneSuccessScreen} from '../screens/uber-one/UberOneSuccessScreen';

// Saved places
import {SavedPlacesScreen} from '../screens/saved-places/SavedPlacesScreen';
import {AddSavedPlaceScreen} from '../screens/saved-places/AddSavedPlaceScreen';
import {EditSavedPlaceScreen} from '../screens/saved-places/EditSavedPlaceScreen';

// Activity (full screen)
import {ActivityScreen} from '../screens/activity/ActivityScreen';
import {TripDetailScreen} from '../screens/activity/TripDetailScreen';

// Help AI chat
import {HelpAiChatScreen} from '../screens/help-ai/HelpAiChatScreen';

// Airline picker
import {AirlinePickerScreen} from '../screens/airline/AirlinePickerScreen';

// Trip receipt
import {TripReceiptScreen} from '../screens/trip-receipt/TripReceiptScreen';

// Privacy checkup
import {PrivacyCheckupScreen} from '../screens/privacy-checkup/PrivacyCheckupScreen';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen name="RideSelection" component={RideSelectionScreen} />
      <Stack.Screen
        name="FindingDriver"
        component={FindingDriverScreen}
        options={{
          gestureEnabled: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      <Stack.Screen
        name="DriverMatched"
        component={DriverMatchedScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="TripInProgress"
        component={TripInProgressScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="TripComplete"
        component={TripCompleteScreen}
        options={{gestureEnabled: false}}
      />

      {/* Delivery */}
      <Stack.Screen name="DeliveryBrowse" component={DeliveryBrowseScreen} />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
      />
      <Stack.Screen
        name="RestaurantItemDetail"
        component={RestaurantItemDetailScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen name="DeliveryCart" component={DeliveryCartScreen} />
      <Stack.Screen
        name="DeliveryCheckout"
        component={DeliveryCheckoutScreen}
      />
      <Stack.Screen
        name="DeliveryTracking"
        component={DeliveryTrackingScreen}
        options={{gestureEnabled: false}}
      />

      {/* Package */}
      <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
      <Stack.Screen name="PackageSender" component={PackageSenderScreen} />
      <Stack.Screen
        name="PackageRecipient"
        component={PackageRecipientScreen}
      />
      <Stack.Screen name="PackageConfirm" component={PackageConfirmScreen} />
      <Stack.Screen
        name="PackageTracking"
        component={PackageTrackingScreen}
        options={{gestureEnabled: false}}
      />

      {/* Reserve */}
      <Stack.Screen name="ReserveSchedule" component={ReserveScheduleScreen} />
      <Stack.Screen name="ReserveRideType" component={ReserveRideTypeScreen} />
      <Stack.Screen name="ReserveConfirm" component={ReserveConfirmScreen} />

      {/* Rent */}
      <Stack.Screen name="RentBrowseCars" component={RentBrowseCarsScreen} />
      <Stack.Screen name="RentDetails" component={RentDetailsScreen} />
      <Stack.Screen name="RentConfirm" component={RentConfirmScreen} />

      {/* Account */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="NotificationsSettings"
        component={NotificationsSettingsScreen}
      />
      <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettingsScreen}
      />
      <Stack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
      />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="HelpContact" component={HelpContactScreen} />
      <Stack.Screen name="Promotions" component={PromotionsScreen} />

      {/* Payment */}
      <Stack.Screen
        name="AddPaymentMethod"
        component={AddPaymentMethodScreen}
      />
      <Stack.Screen name="Wallet" component={WalletScreen} />

      {/* Shops */}
      <Stack.Screen name="ShopsBrowse" component={ShopsBrowseScreen} />
      <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
      <Stack.Screen name="Aisles" component={AislesScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="ShopsCart" component={ShopsCartScreen} />

      {/* Safety */}
      <Stack.Screen name="SafetyHub" component={SafetyHubScreen} />
      <Stack.Screen name="RideCheck" component={RideCheckScreen} />
      <Stack.Screen name="TrustedContacts" component={TrustedContactsScreen} />
      <Stack.Screen name="PinVerification" component={PinVerificationScreen} />
      <Stack.Screen name="ShareTripSafety" component={ShareTripSafetyScreen} />

      {/* Uber One */}
      <Stack.Screen
        name="UberOneLanding"
        component={UberOneLandingScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen name="UberOneBenefits" component={UberOneBenefitsScreen} />
      <Stack.Screen name="UberOnePayment" component={UberOnePaymentScreen} />
      <Stack.Screen
        name="UberOneSuccess"
        component={UberOneSuccessScreen}
        options={{gestureEnabled: false}}
      />

      {/* Saved places */}
      <Stack.Screen name="SavedPlaces" component={SavedPlacesScreen} />
      <Stack.Screen name="AddSavedPlace" component={AddSavedPlaceScreen} />
      <Stack.Screen name="EditSavedPlace" component={EditSavedPlaceScreen} />

      {/* Activity (full screen) */}
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />

      {/* Help AI chat */}
      <Stack.Screen name="HelpAiChat" component={HelpAiChatScreen} />

      {/* Airline picker */}
      <Stack.Screen name="AirlinePicker" component={AirlinePickerScreen} />

      {/* Trip receipt */}
      <Stack.Screen name="TripReceipt" component={TripReceiptScreen} />

      {/* Privacy checkup */}
      <Stack.Screen name="PrivacyCheckup" component={PrivacyCheckupScreen} />

      {/* Generic coming-soon placeholder */}
      <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
    </Stack.Navigator>
  );
}
