import React from 'react';
import { Navigate } from 'react-router-dom';

interface IProps {
  Component: React.FC;
}

export default function PublicRoutes({ Component }: IProps) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token && role) {
    return <Navigate to={'/'} />;
  }
  return <Component />;
}
