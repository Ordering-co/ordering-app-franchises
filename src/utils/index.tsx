import { initStripe, useConfirmPayment } from "@stripe/stripe-react-native";
import { Linking } from "react-native";
import { ToastType, useLanguage, useOrder, useSession, useToast } from "@components";

export const checkoutPaymentUtilities = () => {
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const [orderState, { confirmCart, changeMoment }] = useOrder();
  const [{ user }] = useSession()
  const { confirmPayment } = useConfirmPayment();

  const handleOrderRedirect = ({ orderId, navigation }: any) => {
    if (orderState?.options?.moment) {
      changeMoment(null);
    }
    navigation.replace('OrderDetails', {
      orderId,
      isFromCheckout: true,
    });
  };

  const handleStripePayment = async ({ data, paymethod, cart, handleIsRedirect, navigation }: any) => {
    const clientSecret = cart?.paymethod_data?.result?.client_secret;
    const paymentMethodId = getPaymentMethodId(paymethod, cart);
    const stripeAccountId = paymethod?.paymethod?.credentials?.user;
    const publicKey = paymethod.paymethod?.credentials?.publishable || paymethod?.paymethod?.credentials?.publishable_key;

    try {
      initStripe(getStripeParams(publicKey, stripeAccountId));
    } catch (error: any) {
      showToast(ToastType.Error, error?.toString() || error.message);
      return;
    }

    try {
      const paymentIntent = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          paymentMethodId,
          billingDetails: {
            email: user?.email,
            ...data
          },
        },
      });

      if (paymentIntent.error) {
        showToast(ToastType.Error, paymentIntent.error.message);
        return;
      }

      handleIsRedirect && handleIsRedirect(true);
      await confirmAndRedirect({ cart, navigation });
    } catch (error: any) {
      handlePaymentError(error);
    }
  };

  const getPaymentMethodId = (paymethod: any, cart: any) => {
    return paymethod?.gateway === 'stripe_connect'
      ? cart.paymethod_data?.result?.payment_method_id
      : cart.paymethod_data?.data?.source_id;
  };

  const getStripeParams = (publicKey: string, stripeAccountId: string | undefined) => {
    return stripeAccountId
      ? { publishableKey: publicKey, stripeAccountId }
      : { publishableKey: publicKey };
  };

  const confirmAndRedirect = async ({ cart, navigation }: any) => {
    try {
      const confirmCartRes = await confirmCart(cart?.uuid);
      if (confirmCartRes.error) {
        showToast(ToastType.Error, confirmCartRes.error.message);
        return;
      }
      if (confirmCartRes.result.order?.uuid) {
        navigation.replace('OrderDetails', {
          orderId: confirmCartRes.result.order.uuid,
          isFromCheckout: true,
        });
      }
    } catch (error: any) {
      showToast(ToastType.Error, error?.toString() || error.message);
    }
  };

  const handlePaymentError = (error: any) => {
    const errorMessage = error?.message?.toLowerCase() === 'failed'
      ? t('FAILED_PAYMENT', 'The payment has failed')
      : error?.toString() || error.message;
    showToast(ToastType.Error, errorMessage);
  };


  const handleRedirectPaymentCheckout = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      showToast(ToastType.Error, t('VALIDATION_ERROR_ACTIVE_URL', 'The _attribute_ is not a valid URL.').replace('_attribute_', t('URL', 'URL')));
    }
  };

  return {
    handleOrderRedirect,
    handleStripePayment,
    handleRedirectPaymentCheckout
  }
}
