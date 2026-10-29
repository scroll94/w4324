# Управление фоновым Telegram-ботом: on | off | start | stop | status
param([string]$Action = 'status')

$botDir   = $PSScriptRoot
$pythonw  = Join-Path $botDir '.venv\Scripts\pythonw.exe'
$shortcut = Join-Path ([Environment]::GetFolderPath('Startup')) 'Telegram AI Bot.lnk'

function Get-Bot {
    Get-CimInstance Win32_Process -Filter "Name='pythonw.exe' OR Name='python.exe'" |
        Where-Object { $_.CommandLine -like "*$botDir*bot.py*" -and $_.CommandLine -notlike '*--cli*' }
}

function Start-Bot {
    if (Get-Bot) { Write-Host 'Бот уже работает.'; return }
    Start-Process -FilePath $pythonw -ArgumentList 'bot.py' -WorkingDirectory $botDir -WindowStyle Hidden
    Write-Host 'Бот запущен в фоне. Лог: bot\bot.log'
}

function Stop-Bot {
    $p = Get-Bot
    if ($p) { $p | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }; Write-Host 'Бот остановлен.' }
    else { Write-Host 'Бот и так не запущен.' }
}

switch ($Action) {
    'on' {
        $ws = New-Object -ComObject WScript.Shell
        $lnk = $ws.CreateShortcut($shortcut)
        $lnk.TargetPath = $pythonw
        $lnk.Arguments = 'bot.py'
        $lnk.WorkingDirectory = $botDir
        $lnk.WindowStyle = 7
        $lnk.Description = 'Telegram AI bot (hackathon)'
        $lnk.Save()
        Write-Host 'Автозапуск включён: бот будет стартовать при входе в Windows.'
        Start-Bot
    }
    'off' {
        Remove-Item $shortcut -ErrorAction SilentlyContinue
        Write-Host 'Автозапуск выключен.'
        Stop-Bot
    }
    'start' { Start-Bot }
    'stop'  { Stop-Bot }
    default {
        Write-Host ('Автозапуск: ' + $(if (Test-Path $shortcut) { 'включён' } else { 'выключен' }))
        Write-Host ('Бот сейчас: ' + $(if (Get-Bot) { 'работает' } else { 'не запущен' }))
    }
}
