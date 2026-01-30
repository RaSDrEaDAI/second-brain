import React, { useState, useEffect } from 'react';
import { DocumentSearch } from '../lib/documentSearch';

export interface Document {
  id: string;
  title: string;
  content: string;
  metadata: {
    created: Date;
    tags: string[];
    category: string;
  };
}

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    const searchDocuments = async () => {
      const documentSearch = new DocumentSearch();
      const results = documentSearch.search({ query: searchQuery });
      setDocuments(results as Document[]);
    };

    searchDocuments();
  }, [searchQuery]);

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
        <input
          type="text"
          placeholder="Search documents..."
          className="w-full p-2 mb-4 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div>
          {documents.map(doc => (
            <div 
              key={doc.id}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b"
              onClick={() => handleDocumentSelect(doc)}
            >
              <h3 className="font-bold">{doc.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(doc.metadata.created).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Document Viewer */}
      <div className="w-2/3 p-6">
        {selectedDocument ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedDocument.title}</h2>
            <div className="flex mb-4">
              <span className="mr-4">
                <strong>Created:</strong> {new Date(selectedDocument.metadata.created).toLocaleString()}
              </span>
              <span>
                <strong>Tags:</strong> {selectedDocument.metadata.tags.join(', ')}
              </span>
            </div>
            <div className="prose max-w-full">
              <pre className="whitespace-pre-wrap">{selectedDocument.content}</pre>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Select a document to view its contents
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;