import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { TIngredient } from '@utils-types';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector } from '../../services/store';
import {
  getModalOrder,
  getOrderByNumber
} from '../../services/slices/feed-data';
import { getIngredientsWithSelector } from '../../services/slices/ingredients';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();

  const { number: orderId } = useParams();
  const orderData = useSelector(getModalOrder);

  const ingredients = useSelector(getIngredientsWithSelector);

  useEffect(() => {
    if (!orderData) {
      dispatch(getOrderByNumber(Number(orderId)));
    }
  }, [dispatch, getOrderByNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
