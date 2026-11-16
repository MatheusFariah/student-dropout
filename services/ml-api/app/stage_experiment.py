from functools import lru_cache

from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from threadpoolctl import threadpool_limits

from app.data import load_dataset
from app.preprocessing import (
    categorical_columns,
    prepare_train_test,
)


def build_stage_preprocessor(
    feature_columns: list[str],
) -> ColumnTransformer:
    selected_categorical_columns = [
        column_name
        for column_name in categorical_columns
        if column_name in feature_columns
    ]

    selected_numeric_columns = [
        column_name
        for column_name in feature_columns
        if column_name not in selected_categorical_columns
    ]

    return ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore",
                ),
                selected_categorical_columns,
            ),
            (
                "numeric",
                StandardScaler(),
                selected_numeric_columns,
            ),
        ]
    )


def evaluate_stage(
    training_features,
    test_features,
    training_target,
    test_target,
    feature_columns: list[str],
) -> dict:
    stage_preprocessor = build_stage_preprocessor(
        feature_columns
    )

    pipeline = Pipeline(
        steps=[
            (
                "preprocessor",
                stage_preprocessor,
            ),
            (
                "model",
                LogisticRegression(
                    max_iter=2000,
                ),
            ),
        ]
    )

    selected_training_features = training_features[
        feature_columns
    ]

    selected_test_features = test_features[
        feature_columns
    ]

    with threadpool_limits(limits=1):
        pipeline.fit(
            selected_training_features,
            training_target,
        )

        predictions = pipeline.predict(
            selected_test_features
        )

        probabilities = pipeline.predict_proba(
            selected_test_features
        )[:, 1]

    return {
        "features": len(feature_columns),
        "metrics": {
            "accuracy": round(
                accuracy_score(
                    test_target,
                    predictions,
                ),
                4,
            ),
            "precision": round(
                precision_score(
                    test_target,
                    predictions,
                    zero_division=0,
                ),
                4,
            ),
            "recall": round(
                recall_score(
                    test_target,
                    predictions,
                    zero_division=0,
                ),
                4,
            ),
            "f1": round(
                f1_score(
                    test_target,
                    predictions,
                    zero_division=0,
                ),
                4,
            ),
            "roc_auc": round(
                roc_auc_score(
                    test_target,
                    probabilities,
                ),
                4,
            ),
        },
    }


@lru_cache(maxsize=1)
def get_stage_experiment() -> dict:
    dataset = load_dataset()

    (
        training_features,
        test_features,
        training_target,
        test_target,
    ) = prepare_train_test(
        dataset
    )

    all_feature_columns = list(
        training_features.columns
    )

    enrollment_columns = [
        column_name
        for column_name in all_feature_columns
        if not column_name.startswith(
            "Curricular units 1st sem"
        )
        and not column_name.startswith(
            "Curricular units 2nd sem"
        )
    ]

    first_semester_columns = [
        column_name
        for column_name in all_feature_columns
        if not column_name.startswith(
            "Curricular units 2nd sem"
        )
    ]

    second_semester_columns = (
        all_feature_columns
    )

    experiment_stages = [
        {
            "key": "enrollment",
            "label": "Matrícula",
            "moment": "Antes do desempenho acadêmico",
            "lead_time": "Maior antecedência",
            "columns": enrollment_columns,
        },
        {
            "key": "first_semester",
            "label": "1º semestre",
            "moment": "Após o primeiro semestre",
            "lead_time": "Antecedência intermediária",
            "columns": first_semester_columns,
        },
        {
            "key": "second_semester",
            "label": "2º semestre",
            "moment": "Após o segundo semestre",
            "lead_time": "Menor antecedência",
            "columns": second_semester_columns,
        },
    ]

    results = []

    for experiment_stage in experiment_stages:
        stage_result = evaluate_stage(
            training_features,
            test_features,
            training_target,
            test_target,
            experiment_stage["columns"],
        )

        results.append(
            {
                "key": experiment_stage[
                    "key"
                ],
                "label": experiment_stage[
                    "label"
                ],
                "moment": experiment_stage[
                    "moment"
                ],
                "lead_time": experiment_stage[
                    "lead_time"
                ],
                **stage_result,
            }
        )

    return {
        "model": "Regressão Logística",
        "test_students": len(
            test_features
        ),
        "stages": results,
    }