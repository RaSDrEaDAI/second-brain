import * as fs from 'fs';
import * as path from 'path';
import { DocumentMetadata } from './documentStorage';

export interface SearchOptions {
  query?: string;
  tags?: string[];
  category?: string;
  minDate?: Date;
  maxDate?: Date;
}

export class DocumentSearch {
  private baseStoragePath: string;

  constructor() {
    this.baseStoragePath = path.join(process.cwd(), 'brain', 'documents');
  }

  search(options: SearchOptions = {}): Array<{
    id: string;
    title: string;
    content: string;
    metadata: DocumentMetadata;
    relevanceScore: number;
  }> {
    const allDocuments = this.getAllDocuments();

    return allDocuments
      .map(doc => ({
        ...doc,
        relevanceScore: this.calculateRelevanceScore(doc, options)
      }))
      .filter(doc => 
        this.matchesSearchCriteria(doc, options) &&
        doc.relevanceScore > 0
      )
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);
  }

  private getAllDocuments() {
    const metadataFiles = fs.readdirSync(this.baseStoragePath)
      .filter(file => file.endsWith('.json'));

    return metadataFiles.map(metadataFile => {
      const metadataPath = path.join(this.baseStoragePath, metadataFile);
      const documentPath = metadataPath.replace('.json', '.md');
      
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      const content = fs.readFileSync(documentPath, 'utf-8');

      return {
        id: metadata.id,
        title: metadata.title,
        content,
        metadata
      };
    });
  }

  private calculateRelevanceScore(
    doc: { title: string, content: string }, 
    options: SearchOptions
  ): number {
    let score = 0;

    // Query-based scoring
    if (options.query) {
      const query = options.query.toLowerCase();
      if (doc.title.toLowerCase().includes(query)) score += 3;
      if (doc.content.toLowerCase().includes(query)) score += 1;
    }

    return score;
  }

  private matchesSearchCriteria(
    doc: { metadata: DocumentMetadata }, 
    options: SearchOptions
  ): boolean {
    // Category filter
    if (options.category && 
        doc.metadata.category !== options.category) {
      return false;
    }

    // Tags filter
    if (options.tags && 
        !options.tags.every(tag => doc.metadata.tags.includes(tag))) {
      return false;
    }

    // Date range filter
    const created = new Date(doc.metadata.created);
    if (options.minDate && created < options.minDate) return false;
    if (options.maxDate && created > options.maxDate) return false;

    return true;
  }
}