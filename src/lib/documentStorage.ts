import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface DocumentMetadata {
  id: string;
  title: string;
  created: Date;
  updated: Date;
  tags: string[];
  category: string;
  version: number;
}

export class DocumentStorage {
  private baseStoragePath: string;

  constructor() {
    this.baseStoragePath = path.join(process.cwd(), 'brain', 'documents');
    this.ensureDirectoryExists(this.baseStoragePath);
  }

  private ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private generateDocumentId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private sanitizeFileName(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);
  }

  createDocument(
    content: string, 
    metadata: Partial<DocumentMetadata>
  ): string {
    const documentId = this.generateDocumentId();
    const fileName = `${this.sanitizeFileName(metadata.title || 'untitled')}-${documentId}`;
    const filePath = path.join(this.baseStoragePath, `${fileName}.md`);
    const versionPath = path.join(this.baseStoragePath, 'versions', fileName);

    // Ensure versions directory exists
    this.ensureDirectoryExists(path.join(this.baseStoragePath, 'versions'));

    const fullMetadata: DocumentMetadata = {
      id: documentId,
      title: metadata.title || 'Untitled',
      created: new Date(),
      updated: new Date(),
      tags: metadata.tags || [],
      category: metadata.category || 'uncategorized',
      version: 1
    };

    // Store metadata in a separate JSON file
    const metadataPath = path.join(this.baseStoragePath, `${fileName}.json`);
    
    // Write document content
    fs.writeFileSync(filePath, content);
    fs.writeFileSync(metadataPath, JSON.stringify(fullMetadata, null, 2));

    // Create initial version
    const versionFilePath = path.join(versionPath, `v1.md`);
    this.ensureDirectoryExists(path.dirname(versionFilePath));
    fs.writeFileSync(versionFilePath, content);

    return documentId;
  }

  updateDocument(
    documentId: string, 
    newContent: string, 
    updateMetadata: Partial<DocumentMetadata> = {}
  ): boolean {
    const existingDoc = this.getDocument(documentId);
    if (!existingDoc) return false;

    const { metadata } = existingDoc;
    const fileName = `${this.sanitizeFileName(metadata.title)}-${documentId}`;
    const filePath = path.join(this.baseStoragePath, `${fileName}.md`);
    const versionPath = path.join(this.baseStoragePath, 'versions', fileName);

    // Update metadata
    const updatedMetadata = {
      ...metadata,
      ...updateMetadata,
      updated: new Date(),
      version: (metadata.version || 0) + 1
    };

    // Write updated content
    fs.writeFileSync(filePath, newContent);

    // Update metadata file
    const metadataPath = path.join(this.baseStoragePath, `${fileName}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));

    // Create version
    const versionFilePath = path.join(versionPath, `v${updatedMetadata.version}.md`);
    this.ensureDirectoryExists(path.dirname(versionFilePath));
    fs.writeFileSync(versionFilePath, newContent);

    return true;
  }

  getDocument(documentId: string): { content: string, metadata: DocumentMetadata } | null {
    const files = fs.readdirSync(this.baseStoragePath);
    const documentFile = files.find(file => file.includes(documentId) && file.endsWith('.md'));
    const metadataFile = files.find(file => file.includes(documentId) && file.endsWith('.json'));

    if (!documentFile || !metadataFile) return null;

    const content = fs.readFileSync(path.join(this.baseStoragePath, documentFile), 'utf-8');
    const metadata = JSON.parse(fs.readFileSync(path.join(this.baseStoragePath, metadataFile), 'utf-8'));

    return { content, metadata };
  }

  listDocuments(filters: Partial<DocumentMetadata> = {}): DocumentMetadata[] {
    const metadataFiles = fs.readdirSync(this.baseStoragePath)
      .filter(file => file.endsWith('.json'));

    return metadataFiles
      .map(file => {
        const metadata = JSON.parse(fs.readFileSync(path.join(this.baseStoragePath, file), 'utf-8'));
        return metadata;
      })
      .filter(metadata => 
        (!filters.category || metadata.category === filters.category) &&
        (!filters.tags || filters.tags.every(tag => metadata.tags.includes(tag)))
      );
  }

  deleteDocument(documentId: string): boolean {
    const files = fs.readdirSync(this.baseStoragePath);
    const documentFile = files.find(file => file.includes(documentId) && file.endsWith('.md'));
    const metadataFile = files.find(file => file.includes(documentId) && file.endsWith('.json'));

    if (!documentFile || !metadataFile) return false;

    fs.unlinkSync(path.join(this.baseStoragePath, documentFile));
    fs.unlinkSync(path.join(this.baseStoragePath, metadataFile));

    return true;
  }
}