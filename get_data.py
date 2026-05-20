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
    target_path = Path(filename)
    input_path = target_path if target_path.is_file() else next(Path().glob("*.html"), None)

    if input_path is None:
        error_msg = f"Brak pliku! Nie znaleziono '{filename}', ani żadnego pliku *.html w: {Path().absolute()}"
        logger.error(error_msg)
        raise MissingParserSourceError(error_msg)

    return input_path


def get_date(soup: BeautifulSoup) -> str:
    data_header = soup.find("h2")
    if data_header:
        return str(data_header.text).split(" ")[1]
    return "Brak daty"


def get_replacements(soup: BeautifulSoup) -> dict:
    rows = soup.find_all("tr")
    data = [row.find_all("td") for row in rows]

    del data[:2]

    replacements = {}
    for row in data:
        if len(row) < 6:
            continue

        lesson_info = [col.text.strip() for col in row]
        teacher = lesson_info.pop(5)

        if teacher not in replacements:
            replacements[teacher] = [lesson_info]
        else:
            replacements[teacher].append(lesson_info)

    return replacements


def main():
    try:
        input_path = get_html_source(FILENAME)
    except MissingParserSourceError:
        return None

    with open(input_path, encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "lxml")

    zastepstwa_data = get_replacements(soup)
    data_zastepstw = get_date(soup)

    return data_zastepstw, zastepstwa_data


if __name__ == "__main__":
    setup_logging()

    result = main()

    if result:
        parsed_date, parsed_replacements = result
        print(f"Data: {parsed_date}")
        print(parsed_replacements)
