export const extractImportantWords = (text: string): string[] => {
    const stopWords = new Set([
      'the', 'is', 'in', 'and', 'of', 'a', 'an', 'to', 'it', 'that', 'on', 'for', 'this',
    ])
    const wordFreq: Record<string, number> = {}
    text
      .toLowerCase()
      .replace(/[.,!?]/g, '')
      .split(/\s+/)
      .forEach(word => {
        if (!stopWords.has(word)) {
          wordFreq[word] = (wordFreq[word] || 0) + 1
        }
      })
  
    const sorted = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)
  
    return sorted
  }
  