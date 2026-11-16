import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler


categorical_columns = [
    "Marital status",
    "Application mode",
    "Course",
    "Daytime/evening attendance",
    "Previous qualification",
    "Nacionality",
    "Mother's qualification",
    "Father's qualification",
    "Mother's occupation",
    "Father's occupation",
    "Displaced",
    "Educational special needs",
    "Debtor",
    "Tuition fees up to date",
    "Gender",
    "Scholarship holder",
    "International",
]


def build_binary_target(dataset: pd.DataFrame) -> pd.Series:
    return dataset["Target"].map(
        {
            "Dropout": 1,
            "Enrolled": 0,
            "Graduate": 0,
        }
    ).astype(int)


def build_preprocessor(
    feature_dataset: pd.DataFrame,
) -> ColumnTransformer:
    available_categorical_columns = [
        column
        for column in categorical_columns
        if column in feature_dataset.columns
    ]

    numeric_columns = [
        column
        for column in feature_dataset.columns
        if column not in available_categorical_columns
    ]

    return ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(handle_unknown="ignore"),
                available_categorical_columns,
            ),
            (
                "numeric",
                StandardScaler(),
                numeric_columns,
            ),
        ]
    )


def prepare_train_test(dataset: pd.DataFrame):
    feature_dataset = dataset.drop(columns=["Target"])
    target = build_binary_target(dataset)

    return train_test_split(
        feature_dataset,
        target,
        test_size=0.20,
        random_state=42,
        stratify=target,
    )


def get_preparation_summary(dataset: pd.DataFrame) -> dict:
    (
        training_features,
        test_features,
        training_target,
        test_target,
    ) = prepare_train_test(dataset)

    preprocessor = build_preprocessor(training_features)

    transformed_training_features = preprocessor.fit_transform(
        training_features
    )

    transformed_test_features = preprocessor.transform(
        test_features
    )

    available_categorical_columns = [
        column
        for column in categorical_columns
        if column in training_features.columns
    ]

    numeric_columns = [
        column
        for column in training_features.columns
        if column not in available_categorical_columns
    ]

    return {
        "target": {
            "positive_class": "Dropout",
            "positive_label": "Evasão",
            "negative_classes": [
                "Enrolled",
                "Graduate",
            ],
            "negative_label": "Não evasão",
        },
        "split": {
            "training_percentage": 80,
            "test_percentage": 20,
            "training_students": len(training_features),
            "test_students": len(test_features),
            "stratified": True,
            "random_state": 42,
            "training_dropout_rate": round(
                float(training_target.mean() * 100),
                2,
            ),
            "test_dropout_rate": round(
                float(test_target.mean() * 100),
                2,
            ),
        },
        "preprocessing": {
            "categorical_features": len(
                available_categorical_columns
            ),
            "numeric_features": len(numeric_columns),
            "encoding": "OneHotEncoder",
            "scaling": "StandardScaler",
            "transformed_features": int(
                transformed_training_features.shape[1]
            ),
            "training_rows": int(
                transformed_training_features.shape[0]
            ),
            "test_rows": int(
                transformed_test_features.shape[0]
            ),
        },
    }