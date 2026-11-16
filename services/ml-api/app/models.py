from app.training import get_trained_models


model_descriptions = {
  "dummy_classifier": {
    "category": "Baseline",
    "description": (
        "Sempre prevê a classe mais frequente: não evasão. "
        "Por isso, não identifica evasões reais e fica com Recall e F1 em 0%."
    ),
},
    "logistic_regression": {
        "category": "Modelo linear",
        "description": (
            "Modelo interpretável que estima a probabilidade de evasão "
            "a partir da combinação das características do estudante."
        ),
    },
    "decision_tree": {
        "category": "Árvore de decisão",
        "description": (
            "Modelo baseado em regras que divide os estudantes em grupos "
            "de acordo com características relevantes."
        ),
    },
}


def get_models_analysis() -> dict:
    training_result = get_trained_models()

    models = []

    for model_key, model_result in training_result["models"].items():
        model_information = model_descriptions[model_key]

        models.append(
            {
                "key": model_key,
                "name": model_result["name"],
                "category": model_information["category"],
                "description": model_information["description"],
                "metrics": model_result["metrics"],
                "is_best": (
                    model_key
                    == training_result["best_model_key"]
                ),
            }
        )

    best_model = next(
        model
        for model in models
        if model["is_best"]
    )

    return {
        "models": models,
        "best_model": {
            "key": best_model["key"],
            "name": best_model["name"],
            "f1": best_model["metrics"]["f1"],
            "recall": best_model["metrics"]["recall"],
            "roc_auc": best_model["metrics"]["roc_auc"],
        },
        "training": {
            "training_students": len(
                training_result["training_features"]
            ),
            "test_students": len(
                training_result["test_features"]
            ),
        },
    }