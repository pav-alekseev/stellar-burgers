import { FC, SyntheticEvent, useState } from 'react';
import { useSelector } from 'react-redux';

import { RegisterUI } from '@ui-pages';
import { Preloader } from '@ui';
import { TRegisterData } from '@api';

import { useDispatch } from '../../services/store';
import { registerUser, getIsLoading } from '../../services/slices/user-data';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const newUserData: TRegisterData = {
      name: userName,
      email: email,
      password: password
    };
    dispatch(registerUser(newUserData));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
