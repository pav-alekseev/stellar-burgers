import { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import { fetchFeedData, getFeedOrders } from '../../services/slices/feed-data';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(getFeedOrders);

  useEffect(() => {
    dispatch(fetchFeedData());
  }, [dispatch, fetchFeedData]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeedData())} />
  );
};
