import * as natural from 'natural';

export interface NLPAnalysis {
  keywords: string[];
  sentiment: {
    score: number;
    comparative: number;
    type: 'positive' | 'negative' | 'neutral';
  };
  entities: {
    type: string;
    value: string;
  }[];
  topics: string[];
  readability: {
    score: number;
    grade: string;
  };
}

export class AdvancedNLPAnalyzer {
  private tokenizer: natural.WordTokenizer;
  private stemmer: natural.PorterStemmer;
  private sentimentAnalyzer: natural.SentimentAnalyzer;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.sentimentAnalyzer = new natural.SentimentAnalyzer("English", this.stemmer, "afinn");
  }

  analyzeText(text: string): NLPAnalysis {
    const tokens = this.tokenizer.tokenize(text) || [];
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));

    return {
      keywords: this.extractKeywords(stemmedTokens),
      sentiment: this.analyzeSentiment(text),
      entities: this.extractEntities(text),
      topics: this.identifyTopics(stemmedTokens),
      readability: this.calculateReadability(text)
    };
  }

  private extractKeywords(stemmedTokens: string[]): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'in', 'to', 'for', 'of', 'and', 'or', 
      'is', 'are', 'was', 'were', 'will', 'be', 'been'
    ]);

    return stemmedTokens
      .filter(token => 
        token.length > 3 && 
        !stopWords.has(token)
      )
      .reduce((unique, item) => 
        unique.includes(item) ? unique : [...unique, item], 
        [] as string[]
      )
      .slice(0, 10);
  }

  private analyzeSentiment(text: string): NLPAnalysis['sentiment'] {
    const sentimentScore = this.sentimentAnalyzer.getSentiment(
      this.tokenizer.tokenize(text) || []
    );

    return {
      score: sentimentScore,
      comparative: sentimentScore / (this.tokenizer.tokenize(text)?.length || 1),
      type: sentimentScore > 0 ? 'positive' : 
             sentimentScore < 0 ? 'negative' : 'neutral'
    };
  }

  private extractEntities(text: string): NLPAnalysis['entities'] {
    // Simple entity extraction (can be expanded with more sophisticated NER)
    const entityPatterns = [
      { type: 'date', regex: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/ },
      { type: 'email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ },
      { type: 'url', regex: /https?:\/\/[^\s]+/ }
    ];

    return entityPatterns.flatMap(pattern => {
      const matches = text.match(new RegExp(pattern.regex, 'g')) || [];
      return matches.map(match => ({
        type: pattern.type,
        value: match
      }));
    });
  }

  private identifyTopics(stemmedTokens: string[]): string[] {
    const topicSeeds = [
      'technolog', 'ai', 'learn', 'develop', 
      'project', 'manag', 'innov', 'solution'
    ];

    return topicSeeds
      .filter(seed => 
        stemmedTokens.some(token => token.includes(seed))
      );
  }

  private calculateReadability(text: string): NLPAnalysis['readability'] {
    // Simple Flesch-Kincaid readability calculation
    const sentences = text.split(/[.!?]+/).length;
    const words = this.tokenizer.tokenize(text)?.length || 0;
    const syllables = this.countSyllables(text);

    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);

    const getReadabilityGrade = (score: number): string => {
      if (score > 90) return 'Very Easy';
      if (score > 80) return 'Easy';
      if (score > 70) return 'Fairly Easy';
      if (score > 60) return 'Standard';
      if (score > 50) return 'Fairly Difficult';
      if (score > 30) return 'Difficult';
      return 'Very Difficult';
    };

    return {
      score: parseFloat(score.toFixed(2)),
      grade: getReadabilityGrade(score)
    };
  }

  private countSyllables(text: string): number {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    const words = this.tokenizer.tokenize(text.toLowerCase()) || [];

    return words.reduce((total, word) => {
      let wordSyllables = 0;
      let prevCharWasVowel = false;

      for (let i = 0; i < word.length; i++) {
        const isVowel = vowels.includes(word[i]);
        
        if (isVowel && !prevCharWasVowel) {
          wordSyllables++;
        }
        
        prevCharWasVowel = isVowel;
      }

      // Adjust for edge cases
      if (word.endsWith('e')) wordSyllables--;
      if (word.endsWith('le')) wordSyllables++;
      
      return total + (wordSyllables || 1);
    }, 0);
  }
}