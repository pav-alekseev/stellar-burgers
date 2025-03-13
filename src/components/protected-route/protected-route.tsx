import { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ProtectedRouteProps } from './type';
import { useSelector } from '../../services/store';
import { getIsAuthenticated } from '../../services/slices/user-data';

export const ProtectedRoute: FC<ProtectedRouteProps & PropsWithChildren> = ({
  allowAnonymous,
  children
}) => {
  const location = useLocation();
  const isUserAuthenticated = useSelector(getIsAuthenticated);
  const from = location.state?.from || '/';

  if (!allowAnonymous && !isUserAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (allowAnonymous && isUserAuthenticated) {
    return <Navigate to={from} />;
  }

  return children;
};
