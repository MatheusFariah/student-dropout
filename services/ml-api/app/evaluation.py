import logging
import time

from sklearn.metrics import (
    confusion_matrix,
    roc_curve,
)

from app.training import get_trained_models


logger = logging.getLogger("nochurn")


def build_roc_curve(
    target,
    probabilities,
) -> list:
    (
        false_positive_rates,
        true_positive_rates,
        thresholds,
    ) = roc_curve(
        target,
        probabilities,
    )

    curve_points = []

    for (
        false_positive_rate,
        true_positive_rate,
        threshold,
    ) in zip(
        false_positive_rates,
        true_positive_rates,
        thresholds,
    ):
        curve_points.append(
            {
                "false_positive_rate": round(
                    float(false_positive_rate),
                    4,
                ),
                "true_positive_rate": round(
                    float(true_positive_rate),
                    4,
                ),
                "threshold": (
                    round(float(threshold), 4)
                    if threshold != float("inf")
                    else None
                ),
            }
        )

    return curve_points


def build_evaluation() -> dict:
    started_at = time.perf_counter()

    logger.info(
        "EVALUATION | Obtendo modelo treinado"
    )

    training_result = get_trained_models()

    best_model_key = training_result[
        "best_model_key"
    ]

    best_model = training_result["models"][
        best_model_key
    ]

    best_pipeline = training_result["pipelines"][
        best_model_key
    ]

    test_features = training_result[
        "test_features"
    ]

    test_target = training_result[
        "test_target"
    ]

    logger.info(
        "EVALUATION | Avaliando %s",
        best_model["name"],
    )

    predictions = best_pipeline.predict(
        test_features
    )

    probabilities = best_pipeline.predict_proba(
        test_features
    )[:, 1]

    confusion_values = confusion_matrix(
        test_target,
        predictions,
        labels=[0, 1],
    )

    (
        true_negative,
        false_positive,
        false_negative,
        true_positive,
    ) = confusion_values.ravel()

    actual_dropouts = (
        int(true_positive)
        + int(false_negative)
    )

    predicted_alerts = (
        int(true_positive)
        + int(false_positive)
    )

    detection_rate = (
        int(true_positive)
        / actual_dropouts
        * 100
        if actual_dropouts > 0
        else 0
    )

    alert_precision = (
        int(true_positive)
        / predicted_alerts
        * 100
        if predicted_alerts > 0
        else 0
    )

    missed_rate = (
        int(false_negative)
        / actual_dropouts
        * 100
        if actual_dropouts > 0
        else 0
    )

    duration = (
        time.perf_counter()
        - started_at
    )

    logger.info(
        "EVALUATION | Finalizada em %.3fs",
        duration,
    )

    return {
        "model": {
            "key": best_model_key,
            "name": best_model["name"],
        },
        "threshold": 0.50,
        "metrics": best_model["metrics"],
        "confusion_matrix": {
            "true_negative": int(
                true_negative
            ),
            "false_positive": int(
                false_positive
            ),
            "false_negative": int(
                false_negative
            ),
            "true_positive": int(
                true_positive
            ),
        },
        "summary": {
            "test_students": len(
                test_features
            ),
            "actual_dropouts": actual_dropouts,
            "detected_dropouts": int(
                true_positive
            ),
            "missed_dropouts": int(
                false_negative
            ),
            "predicted_alerts": predicted_alerts,
            "correct_alerts": int(
                true_positive
            ),
            "detection_rate": round(
                detection_rate,
                1,
            ),
            "alert_precision": round(
                alert_precision,
                1,
            ),
            "missed_rate": round(
                missed_rate,
                1,
            ),
        },
        "roc_curve": build_roc_curve(
            test_target,
            probabilities,
        ),
    }