import { FC, SyntheticEvent, useState } from 'react';

import { ProfileUI } from '@ui-pages';
import { TUser } from '@utils-types';
import { Preloader } from '@ui';

import {
  getIsLoading,
  getUser,
  updateUser
} from '../../services/slices/user-data';
import { useDispatch, useSelector } from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser) as TUser;
  const isLoading = useSelector(getIsLoading);

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(updateUser(formValue));
    setIsFormChanged(false);
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setFormValue({ name: user.name, email: user.email, password: '' });
    setIsFormChanged(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFormChanged(true);

    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );

  return null;
};
