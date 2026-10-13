import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import BottomNavigator from '../navigators/BottomNavigator';
import AddressList from '../pages/AddressList';
import AddressForm from '../pages/AddressForm';
import OrderDetails from '../pages/OrderDetails';
import ProductDetails from '../pages/ProductDetails';
import UpsellingPage from '../pages/UpsellingPage';
import ReviewOrder from '../pages/ReviewOrder';
import ReviewProducts from '../pages/ReviewProducts';
import ReviewDriver from '../pages/ReviewDriver';
import MomentOption from '../pages/MomentOption';
import PaymentDetails from '../pages/PaymentDetails';
import Help from '../pages/Help';
import HelpOptions from '../pages/HelpOptions';
import BusinessPreorder from '../pages/BusinessPreorder';
import RewardsTransactions from '../pages/RewardsTransactions';
import RedeemGiftCard from '../pages/RedeemGiftCard';
import PurchaseGiftCard from '../pages/PurchaseGiftCard';
import BusinessInfo from '../pages/BusinessInfo';
import BusinessReviews from '../pages/BusinessReviews';
import CheckGuest from '../pages/CheckGuest';
import Messages from '../pages/Messages'
import MessageView from '../pages/MessageView'
import Favorite from '../pages/Favorite';
import Sessions from '../pages/Sessions';
import MyOrders from '../pages/MyOrders';
import CheckoutPage from '../pages/Checkout';
import PaymentOptions from '../pages/PaymentOptions';
import ProfileForm from '../pages/ProfileForm';
import CouponOffers from '../pages/CouponOffers';

import { getHomeDeepLinkNavigateCall } from './getHomeDeepLinkPlan';

const Stack = createStackNavigator();

const HomeNavigator = (e: any) => {
  const { navigation, route } = e
  const orderIdParam = route?.params?.orderIdParam
  const cartUuidParam = route?.params?.cartUuidParam
  const storeParam = route?.params?.storeParam
  const productParam = route?.params?.productParam
  const productId = productParam?.productId
  const categoryId = productParam?.categoryId
  const businessId = productParam?.businessId

  React.useEffect(() => {
    const call = getHomeDeepLinkNavigateCall({
      orderIdParam,
      cartUuidParam,
      storeParam,
      productParam
    })
    if (!call) return
    navigation.navigate(call.name, call.params)
  }, [orderIdParam, cartUuidParam, storeParam, productId, categoryId, businessId, navigation])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTab"
        component={BottomNavigator}
        options={{ headerShown: false }}
        initialParams={{ notification_state: e?.route?.params?.notification_state }}
      />
      <Stack.Screen
        name="AddressList"
        component={AddressList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressForm"
        component={AddressForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favorite"
        component={Favorite}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sessions"
        component={Sessions}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Help"
        component={Help}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HelpOptions"
        component={HelpOptions}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MessageView"
        component={MessageView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyOrders"
        component={MyOrders}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileForm"
        component={ProfileForm}
        options={{ headerShown: false }}
        initialParams={{ afterSignup: false }}
      />
      <Stack.Screen
        name="UpsellingPage"
        component={UpsellingPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CheckoutPage"
        component={CheckoutPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouponOffers"
        component={CouponOffers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MomentOption"
        component={MomentOption}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentOptions"
        component={PaymentOptions}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentDetails"
        component={PaymentDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewOrder"
        component={ReviewOrder}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewProducts"
        component={ReviewProducts}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewDriver"
        component={ReviewDriver}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BusinessPreorder"
        component={BusinessPreorder}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RewardsTransactions"
        component={RewardsTransactions}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RewardsPurchaseGiftCard"
        component={PurchaseGiftCard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RewardsRedeemGiftCard"
        component={RedeemGiftCard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BusinessInfo"
        component={BusinessInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BusinessReviews"
        component={BusinessReviews}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CheckGuest"
        component={CheckGuest}
        options={{ headerShown: false }}
        initialParams={{ notification_state: e?.route?.params?.notification_state }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
