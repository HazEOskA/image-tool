<#
.SYNOPSIS
    Hash phishing evidence safely (SHA256). Does NOT open attachments.

.DESCRIPTION
    Ensures a 'PHISHING_EVIDENCE' folder exists on the Desktop, then computes
    SHA256 hashes for every .eml and .pdf file placed inside it and writes a
    'hash_report.txt' alongside them.

    SAFETY / SCOPE:
      * Computes cryptographic hashes only — it reads file bytes to hash them.
      * Does NOT open, render, execute, or preview any attachment.
      * Does NOT enable macros or active content.
      * Does NOT connect to the network.

    WORKFLOW:
      1. Run this script once to create the Desktop\PHISHING_EVIDENCE folder.
      2. Manually copy your saved .eml and the (unopened) .pdf into that folder.
      3. Run the script again to generate hash_report.txt.

.EXAMPLE
    ./hash-evidence.ps1
#>

[CmdletBinding()]
param(
    # File extensions to hash. Add more only if you know they are inert.
    [string[]] $Extensions = @('.eml', '.pdf')
)

$desktop      = [Environment]::GetFolderPath('Desktop')
$evidenceDir  = Join-Path $desktop 'PHISHING_EVIDENCE'
$reportPath   = Join-Path $evidenceDir 'hash_report.txt'

# 1. Ensure the evidence folder exists.
if (-not (Test-Path -LiteralPath $evidenceDir)) {
    New-Item -ItemType Directory -Path $evidenceDir | Out-Null
    Write-Output "Created evidence folder: $evidenceDir"
    Write-Output "Place your .eml and (unopened) .pdf files there, then run again."
    return
}

# 2. Collect target files (do not open them — only enumerate + hash).
$files = Get-ChildItem -LiteralPath $evidenceDir -File |
    Where-Object { $Extensions -contains $_.Extension.ToLower() -and $_.Name -ne 'hash_report.txt' }

if (-not $files -or $files.Count -eq 0) {
    Write-Output "No $($Extensions -join ', ') files found in: $evidenceDir"
    Write-Output "Copy your evidence files into that folder and run again."
    return
}

# 3. Build the report.
$lines = @()
$lines += '============================================================'
$lines += ' PHISHING EVIDENCE — SHA256 HASH REPORT'
$lines += " Generated : $(Get-Date -Format s)"
$lines += " Folder    : $evidenceDir"
$lines += ' Note      : Files were hashed, NOT opened or executed.'
$lines += '============================================================'
$lines += ''

foreach ($file in $files) {
    try {
        $hash = Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256 -ErrorAction Stop
        $lines += "File   : $($file.Name)"
        $lines += "Size   : $($file.Length) bytes"
        $lines += "SHA256 : $($hash.Hash)"
        $lines += "Time   : $($file.LastWriteTime.ToString('s'))"
        $lines += ''
    }
    catch {
        $lines += "File   : $($file.Name)"
        $lines += "ERROR  : could not hash ($($_.Exception.Message))"
        $lines += ''
    }
}

$lines += '------------------------------------------------------------'
$lines += " Hashed $($files.Count) file(s)."
$lines += ' Keep this report with the evidence. Share hashes (not the live'
$lines += ' attachment) when reporting, unless a provider requests the sample.'
$lines += '------------------------------------------------------------'

# 4. Write report + echo to console.
$lines | Out-File -FilePath $reportPath -Encoding UTF8
$lines | ForEach-Object { Write-Output $_ }

Write-Output ""
Write-Output "Hash report written to: $reportPath"
