"""Виконання коду учня в Pyodide.

Один і той самий файл працює в браузері (Web Worker) і в перевірці контенту
(scripts/verify-content.mjs), тому очікуваний вивід вправ звіряється саме з тим,
що побачить учень.

Кожен запуск отримує свіжий простір імен. Перед кодом учня виконується преамбула
(дані задачі і еталонні розв'язки попередніх кроків) з придушеним виводом. Після
коду учня, якщо задано, виконується перевірка: Python-код з assert-ами, що бачить
змінні учня, його вивід (OUTPUT) і відкриті графіки (figures()).
"""

import base64
import contextlib
import io
import json
import linecache
import os
import sys
import traceback
import warnings

os.environ["MPLBACKEND"] = "Agg"

USER_FILE = "<твій код>"
CHECK_FILE = "<перевірка>"
MAX_OUTPUT = 200_000


class CheckFailed(AssertionError):
    """Перевірка не пройдена: повідомлення показується учню як є."""


def _no_input(prompt=""):
    raise RuntimeError("input() у тренажері недоступний: задай значення прямо в коді")


def _configure_libraries():
    pd = sys.modules.get("pandas")
    if pd is not None:
        pd.set_option("display.width", 100)
        pd.set_option("display.max_columns", 20)
    warnings.filterwarnings("ignore", message=".*non-interactive.*")
    warnings.filterwarnings("ignore", message=".*cannot be shown.*")


def _imports_of(sources):
    try:
        from pyodide.code import find_imports
    except ImportError:
        return set()
    names = set()
    for source in sources:
        try:
            names.update(find_imports(source))
        except Exception:  # noqa: BLE001 - синтаксичну помилку покаже сам запуск
            pass
    return names


def _preload(sources):
    """Імпортує pandas до запуску, щоб параметри показу діяли з першого print."""
    if "pandas" in _imports_of(sources):
        try:
            __import__("pandas")
        except ImportError:
            pass
    _configure_libraries()


def _register_source(filename, code):
    linecache.cache[filename] = (len(code), None, code.splitlines(True), filename)


def _format_error(exc, filename):
    if isinstance(exc, SyntaxError):
        return "".join(traceback.format_exception_only(type(exc), exc))
    frames = [f for f in traceback.extract_tb(exc.__traceback__) if f.filename == filename]
    parts = ["Traceback (most recent call last):\n"]
    parts += traceback.format_list(frames)
    parts += traceback.format_exception_only(type(exc), exc)
    return "".join(parts)


def _close_figures():
    plt = sys.modules.get("matplotlib.pyplot")
    if plt is not None:
        plt.close("all")


def _open_figures():
    plt = sys.modules.get("matplotlib.pyplot")
    if plt is None:
        return []
    return [plt.figure(num) for num in plt.get_fignums()]


def _grab_images():
    images = []
    for fig in _open_figures():
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=96, bbox_inches="tight")
        images.append(base64.b64encode(buf.getvalue()).decode("ascii"))
    _close_figures()
    return images


def _clip(text):
    if len(text) > MAX_OUTPUT:
        return text[:MAX_OUTPUT], True
    return text, False


# ---- помічники для перевірок (доступні в коді перевірки) ----

def expect(condition, message="Перевірка не пройдена"):
    if not condition:
        raise CheckFailed(message)


def approx(actual, expected, tol=1e-6):
    try:
        return abs(float(actual) - float(expected)) <= tol * max(1.0, abs(float(expected)))
    except (TypeError, ValueError):
        return False


def _make_need(ns):
    def need(name, kind=None):
        if name not in ns:
            raise CheckFailed(f"Не знайдено змінну `{name}`: створи її у своєму коді")
        value = ns[name]
        if kind is not None and not isinstance(value, kind):
            names = kind.__name__ if isinstance(kind, type) else " або ".join(k.__name__ for k in kind)
            raise CheckFailed(f"`{name}` має бути типу {names}, а зараз {type(value).__name__}")
        return value
    return need


def run(payload):
    code = payload.get("code", "")
    prelude = payload.get("prelude") or []
    check = payload.get("check")
    _preload([code, check or "", *prelude])

    result = {
        "stdout": "",
        "stderr": "",
        "error": None,
        "errorType": None,
        "errorLine": None,
        "check": None,
        "images": [],
        "truncated": False,
    }

    ns = {"__name__": "__main__", "input": _no_input}
    _close_figures()

    for index, block in enumerate(prelude):
        name = f"<підготовка {index + 1}>"
        _register_source(name, block)
        sink = io.StringIO()
        try:
            with contextlib.redirect_stdout(sink), contextlib.redirect_stderr(sink):
                exec(compile(block, name, "exec"), ns)
        except BaseException as exc:  # noqa: BLE001 - показуємо будь-яку помилку підготовки
            result["error"] = "Помилка в підготовці задачі:\n" + _format_error(exc, name)
            result["errorType"] = "PreludeError"
            return result
    _close_figures()
    _configure_libraries()

    _register_source(USER_FILE, code)
    out, err = io.StringIO(), io.StringIO()
    try:
        with warnings.catch_warnings():
            _configure_libraries()
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
                exec(compile(code, USER_FILE, "exec"), ns)
    except BaseException as exc:  # noqa: BLE001 - SystemExit теж показуємо учню
        result["error"] = _format_error(exc, USER_FILE)
        result["errorType"] = type(exc).__name__
        line = getattr(exc, "lineno", None) if isinstance(exc, SyntaxError) else None
        if line is None:
            user_frames = [f for f in traceback.extract_tb(exc.__traceback__) if f.filename == USER_FILE]
            line = user_frames[-1].lineno if user_frames else None
        result["errorLine"] = line

    result["stdout"], clipped_out = _clip(out.getvalue())
    result["stderr"], clipped_err = _clip(err.getvalue())
    result["truncated"] = clipped_out or clipped_err

    if check and result["error"] is None:
        check_ns = dict(ns)
        check_ns.update({
            "OUTPUT": result["stdout"],
            "expect": expect,
            "approx": approx,
            "need": _make_need(ns),
            "figures": _open_figures,
            "CheckFailed": CheckFailed,
        })
        _register_source(CHECK_FILE, check)
        sink = io.StringIO()
        try:
            with contextlib.redirect_stdout(sink), contextlib.redirect_stderr(sink):
                exec(compile(check, CHECK_FILE, "exec"), check_ns)
            result["check"] = {"ok": True, "message": ""}
        except AssertionError as exc:
            result["check"] = {"ok": False, "message": str(exc) or "Перевірка не пройдена"}
        except Exception as exc:  # noqa: BLE001 - збій перевірки = не зараховано
            result["check"] = {"ok": False, "message": f"Перевірка не змогла оцінити результат: {type(exc).__name__}: {exc}"}

    try:
        result["images"] = _grab_images()
    except Exception as exc:  # noqa: BLE001
        result["stderr"] += f"\n[графік не вдалося показати: {exc}]"
    return result


def run_json(payload_json):
    return json.dumps(run(json.loads(payload_json)), ensure_ascii=False)
