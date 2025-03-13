import { FC, useEffect } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { TOrder } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderHistory,
  getOrderHistoryLoading,
  fetchOrderHistory
} from '../../services/slices/order-history';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrderHistory);
  const isLoading = useSelector(getOrderHistoryLoading);

  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
