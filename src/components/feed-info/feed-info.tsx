import { FC } from 'react';
import { useSelector } from 'react-redux';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import {
  getFeedOrders,
  getTotalEmountOrders,
  getTotalEmountToday
} from '../../services/slices/feed-data';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const total = useSelector(getTotalEmountOrders);
  const totalToday = useSelector(getTotalEmountToday);

  const orders: TOrder[] = useSelector(getFeedOrders);
  const feed = { total, totalToday };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
