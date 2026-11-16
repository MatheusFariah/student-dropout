import logging
import os
import time
from functools import lru_cache

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.data import load_dataset
from app.evaluation import build_evaluation
from app.explainability import get_explainability
from app.exploration import build_exploration
from app.models import get_models_analysis
from app.prediction import predict_dropout
from app.stage_experiment import get_stage_experiment


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger("nochurn")


frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
).rstrip("/")

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if frontend_url not in allowed_origins:
    allowed_origins.append(
        frontend_url
    )


app = FastAPI(
    title="noChurn API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=[
        "GET",
        "POST",
        "OPTIONS",
    ],
    allow_headers=["*"],
)


class SimulationRequest(BaseModel):
    age_at_enrollment: int = Field(
        ge=15,
        le=80,
    )
    admission_grade: float = Field(
        ge=0,
        le=200,
    )
    tuition_fees_up_to_date: bool
    debtor: bool
    scholarship_holder: bool
    first_sem_approved: int = Field(
        ge=0,
        le=30,
    )
    first_sem_grade: float = Field(
        ge=0,
        le=20,
    )
    second_sem_approved: int = Field(
        ge=0,
        le=30,
    )
    second_sem_grade: float = Field(
        ge=0,
        le=20,
    )


@app.middleware("http")
async def log_request(
    request: Request,
    call_next,
):
    started_at = time.perf_counter()

    logger.info(
        "HTTP START | %s %s",
        request.method,
        request.url.path,
    )

    response = await call_next(
        request
    )

    duration = (
        time.perf_counter()
        - started_at
    )

    logger.info(
        "HTTP END | %s %s | status=%s | %.3fs",
        request.method,
        request.url.path,
        response.status_code,
        duration,
    )

    return response


@lru_cache(maxsize=1)
def get_dataset_summary() -> dict:
    dataset = load_dataset()

    target_counts = dataset[
        "Target"
    ].value_counts()

    return {
        "students": len(dataset),
        "features": len(
            dataset.columns
        ) - 1,
        "missing_values": int(
            dataset.isna()
            .sum()
            .sum()
        ),
        "classes": {
            "graduate": int(
                target_counts.get(
                    "Graduate",
                    0,
                )
            ),
            "dropout": int(
                target_counts.get(
                    "Dropout",
                    0,
                )
            ),
            "enrolled": int(
                target_counts.get(
                    "Enrolled",
                    0,
                )
            ),
        },
    }


@lru_cache(maxsize=1)
def get_dataset_exploration() -> dict:
    dataset = load_dataset()

    return build_exploration(
        dataset
    )


@app.get("/")
def root():
    return {
        "name": "noChurn API",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
    }


@app.get("/api/dataset/summary")
def dataset_summary():
    return get_dataset_summary()


@app.get("/api/dataset/exploration")
def dataset_exploration():
    return get_dataset_exploration()


@app.get("/api/models")
def models_analysis():
    logger.info(
        "MODELS | Endpoint chamado"
    )

    return get_models_analysis()


@app.get("/api/evaluation")
def evaluation_analysis():
    logger.info(
        "EVALUATION | Endpoint chamado"
    )

    return build_evaluation()


@app.get("/api/analysis/explainability")
def analysis_explainability():
    logger.info(
        "EXPLAINABILITY | Endpoint chamado"
    )

    return get_explainability()


@app.get("/api/analysis/stages")
def stage_experiment():
    logger.info(
        "STAGES | Endpoint chamado"
    )

    return get_stage_experiment()


@app.post("/api/simulation")
def simulation(
    simulation_request: SimulationRequest,
):
    logger.info(
        "SIMULATION | Endpoint chamado"
    )

    return predict_dropout(
        simulation_request.model_dump()
    )