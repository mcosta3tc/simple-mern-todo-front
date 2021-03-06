import React, { useState } from 'react';
import { useLoginMutation } from '../../services/api/Query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, setRefreshToken } from './authSlice';

function PasswordInput({ name, onChange }) {
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  return (
    <div className={'w-64 flex justify-between pb-4'}>
      <input
        className={
          'bg-neutral-100 focus:text-neutral-900 rounded-md dark:bg-neutral-600 focus:bg-neutral-50 p-2 focus:outline focus:outline-offset-2 focus:outline-neutral-500 placeholder-neutral-400 w-3/4'
        }
        type={show ? 'text' : 'password'}
        placeholder={'Enter Password'}
        name={name}
        onChange={onChange}
      />
      <button
        className={
          'text-neutral-400 rounded-md bg-neutral-100 dark:bg-neutral-600 px-1 focus:outline focus:outline-offset-2 focus:outline-neutral-500'
        }
        onClick={handleClick}>
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

export const Login = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [valideCredentials, setValideCredentials] = useState(true);

  const [formState, setFormState] = useState({ email: '', password: '' });

  const [login] = useLoginMutation();

  const handleChange = ({ target: { name, value } }) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className={
        'h-screen bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-900 h-screen flex justify-center items-center text-neutral-600 dark:text-neutral-400 flex-col'
      }>
      <div
        className={`${
          valideCredentials
            ? 'mb-12 bg-neutral-100 w-64 py-1 text-center dark:bg-neutral-600 rounded-md invisible'
            : 'mb-12 bg-neutral-100 w-64 py-1 text-center dark:bg-neutral-600 rounded-md'
        }`}>
        Error please try again
      </div>
      <div className={'w-64 flex justify-center items-center flex-col'}>
        <div className={'w-64 pb-4'}>
          <div className={'flex flex-col'}>
            <input
              className={
                'bg-neutral-100 focus:text-neutral-900 rounded-md dark:bg-neutral-600 focus:bg-neutral-50 p-2 focus:outline focus:outline-offset-2 focus:outline-neutral-500 placeholder-neutral-400 placeholder-p-4'
              }
              onChange={handleChange}
              type="text"
              name={'email'}
              placeholder={'Email'}
            />
          </div>
        </div>
        <PasswordInput onChange={handleChange} name={'password'} />

        <div className={'flex flex-row w-full justify-start'}>
          <button
            className={
              'dark:text-neutral-200 dark:bg-neutral-700 shadow-neutral-200 bg-neutral-100 dark:shadow-neutral-600 my-8 px-4 py-2 rounded-lg shadow-lg focus:hide ml-4 mr-4'
            }
            onClick={async () => {
              try {
                await login(formState)
                  .unwrap()
                  .then((r) => {
                    dispatch(setCredentials({ accessToken: r.accessToken }));
                    dispatch(setRefreshToken({ refreshToken: r.refreshToken }));
                    navigate('/');
                  })
                  .catch((e) => {
                    if (e.status === 400) {
                      setValideCredentials(false);
                    }
                    console.log(e);
                  });
              } catch (err) {
                console.log('error', err);
              }
            }}>
            Login
          </button>
          <button
            className={
              'dark:text-neutral-200 dark:bg-neutral-700 shadow-neutral-200 bg-neutral-100 dark:shadow-neutral-600 my-8 px-4 py-2 rounded-lg shadow-lg focus:hide'
            }
            onClick={(event) => {
              event.preventDefault();
              navigate('/register');
            }}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
