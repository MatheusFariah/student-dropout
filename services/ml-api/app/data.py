import logging
import time
from functools import lru_cache
from pathlib import Path

import pandas as pd


logger = logging.getLogger("nochurn")

api_root = Path(__file__).resolve().parents[1]

dataset_path = (
    api_root
    / "data"
    / "raw"
    / "data.csv"
)


@lru_cache(maxsize=1)
def load_dataset() -> pd.DataFrame:
    started_at = time.perf_counter()

    logger.info(
        "DATASET | Iniciando leitura de %s",
        dataset_path,
    )

    dataset = pd.read_csv(
        dataset_path,
        sep=";",
    )

    duration = (
        time.perf_counter()
        - started_at
    )

    logger.info(
        "DATASET | Carregado | rows=%s | columns=%s | %.3fs",
        len(dataset),
        len(dataset.columns),
        duration,
    )

    return dataset