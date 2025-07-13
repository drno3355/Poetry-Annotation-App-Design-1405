import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoems } from '../context/PoemContext';
import PoemEditor from '../components/PoemEditor';

const CreatePoem = () => {
  const navigate = useNavigate();
  const { addPoem } = usePoems();

  const handleSave = (poemData) => {
    const id = addPoem(poemData);
    navigate(`/edit/${id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create New Poem</h1>
      <PoemEditor onSave={handleSave} />
    </div>
  );
};

export default CreatePoem;