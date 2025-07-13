import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';

const { FiSave, FiPlus, FiTrash2, FiArrowLeft } = FiIcons;

const ANNOTATION_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

const PoemEditor = ({ poem, onSave }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(poem?.title || '');
  const [author, setAuthor] = useState(poem?.author || '');
  const [poemText, setPoemText] = useState(poem?.lines?.join('\n') || '');
  const [annotations, setAnnotations] = useState(poem?.annotations || []);
  const [selectedLine, setSelectedLine] = useState(null);
  const [annotationText, setAnnotationText] = useState('');
  const [selectedColor, setSelectedColor] = useState(ANNOTATION_COLORS[0]);

  const lines = poemText.split('\n').filter(line => line.trim());

  const handleAddAnnotation = () => {
    if (selectedLine !== null && annotationText.trim()) {
      const newAnnotation = {
        lineIndex: selectedLine,
        text: annotationText.trim(),
        color: selectedColor
      };
      
      setAnnotations(prev => {
        const filtered = prev.filter(ann => ann.lineIndex !== selectedLine);
        return [...filtered, newAnnotation];
      });
      
      setAnnotationText('');
      setSelectedLine(null);
    }
  };

  const handleRemoveAnnotation = (lineIndex) => {
    setAnnotations(prev => prev.filter(ann => ann.lineIndex !== lineIndex));
  };

  const handleSave = () => {
    if (!title.trim() || !author.trim() || lines.length === 0) {
      alert('Please fill in all required fields (title, author, and poem text)');
      return;
    }

    const poemData = {
      title: title.trim(),
      author: author.trim(),
      lines,
      annotations
    };

    onSave(poemData);
  };

  const getAnnotationForLine = (lineIndex) => {
    return annotations.find(ann => ann.lineIndex === lineIndex);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
          Save Poem
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Poem Input */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Poem Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter poem title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poem Text *
                </label>
                <textarea
                  value={poemText}
                  onChange={(e) => setPoemText(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter poem text, one line per line"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview and Annotations */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Poem Preview</h2>
            <div className="space-y-2">
              <div className="text-xl font-semibold text-center text-gray-900">
                {title || 'Untitled'}
              </div>
              <div className="text-center text-gray-600 italic mb-4">
                by {author || 'Unknown Author'}
              </div>
              <div className="space-y-2">
                {lines.map((line, index) => {
                  const annotation = getAnnotationForLine(index);
                  return (
                    <motion.div
                      key={index}
                      onClick={() => setSelectedLine(index)}
                      className={`p-2 rounded cursor-pointer transition-all ${
                        selectedLine === index
                          ? 'bg-primary-100 border-2 border-primary-300'
                          : annotation
                          ? 'bg-gray-50 border-l-4 hover:bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{
                        borderLeftColor: annotation?.color,
                        backgroundColor: annotation ? `${annotation.color}10` : undefined
                      }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{line}</span>
                        {annotation && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAnnotation(index);
                            }}
                            className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {annotation && (
                        <div className="mt-2 text-sm text-gray-600 italic">
                          {annotation.text}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Annotation Panel */}
          {selectedLine !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Annotation for Line {selectedLine + 1}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Line
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    "{lines[selectedLine]}"
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annotation Color
                  </label>
                  <div className="flex space-x-2">
                    {ANNOTATION_COLORS.map((color) => (
                      <motion.button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-gray-800'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ 
                          scale: selectedColor === color ? 1.1 : 1,
                          borderWidth: selectedColor === color ? '2px' : '2px'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annotation Text
                  </label>
                  <textarea
                    value={annotationText}
                    onChange={(e) => setAnnotationText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your annotation for this line"
                  />
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleAddAnnotation}
                    disabled={!annotationText.trim()}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Add Annotation
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setSelectedLine(null);
                      setAnnotationText('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoemEditor;