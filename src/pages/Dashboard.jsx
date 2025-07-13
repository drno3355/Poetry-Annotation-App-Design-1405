import React from 'react';
import { Link } from 'react-router-dom';
import { usePoems } from '../context/PoemContext';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';

const { FiPlus, FiEdit, FiTrash2, FiDownload, FiEye, FiCalendar } = FiIcons;

const Dashboard = () => {
  const { poems, deletePoem } = usePoems();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this poem?')) {
      deletePoem(id);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Poems</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Create New Poem
          </Link>
        </motion.div>
      </div>

      {poems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm"
        >
          <SafeIcon icon={FiEye} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No poems yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first annotated poem.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Create Your First Poem
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {poems.map((poem) => (
            <motion.div 
              key={poem.id} 
              variants={item}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{poem.title}</h3>
                <p className="text-gray-600 mb-2">by {poem.author}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                  {format(new Date(poem.updatedAt), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {poem.lines?.length || 0} lines, {poem.annotations?.length || 0} annotations
                </div>
                <div className="flex space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} className="flex-1">
                    <Link
                      to={`/edit/${poem.id}`}
                      className="w-full inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <SafeIcon icon={FiEdit} className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="flex-1">
                    <Link
                      to={`/export/${poem.id}`}
                      className="w-full inline-flex items-center justify-center px-3 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
                      Export
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(poem.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;