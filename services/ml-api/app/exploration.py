import pandas as pd

from app.preprocessing import get_preparation_summary


def calculate_dropout_rate(
    dataset: pd.DataFrame,
    column: str,
    value: int,
) -> dict:
    filtered_dataset = dataset[dataset[column] == value]

    total_students = len(filtered_dataset)

    dropout_students = int(
        (filtered_dataset["Target"] == "Dropout").sum()
    )

    dropout_rate = (
        dropout_students / total_students * 100
        if total_students > 0
        else 0
    )

    return {
        "total": total_students,
        "dropout": dropout_students,
        "dropout_rate": round(dropout_rate, 2),
    }


def build_age_distribution(dataset: pd.DataFrame) -> list:
    age_ranges = [
        (17, 20, "17–19"),
        (20, 23, "20–22"),
        (23, 26, "23–25"),
        (26, 31, "26–30"),
        (31, 41, "31–40"),
        (41, 200, "41+"),
    ]

    distribution = []

    for minimum_age, maximum_age, age_label in age_ranges:
        age_group = dataset[
            (dataset["Age at enrollment"] >= minimum_age)
            & (dataset["Age at enrollment"] < maximum_age)
        ]

        total_students = len(age_group)

        dropout_students = int(
            (age_group["Target"] == "Dropout").sum()
        )

        dropout_rate = (
            dropout_students / total_students * 100
            if total_students > 0
            else 0
        )

        distribution.append(
            {
                "range": age_label,
                "total": total_students,
                "dropout": dropout_students,
                "dropout_rate": round(dropout_rate, 2),
            }
        )

    return distribution


def build_financial_factors(dataset: pd.DataFrame) -> list:
    configurations = [
        {
            "factor": "Mensalidade",
            "column": "Tuition fees up to date",
            "values": [
                (1, "Em dia"),
                (0, "Não regularizada"),
            ],
        },
        {
            "factor": "Situação de dívida",
            "column": "Debtor",
            "values": [
                (0, "Sem dívida"),
                (1, "Com dívida"),
            ],
        },
        {
            "factor": "Bolsa",
            "column": "Scholarship holder",
            "values": [
                (1, "Com bolsa"),
                (0, "Sem bolsa"),
            ],
        },
    ]

    financial_factors = []

    for configuration in configurations:
        for factor_value, factor_status in configuration["values"]:
            factor_result = calculate_dropout_rate(
                dataset,
                configuration["column"],
                factor_value,
            )

            financial_factors.append(
                {
                    "factor": configuration["factor"],
                    "status": factor_status,
                    "label": (
                        f'{configuration["factor"]}: '
                        f"{factor_status}"
                    ),
                    **factor_result,
                }
            )

    return financial_factors


def build_academic_performance(dataset: pd.DataFrame) -> list:
    target_labels = {
        "Dropout": "Evasão",
        "Enrolled": "Matriculado",
        "Graduate": "Graduado",
    }

    performance = []

    for target_name, target_label in target_labels.items():
        target_dataset = dataset[
            dataset["Target"] == target_name
        ]

        performance.append(
            {
                "target": target_name,
                "label": target_label,
                "first_sem_approved": round(
                    float(
                        target_dataset[
                            "Curricular units 1st sem (approved)"
                        ].mean()
                    ),
                    2,
                ),
                "first_sem_grade": round(
                    float(
                        target_dataset[
                            "Curricular units 1st sem (grade)"
                        ].mean()
                    ),
                    2,
                ),
                "second_sem_approved": round(
                    float(
                        target_dataset[
                            "Curricular units 2nd sem (approved)"
                        ].mean()
                    ),
                    2,
                ),
                "second_sem_grade": round(
                    float(
                        target_dataset[
                            "Curricular units 2nd sem (grade)"
                        ].mean()
                    ),
                    2,
                ),
            }
        )

    return performance


