import logging
import time
from threading import Lock

import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from threadpoolctl import threadpool_limits

from app.data import load_dataset
from app.preprocessing import (
    build_preprocessor,
    prepare_train_test,
)


logger = logging.getLogger("nochurn")

trained_models_cache = None
training_lock = Lock()


def calculate_metrics(
    target,
    predictions,
    probabilities,
) -> dict:
    return {
        "accuracy": round(
            float(
                accuracy_score(
                    target,
                    predictions,
                )
            ),
            4,
        ),
        "precision": round(
            float(
                precision_score(
                    target,
                    predictions,
                    zero_division=0,
                )
            ),
            4,
        ),
        "recall": round(
            float(
                recall_score(
                    target,
                    predictions,
                    zero_division=0,
                )
            ),
            4,
        ),
        "f1": round(
            float(
                f1_score(
                    target,
                    predictions,
                    zero_division=0,
                )
            ),
            4,
        ),
        "roc_auc": round(
            float(
                roc_auc_score(
                    target,
                    probabilities,
                )
            ),
            4,
        ),
    }


def train_models(
    dataset: pd.DataFrame,
) -> dict:
    training_started_at = time.perf_counter()

    logger.info(
        "TRAINING | Preparando train/test"
    )

    (
        training_features,
        test_features,
        training_target,
        test_target,
    ) = prepare_train_test(dataset)

    logger.info(
        "TRAINING | Split concluído | train=%s | test=%s",
        len(training_features),
        len(test_features),
    )

    model_configurations = {
        "dummy_classifier": {
            "name": "DummyClassifier",
            "model": DummyClassifier(
                strategy="most_frequent",
            ),
        },
        "logistic_regression": {
            "name": "Regressão Logística",
            "model": LogisticRegression(
                max_iter=2000,
                random_state=42,
            ),
        },
        "decision_tree": {
            "name": "Árvore de Decisão",
            "model": DecisionTreeClassifier(
                max_depth=6,
                min_samples_leaf=15,
                random_state=42,
            ),
        },
    }

    model_results = {}
    model_pipelines = {}

    for (
        model_key,
        configuration,
    ) in model_configurations.items():
        model_started_at = time.perf_counter()

        logger.info(
            "TRAINING | %s | Iniciando",
            configuration["name"],
        )

        preprocessor = build_preprocessor(
            training_features
        )

        pipeline = Pipeline(
            steps=[
                (
                    "preprocessor",
                    preprocessor,
                ),
                (
                    "model",
                    configuration["model"],
                ),
            ]
        )

        with threadpool_limits(limits=1):
            pipeline.fit(
                training_features,
                training_target,
            )

            predictions = pipeline.predict(
                test_features
            )

            probabilities = pipeline.predict_proba(
                test_features
            )[:, 1]

        metrics = calculate_metrics(
            test_target,
            predictions,
            probabilities,
        )

        model_duration = (
            time.perf_counter()
            - model_started_at
        )

        logger.info(
            "TRAINING | %s | Finalizado em %.3fs | F1=%.4f",
            configuration["name"],
            model_duration,
            metrics["f1"],
        )

        model_results[model_key] = {
            "key": model_key,
            "name": configuration["name"],
            "metrics": metrics,
        }

        model_pipelines[model_key] = pipeline

    predictive_model_keys = [
        "logistic_regression",
        "decision_tree",
    ]

    best_model_key = max(
        predictive_model_keys,
        key=lambda current_model_key: model_results[
            current_model_key
        ]["metrics"]["f1"],
    )

    total_duration = (
        time.perf_counter()
        - training_started_at
    )

    logger.info(
        "TRAINING | Finalizado em %.3fs | Melhor=%s",
        total_duration,
        model_results[
            best_model_key
        ]["name"],
    )

    return {
        "models": model_results,
        "pipelines": model_pipelines,
        "best_model_key": best_model_key,
        "training_features": training_features,
        "test_features": test_features,
        "training_target": training_target,
        "test_target": test_target,
    }


def get_trained_models() -> dict:
    global trained_models_cache

    if trained_models_cache is not None:
        logger.info(
            "TRAINING | Usando modelos em cache"
        )

        return trained_models_cache

    logger.info(
        "TRAINING | Aguardando lock"
    )

    with training_lock:
        if trained_models_cache is not None:
            logger.info(
                "TRAINING | Cache preenchido por outra requisição"
            )

            return trained_models_cache

        logger.info(
            "TRAINING | Lock adquirido"
        )

        dataset = load_dataset()

        trained_models_cache = train_models(
            dataset
        )

        logger.info(
            "TRAINING | Cache preenchido"
        )

        return trained_models_cache