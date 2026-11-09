# Ярлик «Python тренажер» на робочому столі: node запускає scripts/start.mjs.
# Повторний запуск оновлює наявний ярлик. Файл зберігається в UTF-8 з BOM: без нього
# PowerShell 5.1 читає кирилицю як ANSI.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$path = Join-Path ([Environment]::GetFolderPath('Desktop')) 'Python тренажер.lnk'

$shell = New-Object -ComObject WScript.Shell
$link = $shell.CreateShortcut($path)
$link.TargetPath = (Get-Command node).Source
$link.Arguments = '"' + (Join-Path $PSScriptRoot 'start.mjs') + '"'
$link.WorkingDirectory = $root
$link.IconLocation = (Join-Path $PSScriptRoot 'trainer.ico') + ',0'
$link.Description = 'Тренажер Python для дата-аналітика: уроки, вправи і задачі'
$link.WindowStyle = 1
$link.Save()

$saved = $shell.CreateShortcut($path)
"Ярлик:  $path"
"Запуск: $($saved.TargetPath) $($saved.Arguments)"
"Тека:   $($saved.WorkingDirectory)"
"Значок: $($saved.IconLocation)"
