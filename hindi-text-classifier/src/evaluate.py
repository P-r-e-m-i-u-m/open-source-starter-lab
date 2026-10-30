"""Model evaluation and error analysis module for the Hindi Text Classifier.

This script loads the trained model and held-out test data, computes real metrics
(Accuracy, Precision, Recall, F1-Score, Confusion Matrix), and inspects sample
predictions and failure cases.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

from src.pipeline import load_model

DEFAULT_MODEL_PATH = Path("models/hindi_classifier.joblib")
DEFAULT_TEST_PATH = Path("data/test_split.csv")


def evaluate_model(
    model_path: Path = DEFAULT_MODEL_PATH,
    test_path: Path = DEFAULT_TEST_PATH,
) -> dict[str, object]:
    """Evaluates the model on held-out test data and displays detailed reports.

    Args:
        model_path: Path to serialized .joblib model artifact.
        test_path: Path to CSV containing held-out test data.

    Returns:
        Dictionary containing real evaluation metrics and prediction results.
    """
    print("=" * 70)
    print("           HINDI TEXT CLASSIFIER - HELD-OUT EVALUATION           ")
    print("=" * 70)

    print(f"[*] Loading model from: {model_path}")
    pipeline = load_model(model_path)

    print(f"[*] Loading test set from: {test_path}")
    if not test_path.exists():
        raise FileNotFoundError(
            f"Test data file not found at {test_path}. Run train.py first to generate the test split."
        )

    test_df = pd.read_csv(test_path, encoding="utf-8")
    X_test = test_df["text"]
    y_true = test_df["category"]

    print(f"[*] Evaluating {len(X_test)} held-out test samples...\n")

    # Generate predictions and probabilities
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)
    classes = list(pipeline.classes_)

    acc = accuracy_score(y_true, y_pred)
    report = classification_report(y_true, y_pred, digits=4)
    cm = confusion_matrix(y_true, y_pred, labels=classes)

    print("-" * 70)
    print(f"Overall Test Accuracy: {acc * 100:.2f}%")
    print("-" * 70)
    print("\nDetailed Classification Report:")
    print(report)

    print("Confusion Matrix:")
    cm_df = pd.DataFrame(cm, index=[f"True: {c}" for c in classes], columns=[f"Pred: {c}" for c in classes])
    print(cm_df.to_string())
    print()

    # Error Analysis: Separate correct and incorrect predictions
    correct_samples = []
    incorrect_samples = []

    for idx, (text, true_label, pred_label, probas) in enumerate(
        zip(X_test, y_true, y_pred, y_proba)
    ):
        confidence = float(max(probas))
        sample_info = {
            "index": idx,
            "text": text,
            "true_label": true_label,
            "pred_label": pred_label,
            "confidence": confidence,
            "probabilities": {cls: float(p) for cls, p in zip(classes, probas)},
        }
        if true_label == pred_label:
            correct_samples.append(sample_info)
        else:
            incorrect_samples.append(sample_info)

    print("-" * 70)
    print("SAMPLE CORRECT PREDICTIONS (High Confidence)")
    print("-" * 70)
    for sample in correct_samples[:3]:
        print(f"Sentence:   \"{sample['text']}\"")
        print(f"True Class: {sample['true_label']} | Predicted: {sample['pred_label']} ({sample['confidence'] * 100:.1f}%)")
        print()

    print("-" * 70)
    print("ERROR ANALYSIS: MISCLASSIFICATIONS (False Positives / False Negatives)")
    print("-" * 70)
    if incorrect_samples:
        for sample in incorrect_samples:
            print(f"Sentence:   \"{sample['text']}\"")
            print(f"True Class: {sample['true_label']}  <-- MISCLASSIFIED AS -->  {sample['pred_label']}")
            print(f"Predicted Probabilities:")
            for cls, prob in sample["probabilities"].items():
                print(f"  - {cls:12s}: {prob * 100:.1f}%")
            print()
    else:
        print("[i] All test samples were classified correctly by the model.")
        print("    Note: On small held-out sets, 100% accuracy can occur when domain vocabulary")
        print("    is well-separated. See README for limitations on out-of-vocabulary generalization.")
        print()

    # Edge-case demonstration on ambiguous or synthetic queries
    print("-" * 70)
    print("MODEL BEHAVIOR ON AMBIGUOUS / MULTI-DOMAIN INPUTS")
    print("-" * 70)
    ambiguous_examples = [
        (
            "विश्वविद्यालय के मैदान में क्रिकेट टूर्नामेंट का फाइनल खेला गया।",
            "Mixed context: Has both 'विश्वविद्यालय' (education) and 'क्रिकेट' (sports)",
        ),
        (
            "स्मार्टफोन ऐप की मदद से किसान मौसम का सटीक पूर्वानुमान जान सकते हैं।",
            "Mixed context: Has 'स्मार्टफोन' (tech) and 'मौसम' (weather)",
        ),
    ]

    for text, description in ambiguous_examples:
        pred = pipeline.predict([text])[0]
        probas = pipeline.predict_proba([text])[0]
        top_prob = max(probas)
        print(f"Input:       \"{text}\"")
        print(f"Explanation: {description}")
        print(f"Prediction:  {pred} ({top_prob * 100:.1f}%)")
        print("Scores:      " + ", ".join(f"{c}: {p*100:.1f}%" for c, p in zip(classes, probas)))
        print()

    print("=" * 70)

    return {
        "accuracy": acc,
        "classification_report": report,
        "confusion_matrix": cm,
        "correct_count": len(correct_samples),
        "incorrect_count": len(incorrect_samples),
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Evaluate the Hindi Text Classification model on held-out test data."
    )
    parser.add_argument(
        "--model",
        type=Path,
        default=DEFAULT_MODEL_PATH,
        help="Path to trained model artifact (.joblib).",
    )
    parser.add_argument(
        "--test-data",
        type=Path,
        default=DEFAULT_TEST_PATH,
        help="Path to held-out test split CSV.",
    )
    args = parser.parse_args()
    evaluate_model(model_path=args.model, test_path=args.test_data)


if __name__ == "__main__":
    main()

