import * as natural from 'natural';

export interface ConceptAnalysis {
  keywords: string[];
  sentiment: number;
  themes: string[];
  complexity: 'low' | 'medium' | 'high';
}

export class ConceptExtractor {
  private tokenizer: natural.WordTokenizer;
  private stopWords: Set<string>;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stopWords = new Set([
      'the', 'a', 'an', 'in', 'to', 'for', 'of', 'and', 'or', 
      'is', 'are', 'was', 'were', 'will', 'be', 'been'
    ]);
  }

  extractConcepts(text: string): ConceptAnalysis {
    const tokens = this.tokenizer.tokenize(text) || [];

    return {
      keywords: this.extractKeywords(tokens),
      sentiment: this.analyzeSentiment(text),
      themes: this.identifyThemes(tokens),
      complexity: this.analyzeTextComplexity(text)
    };
  }

  private extractKeywords(tokens: string[]): string[] {
    return tokens
      .filter(token => 
        token.length > 3 && 
        !this.stopWords.has(token.toLowerCase())
      )
      .slice(0, 10);
  }

  private analyzeSentiment(text: string): number {
    try {
      const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
      return analyzer.getSentiment(this.tokenizer.tokenize(text) || []);
    } catch (error) {
      console.warn('Sentiment analysis failed:', error);
      return 0;
    }
  }

  private identifyThemes(tokens: string[]): string[] {
    const potentialThemes = new Set([
      'technology', 'ai', 'design', 
      'innovation', 'productivity', 'learning'
    ]);

    return tokens
      .filter(token => potentialThemes.has(token.toLowerCase()))
      .slice(0, 3);
  }

  private analyzeTextComplexity(text: string): 'low' | 'medium' | 'high' {
    const wordCount = this.tokenizer.tokenize(text)?.length || 0;
    const sentenceCount = text.split(/[.!?]+/).length;
    
    if (wordCount < 50) return 'low';
    if (wordCount < 200) return 'medium';
    return 'high';
  }
}