from functools import lru_cache
from pathlib import Path

import pandas as pd


project_root = Path(__file__).resolve().parents[3]
dataset_path = project_root / "data" / "raw" / "data.csv"


@lru_cache(maxsize=1)
def load_dataset() -> pd.DataFrame:
    return pd.read_csv(dataset_path, sep=";")