import React from 'react';
import PasteDetail from '../components/PasteDetail';

const ViewPastePage = ({ isSharedView = false }) => {
  return <PasteDetail isSharedView={isSharedView} />;
};

export default ViewPastePage;