import logging

import pandas as pd

from app.data import load_dataset
from app.preprocessing import categorical_columns
from app.training import get_trained_models


logger = logging.getLogger("nochurn")


def build_reference_student(dataset: pd.DataFrame) -> dict:
    feature_dataset = dataset.drop(
        columns=["Target"]
    )

    reference_student = {}

    for column_name in feature_dataset.columns:
        if column_name in categorical_columns:
            reference_student[column_name] = (
                feature_dataset[
                    column_name
                ]
                .mode()
                .iloc[0]
            )
        else:
            reference_student[column_name] = (
                feature_dataset[
                    column_name
                ]
                .median()
            )

    return reference_student


def build_profile_signals(
    student_data: dict,
) -> list:
    signals = []

    if not student_data[
        "tuition_fees_up_to_date"
    ]:
        signals.append(
            {
                "type": "risk",
                "label": "Mensalidade irregular",
            }
        )

    if student_data["debtor"]:
        signals.append(
            {
                "type": "risk",
                "label": "Possui dívida",
            }
        )

    if (
        student_data[
            "first_sem_approved"
        ]
        <= 3
    ):
        signals.append(
            {
                "type": "risk",
                "label": "Poucas aprovações no 1º semestre",
            }
        )

    if (
        student_data[
            "second_sem_approved"
        ]
        <= 3
    ):
        signals.append(
            {
                "type": "risk",
                "label": "Poucas aprovações no 2º semestre",
            }
        )

    if (
        student_data[
            "first_sem_grade"
        ]
        < 10
    ):
        signals.append(
            {
                "type": "risk",
                "label": "Média baixa no 1º semestre",
            }
        )

    if (
        student_data[
            "second_sem_grade"
        ]
        < 10
    ):
        signals.append(
            {
                "type": "risk",
                "label": "Média baixa no 2º semestre",
            }
        )

    if (
        student_data[
            "tuition_fees_up_to_date"
        ]
    ):
        signals.append(
            {
                "type": "protective",
                "label": "Mensalidade em dia",
            }
        )

    if student_data[
        "scholarship_holder"
    ]:
        signals.append(
            {
                "type": "protective",
                "label": "Possui bolsa de estudos",
            }
        )

    if (
        student_data[
            "first_sem_grade"
        ]
        >= 12
    ):
        signals.append(
            {
                "type": "protective",
                "label": "Bom desempenho no 1º semestre",
            }
        )

    if (
        student_data[
            "second_sem_grade"
        ]
        >= 12
    ):
        signals.append(
            {
                "type": "protective",
                "label": "Bom desempenho no 2º semestre",
            }
        )

    return signals[:6]


def predict_dropout(
    student_data: dict,
) -> dict:
    training_result = get_trained_models()

    best_model_key = training_result[
        "best_model_key"
    ]

    best_model = training_result[
        "models"
    ][best_model_key]

    best_pipeline = training_result[
        "pipelines"
    ][best_model_key]

    dataset = load_dataset()

    reference_student = (
        build_reference_student(
            dataset
        )
    )

    reference_student[
        "Age at enrollment"
    ] = student_data[
        "age_at_enrollment"
    ]

    reference_student[
        "Admission grade"
    ] = student_data[
        "admission_grade"
    ]

    reference_student[
        "Tuition fees up to date"
    ] = int(
        student_data[
            "tuition_fees_up_to_date"
        ]
    )

    reference_student[
        "Debtor"
    ] = int(
        student_data[
            "debtor"
        ]
    )

    reference_student[
        "Scholarship holder"
    ] = int(
        student_data[
            "scholarship_holder"
        ]
    )

    reference_student[
        "Curricular units 1st sem (approved)"
    ] = student_data[
        "first_sem_approved"
    ]

    reference_student[
        "Curricular units 1st sem (grade)"
    ] = student_data[
        "first_sem_grade"
    ]

    reference_student[
        "Curricular units 2nd sem (approved)"
    ] = student_data[
        "second_sem_approved"
    ]

    reference_student[
        "Curricular units 2nd sem (grade)"
    ] = student_data[
        "second_sem_grade"
    ]

    student_frame = pd.DataFrame(
        [reference_student]
    )

    dropout_probability = float(
        best_pipeline.predict_proba(
            student_frame
        )[0][1]
    )

    threshold = 0.50

    if dropout_probability < 0.35:
        risk_level = "low"
        risk_label = "Baixo"
    elif dropout_probability < 0.65:
        risk_level = "moderate"
        risk_label = "Moderado"
    else:
        risk_level = "high"
        risk_label = "Alto"

    alert = (
        dropout_probability
        >= threshold
    )

    logger.info(
        "SIMULATION | model=%s | probability=%.4f | alert=%s",
        best_model["name"],
        dropout_probability,
        alert,
    )

    return {
        "model": {
            "key": best_model_key,
            "name": best_model["name"],
        },
        "dropout_probability": round(
            dropout_probability,
            4,
        ),
        "threshold": threshold,
        "alert": alert,
        "risk": {
            "level": risk_level,
            "label": risk_label,
        },
        "signals": build_profile_signals(
            student_data
        ),
    }