def build_correlations(dataset: pd.DataFrame) -> list:
    dropout_target = (
        dataset["Target"] == "Dropout"
    ).astype(int)

    correlation_columns = {
        "Previous qualification (grade)":
            "Nota da qualificação anterior",
        "Admission grade":
            "Nota de admissão",
        "Age at enrollment":
            "Idade na matrícula",
        "Curricular units 1st sem (evaluations)":
            "Avaliações 1º semestre",
        "Curricular units 1st sem (approved)":
            "Aprovadas 1º semestre",
        "Curricular units 1st sem (grade)":
            "Média 1º semestre",
        "Curricular units 2nd sem (evaluations)":
            "Avaliações 2º semestre",
        "Curricular units 2nd sem (approved)":
            "Aprovadas 2º semestre",
        "Curricular units 2nd sem (grade)":
            "Média 2º semestre",
        "Unemployment rate":
            "Taxa de desemprego",
        "Inflation rate":
            "Inflação",
        "GDP":
            "PIB",
    }

    correlations = []

    for column_name, column_label in correlation_columns.items():
        correlation_value = dataset[column_name].corr(
            dropout_target
        )

        correlations.append(
            {
                "feature": column_name,
                "label": column_label,
                "correlation": round(
                    float(correlation_value),
                    3,
                ),
            }
        )

    correlations.sort(
        key=lambda correlation_item: abs(
            correlation_item["correlation"]
        ),
        reverse=True,
    )

    return correlations[:6]


def build_insights(
    age_distribution: list,
    financial_factors: list,
    academic_performance: list,
    correlations: list,
) -> list:
    tuition_regular = next(
        factor
        for factor in financial_factors
        if factor["factor"] == "Mensalidade"
        and factor["status"] == "Em dia"
    )

    tuition_irregular = next(
        factor
        for factor in financial_factors
        if factor["factor"] == "Mensalidade"
        and factor["status"] == "Não regularizada"
    )

    tuition_risk_multiplier = (
        tuition_irregular["dropout_rate"]
        / tuition_regular["dropout_rate"]
        if tuition_regular["dropout_rate"] > 0
        else 0
    )

    dropout_academic = next(
        item
        for item in academic_performance
        if item["target"] == "Dropout"
    )

    graduate_academic = next(
        item
        for item in academic_performance
        if item["target"] == "Graduate"
    )

    highest_age_risk = max(
        age_distribution,
        key=lambda item: item["dropout_rate"],
    )

    strongest_correlation = correlations[0]

    approval_difference = (
        graduate_academic["first_sem_approved"]
        - dropout_academic["first_sem_approved"]
    )

    return [
        {
            "type": "financial",
            "title": "Situação financeira importa",
            "text": (
                "Estudantes com mensalidade não regularizada "
                f"apresentam taxa de evasão "
                f"{tuition_risk_multiplier:.1f}x maior "
                "que estudantes com mensalidade em dia."
            ),
        },
        {
            "type": "academic",
            "title": "O desempenho diferencia os grupos",
            "text": (
                "No primeiro semestre, estudantes que se "
                "graduaram tiveram em média "
                f"{approval_difference:.1f} aprovações a mais "
                "que estudantes que evadiram."
            ),
        },
        {
            "type": "age",
            "title": "Há diferenças entre faixas etárias",
            "text": (
                f"A faixa {highest_age_risk['range']} apresenta "
                "a maior taxa observada de evasão: "
                f"{highest_age_risk['dropout_rate']:.1f}%."
            ),
        },
        {
            "type": "correlation",
            "title": "Existe sinal antes da modelagem",
            "text": (
                f"A variável '{strongest_correlation['label']}' "
                "apresentou a maior associação linear entre "
                "as variáveis analisadas, com correlação de "
                f"{strongest_correlation['correlation']:.3f}."
            ),
        },
    ]


def build_exploration(dataset: pd.DataFrame) -> dict:
    age_series = dataset["Age at enrollment"]

    age_distribution = build_age_distribution(dataset)

    financial_factors = build_financial_factors(dataset)

    academic_performance = build_academic_performance(
        dataset
    )

    correlations = build_correlations(dataset)

    insights = build_insights(
        age_distribution,
        financial_factors,
        academic_performance,
        correlations,
    )

    return {
        "overview": {
            "students": len(dataset),
            "features": len(dataset.columns) - 1,
            "missing_values": int(
                dataset.isna().sum().sum()
            ),
            "duplicated_rows": int(
                dataset.duplicated().sum()
            ),
            "courses": int(
                dataset["Course"].nunique()
            ),
            "age": {
                "mean": round(
                    float(age_series.mean()),
                    1,
                ),
                "median": round(
                    float(age_series.median()),
                    1,
                ),
                "minimum": int(age_series.min()),
                "maximum": int(age_series.max()),
            },
        },
        "age_distribution": age_distribution,
        "financial_factors": financial_factors,
        "academic_performance": academic_performance,
        "correlations": correlations,
        "insights": insights,
        "preparation": get_preparation_summary(dataset),
    }