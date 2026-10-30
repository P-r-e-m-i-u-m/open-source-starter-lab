# Hindi Text Classifier (हिंदी पाठ वर्गीकरण)

[![Theme: AI Everywhere](https://img.shields.io/badge/Theme-AI%20Everywhere-blue.svg)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Tested with Pytest](https://img.shields.io/badge/Tested%20with-Pytest-orange.svg)](https://pytest.org/)

A beginner-friendly, lightweight open-source machine learning model built for the **"AI Everywhere"** initiative. This project classifies Devanagari Hindi sentences into four common categories: **Education (शिक्षा)**, **Sports (खेल)**, **Weather (मौसम)**, and **Technology (तकनीक)**.

---

## 🌟 The "AI Everywhere" Philosophy

Modern artificial intelligence often focuses on massive LLMs requiring multi-GPU clusters and predominantly English-language corpora. **AI Everywhere** brings machine learning back to edge computing, local devices, and multilingual communities:

1. **Accessible & Lightweight**: Runs entirely on a standard CPU with zero GPU requirements, training in under 2 seconds.
2. **Multilingual & Indic-First**: Designed natively for Hindi Devanagari script, accounting for combining characters, matras, and conjuncts.
3. **Transparent & Educational**: Built using clear scikit-learn pipelines with interpretable probability outputs and honest error analysis.

---

## 🏗️ Architecture & How It Works

```
Raw Hindi Sentence (उदा. "छात्रों ने परीक्षा की तैयारी की।")
                          │
                          ▼
            [ 1. Devanagari Preprocessor ]
            • Unicode NFC normalization
            • Purna viram (। / ॥) & punctuation removal
            • Numeral stripping (०-९, 0-9)
                          │
                          ▼
             [ 2. Subword TF-IDF Vectorizer ]
            • Subword character n-grams (char_wb, range 3 to 5)
            • Naturally captures Hindi roots and inflected suffixes:
              (उदा. "खिलाड़ी" and "खिलाड़ियों" share root n-grams)
            • Sublinear TF scaling (1 + log(tf))
                          │
                          ▼
             [ 3. Statistical Classifier ]
            • L2 Regularized Logistic Regression / Multinomial Naive Bayes
            • Probability calibration across 4 categories
                          │
                          ▼
             Predicted Category & Confidence Score
```

### Why Subword `char_wb` for Hindi?
Hindi is an inflected Indo-Aryan language where words change form based on gender, number, and case (e.g., *खिलाड़ी* -> *खिलाड़ियों*, *पढ़ेगा* -> *पढ़ाई*). A standard word-level vectorizer treats these as completely distinct words. By utilizing **subword character n-grams within word boundaries (`char_wb`, 3–5 characters)**, the model recognizes shared morphological stems without needing heavy external lemmatizers.

---

## 📂 Project Directory Structure

```text
hindi-text-classifier/
├── data/
│   ├── raw/
│   │   └── hindi_corpus.csv       # 100 balanced Hindi sentences across 4 categories
│   ├── test_split.csv             # Held-out test split (generated during training)
│   └── README.md                  # Dataset schema and annotation documentation
├── src/
│   ├── __init__.py
│   ├── preprocessor.py            # Devanagari text normalization and cleaning
│   ├── pipeline.py                # Scikit-learn feature extraction & model definition
│   ├── train.py                   # Data loading, stratified splitting, training & export
│   ├── evaluate.py                # Held-out evaluation, metrics, and error analysis
│   └── cli.py                     # Command-line interface for inference
├── tests/
│   ├── __init__.py
│   ├── test_preprocessor.py       # Preprocessing & input validation tests
│   └── test_model.py              # Model behavior, prediction, and serialization tests
├── models/
│   └── hindi_classifier.joblib    # Serialized model artifact
├── requirements.txt               # Dependencies (scikit-learn, pandas, pytest, joblib)
├── LICENSE                        # Open-source MIT License
└── README.md                      # Project documentation
```

---

## 🚀 Quickstart Guide

### 1. Installation

Clone the repository and install the lightweight dependencies:

```bash
cd hindi-text-classifier
pip install -r requirements.txt
```

### 2. Training the Model

Train the model using a stratified 75/25 split (ensuring no data leakage):

```bash
python -m src.train
```

*Output:*
```text
[*] Loading corpus from: data/raw/hindi_corpus.csv
[*] Total loaded records: 100
[*] Train set size: 75 samples
[*] Test set size:  25 samples
[*] Building pipeline (Classifier: logistic_regression, Feature Mode: char_wb)...
[+] Training Accuracy:      100.00%
[+] Held-out Test Accuracy: 88.00%
[+] Successfully exported model artifact to: models/hindi_classifier.joblib
```

### 3. Evaluating on Held-Out Test Data

Run the evaluation script to inspect real accuracy, per-class metrics, confusion matrix, and failure cases:

```bash
python -m src.evaluate
```

*Real Evaluation Metrics (from 25 held-out test sentences):*

```text
Overall Test Accuracy: 88.00%

Classification Report:
              precision    recall  f1-score   support
   education     1.0000    0.8333    0.9091         6
      sports     0.8000    0.6667    0.7273         6
  technology     1.0000    1.0000    1.0000         7
     weather     0.7500    1.0000    0.8571         6

    accuracy                         0.8800        25
   macro avg     0.8875    0.8750    0.8734        25
weighted avg     0.8920    0.8800    0.8784        25
```

---

## 🔍 Real Error Analysis & Explanations

Machine learning is imperfect, and understanding *why* an algorithm misclassifies is a vital skill. Below are genuine examples identified during held-out evaluation:

### Correct Prediction Example
* **Sentence**: *"डेटा सेंटर में सर्वरों को ठंडा रखने के लिए अत्याधुनिक कूलिंग सिस्टम स्थापित किए गए हैं।"*
* **Ground Truth**: `technology` | **Predicted**: `technology` (Confidence: 31.9%)
* **Why it worked**: Strong presence of technical n-grams (*सर्वर*, *सिस्टम*, *डेटा*).

### Misclassification Examples (False Positives / Negatives)
1. **Sentence**: *"मैदान पर अत्यधिक नमी होने के कारण अंपायरों ने खेल को थोड़ी देर के लिए रोक दिया।"*
   * **Ground Truth**: `sports`
   * **Model Prediction**: `weather` (27.2% vs 26.2% sports)
   * **Root Cause**: The word **"नमी" (humidity/moisture)** strongly associates with atmospheric weather in the training set, slightly overpowering the sporting context ("अंपायरों", "खेल").
2. **Sentence**: *"इतिहास के अध्यापक ने प्राचीन भारतीय सभ्यताओं पर एक रोचक व्याख्यान दिया।"*
   * **Ground Truth**: `education`
   * **Model Prediction**: `sports` (31.4% vs 27.2% education)
   * **Root Cause**: Specific historical vocabulary (*प्राचीन*, *सभ्यताओं*, *व्याख्यान*) did not appear frequently in the education training subset, causing the model to rely on low-confidence residual weights.

---

## 💻 Command-Line Interface (CLI)

### Single Sentence Classification

```bash
python -m src.cli --text "आज का मौसम बहुत सुहावना है और ठंडी हवा चल रही है।"
```

*Output:*
```text
============================================================
  Input Text:      आज का मौसम बहुत सुहावना है और ठंडी हवा चल रही है।
  Prediction:      weather
  श्रेणी (Hindi):    मौसम (Weather)
  Confidence:      50.66%
------------------------------------------------------------
  Category Probabilities:
   • weather      (मौसम   ):  50.7%  |##########          |
   • technology   (तकनीक  ):  17.5%  |###                 |
   • education    (शिक्षा ):  16.5%  |###                 |
   • sports       (खेल    ):  15.3%  |###                 |
============================================================
```

### Interactive REPL Mode

To classify multiple sentences interactively:

```bash
python -m src.cli --interactive
```

---

## 🧪 Running the Test Suite

Run the 15 unit tests covering preprocessor behavior, input validation, Devanagari danda removal, and model serialization:

```bash
pytest tests/ -v
```

---

## ⚠️ Transparent Limitations

1. **No Deep Semantic Comprehension**: The model relies on statistical subword n-gram frequencies (TF-IDF), not deep contextual language understanding. It does not comprehend sentiment, tone, or complex metaphors.
2. **Small Dataset Sensitivity**: With a 100-sentence corpus, out-of-vocabulary words receive zero weight. If a sentence contains words entirely absent from the training set, confidence will be distributed near uniform (25% across all 4 categories).
3. **Dialect and Hinglish Limitations**: The model is trained on standard Devanagari Hindi. It does not support romanized Hindi (Hinglish) or regional dialects (such as Bhojpuri, Maithili, or Rajasthani).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for educational, commercial, and personal use.

