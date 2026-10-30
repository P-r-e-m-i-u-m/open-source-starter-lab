# Hindi Text Classification Dataset

This directory contains the curated Devanagari text dataset for the "AI Everywhere" Hindi Text Classifier.

## Categories and Class Distribution

The dataset contains **100 verified Hindi sentences**, evenly distributed across 4 categories (25 sentences each):

| Category | Hindi Label | Description | Count |
| :--- | :--- | :--- | :--- |
| `education` | शिक्षा | Schools, universities, examinations, pedagogy, research | 25 |
| `sports` | खेल | Matches, tournaments, athletics, scores, players | 25 |
| `weather` | मौसम | Atmospheric conditions, rainfall, temperature, forecasts | 25 |
| `technology` | तकनीक | Software, hardware, AI, internet, cybersecurity | 25 |

## File Schema

File: `data/raw/hindi_corpus.csv`
- Encoding: `UTF-8`
- Delimiter: `,`
- Columns:
  1. `text` (string): A complete sentence in Devanagari script.
  2. `category` (string): Canonical class name (`education`, `sports`, `weather`, `technology`).

## Annotation Guidelines

1. **Devanagari Purity**: Sentences are written in standard Devanagari script.
2. **Contextual Focus**: Each sentence represents a single thematic concept without mixing domains.
3. **Lexical Diversity**: Sentences avoid exact copy-paste templates and vary in sentence structure, verb tenses, and vocabulary.
4. **Ethical Considerations**: Contains neutral, public educational and informational prose free of harmful or private personal data.

