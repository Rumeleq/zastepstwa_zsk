import json
import logging
from pathlib import Path

from bs4 import BeautifulSoup

from settings import VULCAN_SCHEDULE_HTML_FILENAME as FILENAME
from settings import setup_logging

logger = logging.getLogger(__name__)


class MissingParserSourceError(FileNotFoundError):
    """Wyjątek rzucany, gdy parser nie znajdzie pliku HTML."""

    pass


def get_html_source(filename: str) -> Path:
    target_path = Path(__file__).parent.parent / "data" / filename
    input_path = target_path if target_path.is_file() else next(target_path.parent.glob("*.html"), None)

    if input_path is None:
        error_msg = f"Brak pliku! Nie znaleziono '{filename}', ani żadnego pliku *.html w: {target_path.parent}"
        logger.error(error_msg)
        raise MissingParserSourceError(error_msg)

    logger.info(f"Znaleziono plik źródłowy do parsowania: {input_path.name}")
    return input_path


def get_date(soup: BeautifulSoup) -> str:
    date_header = soup.find("h2")
    if date_header:
        return str(date_header.text).split(" ")[1]
    return "Brak daty"


def get_replacements(soup: BeautifulSoup) -> dict:
    rows = soup.find_all("tr")
    rows_data = [row.find_all("td") for row in rows]

    del rows_data[:2]

    replacements = {}
    for row in rows_data:
        if len(row) < 6:
            continue

        lesson_info = [col.text.strip() for col in row]
        teacher = lesson_info.pop(5)  # copy the substitute teacher, remove them from lesson info

        if teacher not in replacements:
            replacements[teacher] = [lesson_info]
        else:
            replacements[teacher].append(lesson_info)

    return replacements


def save_to_json(schedule_date: str, replacements_data: dict, output_path: str = "replacements.json") -> None:
    """Zapisuje sparsowaną datę i zastępstwa do pliku JSON."""
    data_to_export = {"date": schedule_date, "replacements": replacements_data}

    with open(output_path, "w", encoding="utf-8") as json_file:
        json.dump(data_to_export, json_file, ensure_ascii=False, indent=4)

    logger.info(f"Pomyślnie zapisano dane do pliku: {output_path}")


def main():
    try:
        input_path = get_html_source(FILENAME)
    except MissingParserSourceError:
        return None

    with open(input_path, encoding="utf-8") as html_file:
        soup = BeautifulSoup(html_file.read(), "lxml")

    replacements_data = get_replacements(soup)
    schedule_date = get_date(soup)

    logger.info(f"Pomyślnie sparsowano zastępstwa. Data: {schedule_date}, liczba nauczycieli: {len(replacements_data)}")

    return schedule_date, replacements_data


if __name__ == "__main__":
    setup_logging()

    result = main()

    if result:
        parsed_date, parsed_replacements = result
        save_to_json(parsed_date, parsed_replacements)
