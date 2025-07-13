import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePoems } from '../context/PoemContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiCopy, FiEye, FiArrowLeft, FiCode } = FiIcons;

const ExportPoem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPoem } = usePoems();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const [previewUrl, setPreviewUrl] = useState('');
  const iframeRef = useRef(null);

  const poem = getPoem(id);

  // Create a Blob URL for the preview iframe
  useEffect(() => {
    if (poem) {
      const htmlContent = generateEmbedHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [poem]);

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

  const generateEmbedHTML = () => {
    const css = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Hanken Grotesk', Georgia, serif;
          line-height: 1.6;
          color: #1f2937;
          background: transparent;
          padding: 0;
          margin: 0;
          overflow-x: hidden;
        }
        .poem-container {
          width: 100%;
          max-width: 100%;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .poem-title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 8px;
          color: #1f2937;
        }
        .poem-author {
          text-align: center;
          font-style: italic;
          color: #6b7280;
          margin-bottom: 24px;
        }
        .poem-line {
          margin: 8px 0;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .poem-line:hover {
          background-color: #f3f4f6;
        }
        .annotation-popup {
          position: absolute;
          background: #1f2937;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          max-width: 300px;
          z-index: 1000;
          font-size: 14px;
          line-height: 1.4;
          display: none;
        }
        .annotation-popup::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 20px;
          border: 8px solid transparent;
          border-top-color: #1f2937;
        }
        @media (max-width: 600px) {
          .poem-container {
            padding: 15px;
          }
          .poem-title {
            font-size: 20px;
          }
          .annotation-popup {
            max-width: 250px;
          }
        }
      </style>
    `;

    const script = `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          const popup = document.getElementById('annotation-popup');
          const poemContainer = document.querySelector('.poem-container');
          const lines = document.querySelectorAll('.poem-line[data-annotation]');
          
          lines.forEach(line => {
            line.addEventListener('click', function(e) {
              const annotation = this.getAttribute('data-annotation');
              if (annotation) {
                popup.innerHTML = annotation;
                popup.style.display = 'block';
                
                const containerRect = poemContainer.getBoundingClientRect();
                const rect = this.getBoundingClientRect();
                
                // Position relative to the poem container
                const leftPos = rect.left - containerRect.left;
                popup.style.left = leftPos + 'px';
                
                // Calculate if popup should appear above or below the line
                const spaceAbove = rect.top - containerRect.top;
                const popupHeight = popup.offsetHeight + 16; // popup height + spacing
                
                if (spaceAbove > popupHeight) {
                  // Position above the line
                  popup.style.top = (rect.top - containerRect.top - popupHeight) + 'px';
                  popup.classList.add('popup-arrow-bottom');
                  popup.classList.remove('popup-arrow-top');
                } else {
                  // Position below the line
                  popup.style.top = (rect.bottom - containerRect.top + 16) + 'px';
                  popup.classList.add('popup-arrow-top');
                  popup.classList.remove('popup-arrow-bottom');
                }
                
                // Adjust if popup goes off screen horizontally
                const rightEdge = leftPos + popup.offsetWidth;
                if (rightEdge > containerRect.width) {
                  popup.style.left = (containerRect.width - popup.offsetWidth - 10) + 'px';
                }
                
                // Stop propagation to prevent body click handler from triggering
                e.stopPropagation();
              }
            });
          });
          
          document.addEventListener('click', function(e) {
            if (!e.target.closest('.poem-line')) {
              popup.style.display = 'none';
            }
          });
          
          // Notify parent window that content is loaded (for iframe sizing)
          if (window.parent && window !== window.parent) {
            window.parent.postMessage({ type: 'poem-iframe-loaded', height: document.body.scrollHeight }, '*');
          }
        });
        
        // Listen for resize events and notify parent
        window.addEventListener('resize', function() {
          if (window.parent && window !== window.parent) {
            window.parent.postMessage({ type: 'poem-iframe-resized', height: document.body.scrollHeight }, '*');
          }
        });
      </script>
    `;

    const fontImport = `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    `;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${poem.title} - Interactive Annotation</title>
        ${fontImport}
        ${css}
      </head>
      <body>
        <div class="poem-container">
          <div class="poem-title">${poem.title}</div>
          <div class="poem-author">by ${poem.author}</div>
          <div class="poem-content">
            ${poem.lines.map((line, index) => {
              const annotation = poem.annotations.find(ann => ann.lineIndex === index);
              return `<div class="poem-line" ${annotation ? `data-annotation="${annotation.text}" style="background-color: ${annotation.color}20; border-left: 4px solid ${annotation.color};"` : ''}>${line}</div>`;
            }).join('')}
          </div>
          <div id="annotation-popup" class="annotation-popup"></div>
        </div>
        ${script}
      </body>
      </html>
    `;

    return html;
  };

  const generateIframeCode = () => {
    const filename = `${poem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_annotation.html`;
    return `<iframe 
  src="${filename}" 
  style="width: 100%; border: none; overflow: hidden;" 
  onload="this.style.height=this.contentDocument.body.scrollHeight+'px';"
  title="${poem.title} - Interactive Poem Annotation">
</iframe>

<script>
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'poem-iframe-loaded' || e.data.type === 'poem-iframe-resized') {
      const iframe = document.querySelector('iframe[title="${poem.title} - Interactive Poem Annotation"]');
      if (iframe) iframe.style.height = e.data.height + 'px';
    }
  }, false);
</script>`;
  };

  const embedHTML = generateEmbedHTML();
  const iframeCode = generateIframeCode();

  const handleCopy = async () => {
    try {
      const contentToCopy = activeTab === 'html' ? embedHTML : iframeCode;
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([embedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${poem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_annotation.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Export: {poem.title}</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCopy}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <SafeIcon icon={FiCopy} className="w-4 h-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Download HTML
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-900 p-4 border-b">Live Preview</h2>
        <div className="p-4 bg-gray-50">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <iframe 
              ref={iframeRef}
              src={previewUrl} 
              className="w-full"
              style={{ height: '400px', border: 'none' }}
              title={`${poem.title} Preview`}
            ></iframe>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This is how your poem will appear when embedded in your learning portal.
          </p>
        </div>
      </div>

      {/* Code Export Tabs */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'html' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center">
                <SafeIcon icon={FiCode} className="w-4 h-4 mr-2" />
                HTML Code
              </span>
            </button>
            <button
              onClick={() => setActiveTab('iframe')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'iframe' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center">
                <SafeIcon icon={FiCode} className="w-4 h-4 mr-2" />
                Iframe Embed
              </span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <textarea
            value={activeTab === 'html' ? embedHTML : iframeCode}
            readOnly
            className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-none"
            placeholder="Generated code will appear here..."
          />
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Option 1: Direct HTML</h4>
            <ul className="text-blue-800 space-y-2 pl-5">
              <li>• Download the HTML file and upload it to your learning portal</li>
              <li>• Copy the entire HTML code and paste it directly if your platform supports HTML content</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Option 2: Iframe Embed (Recommended)</h4>
            <ul className="text-blue-800 space-y-2 pl-5">
              <li>• Download the HTML file and upload it to your web server</li>
              <li>• Copy the iframe code and paste it into your learning portal</li>
              <li>• The iframe will automatically resize to fit the content</li>
              <li>• Works with most learning management systems (Canvas, Moodle, Blackboard, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPoem;