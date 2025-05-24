import React from 'react';
import { useParams } from 'react-router-dom';
import PasteForm from '../components/PasteForm';

const EditPastePage = () => {
  const { id } = useParams();
  return <PasteForm isEditing pasteId={id} />;
};

export default EditPastePage; 