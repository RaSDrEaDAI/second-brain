import React, { useState, useEffect } from 'react';

interface Document {
  id: string;
  title: string;
  content: string;
  created: Date;
  tags: string[];
  category: string;
}

export default function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    tags: '',
    category: ''
  });

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleCreateDocument = () => {
    const document: Document = {
      id: Date.now().toString(),
      title: newDocument.title,
      content: newDocument.content,
      created: new Date(),
      tags: newDocument.tags.split(',').map(tag => tag.trim()),
      category: newDocument.category
    };

    setDocuments([...documents, document]);
    
    // Reset form
    setNewDocument({
      title: '',
      content: '',
      tags: '',
      category: ''
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-bold mb-4">Documents</h2>
          {documents.map(doc => (
            <div 
              key={doc.id} 
              className="border-b py-2 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedDocument(doc)}
            >
              <h3 className="font-semibold">{doc.title}</h3>
              <p className="text-sm text-gray-500">
                {doc.tags.join(', ')} | {doc.category}
              </p>
            </div>
          ))}
        </div>

        {/* Document Viewer */}
        <div className="bg-white rounded-lg shadow-md p-4">
          {selectedDocument ? (
            <>
              <h2 className="text-3xl font-bold mb-4">{selectedDocument.title}</h2>
              <p className="text-gray-600 mb-4">
                Created: {selectedDocument.created.toLocaleString()}
              </p>
              <div className="prose max-w-full">
                <pre>{selectedDocument.content}</pre>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a document to view</p>
          )}
        </div>

        {/* Document Creation */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-bold mb-4">Create Document</h2>
          <input 
            type="text" 
            placeholder="Title" 
            className="w-full p-2 border rounded mb-4"
            value={newDocument.title}
            onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
          />
          <textarea 
            placeholder="Content" 
            className="w-full p-2 border rounded mb-4 h-48"
            value={newDocument.content}
            onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
          ></textarea>
          <input 
            type="text" 
            placeholder="Tags (comma-separated)" 
            className="w-full p-2 border rounded mb-4"
            value={newDocument.tags}
            onChange={(e) => setNewDocument({...newDocument, tags: e.target.value})}
          />
          <select 
            className="w-full p-2 border rounded mb-4"
            value={newDocument.category}
            onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
          >
            <option value="">Select Category</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="research">Research</option>
          </select>
          <button 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={handleCreateDocument}
          >
            Create Document
          </button>
        </div>
      </div>
    </div>
  );
}