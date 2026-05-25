import logging.config
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)
VULCAN_SCHEDULE_HTML_FILENAME = os.environ.get("VULCAN_SCHEDULE_HTML_FILENAME", "Zastępstwa.html")
REPLACEMENTS_FILENAME = os.environ.get("REPLACEMENTS_FILENAME", "replacements.json")

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "INFO",
            "stream": "ext://sys.stdout",
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": str(LOG_DIR / "parser.log"),
            "formatter": "standard",
            "level": "DEBUG",
            "encoding": "utf-8",
        },
    },
    "loggers": {
        "": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": True,
        },
        "aiohttp": {"level": "WARNING"},
    },
}


def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)
