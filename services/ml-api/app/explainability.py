import logging
import time
from threading import Lock

import numpy as np

from app.preprocessing import categorical_columns
from app.training import get_trained_models


logger = logging.getLogger("nochurn")

explainability_cache = None
explainability_lock = Lock()


feature_labels = {
    "Marital status": "Estado civil",
    "Application mode": "Forma de ingresso",
    "Application order": "Ordem da candidatura",
    "Course": "Curso",
    "Daytime/evening attendance": "Período de estudo",
    "Previous qualification": "Formação anterior",
    "Previous qualification (grade)": "Nota da formação anterior",
    "Nacionality": "Nacionalidade",
    "Mother's qualification": "Escolaridade da mãe",
    "Father's qualification": "Escolaridade do pai",
    "Mother's occupation": "Ocupação da mãe",
    "Father's occupation": "Ocupação do pai",
    "Admission grade": "Nota de admissão",
    "Displaced": "Aluno deslocado",
    "Educational special needs": "Necessidades educacionais especiais",
    "Debtor": "Situação de dívida",
    "Tuition fees up to date": "Mensalidade em dia",
    "Gender": "Gênero",
    "Scholarship holder": "Bolsa de estudos",
    "Age at enrollment": "Idade na matrícula",
    "International": "Estudante internacional",
    "Curricular units 1st sem (credited)": "Disciplinas creditadas no 1º semestre",
    "Curricular units 1st sem (enrolled)": "Disciplinas matriculadas no 1º semestre",
    "Curricular units 1st sem (evaluations)": "Avaliações no 1º semestre",
    "Curricular units 1st sem (approved)": "Aprovações no 1º semestre",
    "Curricular units 1st sem (grade)": "Média do 1º semestre",
    "Curricular units 1st sem (without evaluations)": "Disciplinas sem avaliação no 1º semestre",
    "Curricular units 2nd sem (credited)": "Disciplinas creditadas no 2º semestre",
    "Curricular units 2nd sem (enrolled)": "Disciplinas matriculadas no 2º semestre",
    "Curricular units 2nd sem (evaluations)": "Avaliações no 2º semestre",
    "Curricular units 2nd sem (approved)": "Aprovações no 2º semestre",
    "Curricular units 2nd sem (grade)": "Média do 2º semestre",
    "Curricular units 2nd sem (without evaluations)": "Disciplinas sem avaliação no 2º semestre",
    "Unemployment rate": "Taxa de desemprego",
    "Inflation rate": "Taxa de inflação",
    "GDP": "PIB",
}


def get_feature_label(
    feature_name: str,
) -> str:
    return feature_labels.get(
        feature_name,
        feature_name,
    )


def get_original_feature_name(
    transformed_feature_name: str,
    available_columns: list[str],
) -> str:
    clean_feature_name = transformed_feature_name.split(
        "__",
        maxsplit=1,
    )[-1]

    for column_name in categorical_columns:
        if column_name not in available_columns:
            continue

        if clean_feature_name.startswith(
            f"{column_name}_"
        ):
            return column_name

    if clean_feature_name in available_columns:
        return clean_feature_name

    return clean_feature_name


def aggregate_feature_importance(
    transformed_feature_names,
    transformed_importances,
    available_columns: list[str],
) -> list:
    aggregated_importances = {}

    for (
        transformed_feature_name,
        transformed_importance,
    ) in zip(
        transformed_feature_names,
        transformed_importances,
    ):
        original_feature_name = get_original_feature_name(
            transformed_feature_name,
            available_columns,
        )

        current_importance = aggregated_importances.get(
            original_feature_name,
            0.0,
        )

        aggregated_importances[
            original_feature_name
        ] = (
            current_importance
            + float(transformed_importance)
        )

    total_importance = sum(
        aggregated_importances.values()
    )

    feature_importances = []

    for (
        feature_name,
        importance_value,
    ) in aggregated_importances.items():
        normalized_importance = (
            importance_value / total_importance
            if total_importance > 0
            else 0
        )

        feature_importances.append(
            {
                "feature": feature_name,
                "label": get_feature_label(
                    feature_name
                ),
                "importance": round(
                    normalized_importance,
                    4,
                ),
                "importance_std": 0.0,
            }
        )

    feature_importances.sort(
        key=lambda feature_item: feature_item[
            "importance"
        ],
        reverse=True,
    )

    return feature_importances


def build_explainability() -> dict:
    started_at = time.perf_counter()

    logger.info(
        "EXPLAINABILITY | Obtendo modelos treinados"
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

    preprocessor = best_pipeline.named_steps[
        "preprocessor"
    ]

    trained_model = best_pipeline.named_steps[
        "model"
    ]

    transformed_feature_names = (
        preprocessor.get_feature_names_out()
    )

    if best_model_key == "decision_tree":
        transformed_importances = (
            trained_model.feature_importances_
        )

        method_name = "Importância dos atributos"

        method_description = (
            "Importância calculada pela Árvore de Decisão"
        )

    elif best_model_key == "logistic_regression":
        transformed_importances = np.abs(
            trained_model.coef_[0]
        )

        method_name = "Coeficientes do modelo"

        method_description = (
            "Magnitude dos coeficientes da Regressão Logística"
        )

    else:
        raise ValueError(
            "O modelo selecionado não possui "
            "explicabilidade configurada."
        )

    feature_importances = aggregate_feature_importance(
        transformed_feature_names,
        transformed_importances,
        list(test_features.columns),
    )

    top_features = feature_importances[:10]

    insights = []

    for feature_item in top_features[:3]:
        importance_percentage = (
            feature_item["importance"] * 100
        )

        insights.append(
            {
                "feature": feature_item["feature"],
                "label": feature_item["label"],
                "text": (
                    f"{feature_item['label']} aparece entre "
                    "as variáveis mais relevantes para o "
                    "modelo, representando aproximadamente "
                    f"{importance_percentage:.1f}% da "
                    "importância relativa calculada."
                ),
            }
        )

    duration = time.perf_counter() - started_at

    logger.info(
        "EXPLAINABILITY | Finalizada em %.3fs",
        duration,
    )

    return {
        "model": {
            "key": best_model_key,
            "name": best_model["name"],
            "metrics": best_model["metrics"],
        },
        "method": {
            "name": method_name,
            "description": method_description,
            "test_samples": len(
                test_features
            ),
        },
        "features": top_features,
        "insights": insights,
    }


def get_explainability() -> dict:
    global explainability_cache

    if explainability_cache is not None:
        logger.info(
            "EXPLAINABILITY | Usando cache"
        )

        return explainability_cache

    with explainability_lock:
        if explainability_cache is not None:
            return explainability_cache

        logger.info(
            "EXPLAINABILITY | Calculando primeira execução"
        )

        explainability_cache = build_explainability()

        return explainability_cache