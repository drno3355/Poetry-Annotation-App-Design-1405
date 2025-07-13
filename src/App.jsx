import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { PoemProvider } from './context/PoemContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreatePoem from './pages/CreatePoem';
import EditPoem from './pages/EditPoem';
import ExportPoem from './pages/ExportPoem';
import './index.css';

function App() {
  return (
    <PoemProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreatePoem />} />
            <Route path="/edit/:id" element={<EditPoem />} />
            <Route path="/export/:id" element={<ExportPoem />} />
          </Routes>
        </Layout>
      </Router>
    </PoemProvider>
  );
}

export default App;