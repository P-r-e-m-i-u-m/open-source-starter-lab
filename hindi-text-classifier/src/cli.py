"""Command-line interface for classifying Hindi sentences using the trained model.

Supports both single-sentence inference and interactive REPL mode.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from src.pipeline import load_model

DEFAULT_MODEL_PATH = Path("models/hindi_classifier.joblib")

CATEGORY_HINDI_NAMES: dict[str, str] = {
    "education": "शिक्षा (Education)",
    "sports": "खेल (Sports)",
    "weather": "मौसम (Weather)",
    "technology": "तकनीक (Technology)",
}


def classify_sentence(
    pipeline, text: str
) -> tuple[str, str, float, dict[str, float]]:
    """Predicts category and confidence scores for a given Hindi sentence.

    Args:
        pipeline: Trained scikit-learn Pipeline.
        text: Input Hindi sentence.

    Returns:
        Tuple of (predicted_class, hindi_label, confidence, proba_dict).
    """
    prediction = pipeline.predict([text])[0]
    probabilities = pipeline.predict_proba([text])[0]
    classes = list(pipeline.classes_)

    confidence = float(max(probabilities))
    proba_dict = {cls: float(p) for cls, p in zip(classes, probabilities)}
    # Sort probabilities descending
    sorted_probas = dict(sorted(proba_dict.items(), key=lambda item: item[1], reverse=True))

    hindi_label = CATEGORY_HINDI_NAMES.get(prediction, prediction)
    return prediction, hindi_label, confidence, sorted_probas


def display_result(
    text: str, prediction: str, hindi_label: str, confidence: float, probas: dict[str, float]
) -> None:
    """Formats and prints classification results cleanly to the terminal."""
    print("\n" + "=" * 60)
    print(f"  Input Text:      {text}")
    print(f"  Prediction:      {prediction}")
    print(f"  श्रेणी (Hindi):    {hindi_label}")
    print(f"  Confidence:      {confidence * 100:.2f}%")
    print("-" * 60)
    print("  Category Probabilities:")
    for cat, prob in probas.items():
        bar = "#" * int(prob * 20)
        hindi_name = CATEGORY_HINDI_NAMES.get(cat, cat).split()[0]
        print(f"   • {cat:12s} ({hindi_name:7s}): {prob * 100:5.1f}%  |{bar:<20}|")
    print("=" * 60 + "\n")


def interactive_loop(pipeline) -> None:
    """Runs an interactive REPL session classifying user-provided Hindi text."""
    print("\n" + "=" * 60)
    print("   HINDI TEXT CLASSIFIER - INTERACTIVE MODE")
    print("   Type a Hindi sentence in Devanagari and press Enter.")
    print("   Type 'exit' or 'quit' (or press Ctrl+C) to exit.")
    print("=" * 60 + "\n")

    while True:
        try:
            user_input = input("Hindi Text (हिंदी वाक्य) > ").strip()
            if not user_input:
                continue
            if user_input.lower() in {"exit", "quit", "q", "बाहर"}:
                print("Exiting interactive session. नमस्ते!")
                break

            pred, label, conf, probas = classify_sentence(pipeline, user_input)
            display_result(user_input, pred, label, conf, probas)
        except (KeyboardInterrupt, EOFError):
            print("\nExiting interactive session. नमस्ते!")
            break
        except Exception as e:
            print(f"Error during classification: {e}\n")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Classify Hindi sentences into education, sports, weather, or technology."
    )
    parser.add_argument(
        "query",
        nargs="*",
        help="Hindi sentence to classify (positional argument).",
    )
    parser.add_argument(
        "-t",
        "--text",
        type=str,
        help="Hindi sentence to classify (flag argument).",
    )
    parser.add_argument(
        "-i",
        "--interactive",
        action="store_true",
        help="Launch interactive terminal REPL mode.",
    )
    parser.add_argument(
        "-m",
        "--model",
        type=Path,
        default=DEFAULT_MODEL_PATH,
        help="Path to trained model artifact.",
    )

    args = parser.parse_args()

    # Verify model exists
    if not args.model.exists():
        print(
            f"Error: Model file '{args.model}' not found. Please train the model first by running:\n"
            f"  python -m src.train"
        )
        sys.exit(1)

    pipeline = load_model(args.model)

    # Determine input text from positional or flag argument
    text_input = args.text
    if not text_input and args.query:
        text_input = " ".join(args.query).strip()

    if args.interactive or (not text_input and sys.stdin.isatty() and len(sys.argv) == 1):
        interactive_loop(pipeline)
    elif text_input:
        pred, label, conf, probas = classify_sentence(pipeline, text_input)
        display_result(text_input, pred, label, conf, probas)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()

