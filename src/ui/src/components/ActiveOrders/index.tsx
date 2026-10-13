import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { ActiveOrdersContainer } from './styles';

import { ActiveOrdersParams } from '../../types';

import { useConfig, useLanguage } from '@components';
import { OButton, SingleOrderCard } from '@ui';

export const ActiveOrders = (props: ActiveOrdersParams) => {
  const {
    onNavigationRedirect,
    orders,
    isMessageView,
    handleClickOrder,
    handleUpdateOrderList,
    pagination,
    loadMoreOrders,
    loading
  } = props;

  const theme = useTheme();
  const [{ configs }] = useConfig();
  const [, t] = useLanguage()

  return (
    <>
      <ActiveOrdersContainer isMiniCards={configs?.google_maps_api_key?.value}>
        {orders.length > 0 &&
          orders.map((order: any, index: any) => (
            <SingleOrderCard
              key={index}
              order={order}
              handleClickOrder={handleClickOrder}
              isMessageView={isMessageView}
              onNavigationRedirect={onNavigationRedirect}
              handleUpdateOrderList={handleUpdateOrderList}
            />
          ))}
        {!loading && pagination.totalPages && pagination.currentPage < pagination.totalPages && (
          <View>
            <OButton
              onClick={loadMoreOrders}
              text={t('LOAD_MORE_ORDERS', 'Load more orders')}
              imgRightSrc={null}
              style={{ borderRadius: 7.6, shadowOpacity: 0, marginTop: 20 }}
            />
          </View>
        )}
      </ActiveOrdersContainer>
      {!isMessageView && (
        <View
          style={{
            height: 8,
            backgroundColor: theme.colors.backgroundGray100,
            marginHorizontal: -40,
          }}
        />
      )}
    </>
  );
};
