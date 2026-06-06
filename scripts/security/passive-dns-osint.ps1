<#
.SYNOPSIS
    Passive DNS OSINT collector. DNS queries ONLY.

.DESCRIPTION
    For each supplied domain, this script resolves public DNS records
    (A, AAAA, MX, NS, TXT, SOA) and the _dmarc TXT record, then writes a
    consolidated report to the Desktop as 'osint_dns_report.txt'.

    SAFETY / SCOPE:
      * Performs passive public DNS lookups via Resolve-DnsName only.
      * Does NOT scan ports, fingerprint, or connect to any target service.
      * Does NOT attempt any login or send any payload.
      * Reads public records only — the digital equivalent of a phone book.

.PARAMETER Domains
    One or more domains to look up.

.PARAMETER Server
    Optional public DNS resolver to query (e.g. 1.1.1.1 or 8.8.8.8).

.EXAMPLE
    ./passive-dns-osint.ps1 -Domains "st.ul.edu.lb","mail2art.com"

.EXAMPLE
    ./passive-dns-osint.ps1 -Domains "example.com" -Server 1.1.1.1
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string[]] $Domains,

    [Parameter(Mandatory = $false)]
    [string] $Server
)

# Record types to query (passive lookups only).
$recordTypes = @('A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA')

$desktop    = [Environment]::GetFolderPath('Desktop')
$reportPath = Join-Path $desktop 'osint_dns_report.txt'

# Build optional -Server splat so we don't pass an empty value.
$serverParam = @{}
if ($Server) { $serverParam['Server'] = $Server }

function Invoke-PassiveLookup {
    param(
        [string] $Name,
        [string] $Type
    )
    try {
        $result = Resolve-DnsName -Name $Name -Type $Type -ErrorAction Stop @serverParam
        return ($result | Format-Table -AutoSize | Out-String).TrimEnd()
    }
    catch {
        return "  (no $Type record found / lookup failed: $($_.Exception.Message))"
    }
}

# Header
$lines = @()
$lines += '============================================================'
$lines += ' PASSIVE DNS OSINT REPORT'
$lines += " Generated : $(Get-Date -Format s)"
if ($Server) { $lines += " Resolver  : $Server" }
$lines += ' Method    : Resolve-DnsName (DNS queries only; no scanning)'
$lines += '============================================================'
$lines += ''

foreach ($domain in $Domains) {
    $lines += '------------------------------------------------------------'
    $lines += " DOMAIN: $domain"
    $lines += '------------------------------------------------------------'

    foreach ($type in $recordTypes) {
        $lines += ""
        $lines += "[$type] $domain"
        $lines += (Invoke-PassiveLookup -Name $domain -Type $type)
    }

    # DMARC lives at _dmarc.<domain>
    $lines += ""
    $lines += "[DMARC] _dmarc.$domain (TXT)"
    $lines += (Invoke-PassiveLookup -Name "_dmarc.$domain" -Type 'TXT')

    $lines += ""
}

$lines += '============================================================'
$lines += ' End of report. Passive DNS only — no hosts were contacted'
$lines += ' beyond public DNS resolution.'
$lines += '============================================================'

# Write to Desktop and echo to console.
$lines | Out-File -FilePath $reportPath -Encoding UTF8
$lines | ForEach-Object { Write-Output $_ }

Write-Output ""
Write-Output "Report written to: $reportPath"
