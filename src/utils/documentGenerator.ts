import fs from 'fs';
import path from 'path';
import { ConceptExtractor } from './conceptExtractor';

export class DocumentGenerator {
  private conceptExtractor: ConceptExtractor;
  private basePath: string;

  constructor() {
    this.conceptExtractor = new ConceptExtractor();
    this.basePath = path.join(process.cwd(), 'brain');
  }

  async generateDailyJournal(conversations: string[]) {
    const today = new Date().toISOString().split('T')[0];
    const journalPath = path.join(this.basePath, 'journals', `${today}.md`);

    // Combine conversations
    const combinedText = conversations.join('\n\n');

    // Extract concepts
    const concepts = await this.conceptExtractor.extractConcepts(combinedText);

    // Generate journal content
    const journalContent = `# Daily Journal - ${today}

## Key Concepts
${concepts.keywords.map(k => `- ${k}`).join('\n')}

## Themes
${concepts.themes.map(t => `- ${t}`).join('\n')}

## Sentiment Overview
Overall Sentiment: ${concepts.sentiment}

## Conversations Summary
${combinedText.slice(0, 500)}...
`;

    // Ensure directory exists
    fs.mkdirSync(path.dirname(journalPath), { recursive: true });

    // Write journal
    fs.writeFileSync(journalPath, journalContent);

    return journalPath;
  }
}