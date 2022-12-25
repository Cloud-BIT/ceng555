import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import { PublicRoute, Routes } from './components/routes';
import Sidebar from './components/Sidebar';
import { EmptyPage } from './pages/empty';

interface Props {}

const StocksNow: React.FC<Props> = () => {
  return (
    <div className='app'>
      {/* <Hea