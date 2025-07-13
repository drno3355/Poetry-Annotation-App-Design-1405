import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePoems } from '../context/PoemContext';
import PoemEditor from '../components/PoemEditor';

const EditPoem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPoem, updatePoem } = usePoems();

  const poem = getPoem(id);

  if (!poem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Poem Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleSave = (poemData) => {
    updatePoem(id, poemData);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Poem</h1>
      <PoemEditor poem={poem} onSave={handleSave} />
    </div>
  );
};

export default EditPoem;