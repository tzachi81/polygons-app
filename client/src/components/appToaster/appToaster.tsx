import { ToastContainer, toast } from 'react-toastify';
import type { Id, ToastOptions, TypeOptions } from 'react-toastify';
import type { FC } from 'react';

interface IApptoasterProps {}

const toastify = (message: string, type: TypeOptions) => {
  const options: ToastOptions = {
    type: type,
    autoClose: 3000,
    progress: undefined,
    position: 'bottom-center'
  };
  const toastId = toast(message, options);
  return toastId;
};

const unToastify = (id: Id) => toast.dismiss(id);

const AppToaster: FC<IApptoasterProps> = () => {
  return <ToastContainer closeOnClick theme='dark' />;
};

export { AppToaster, toastify, unToastify };
