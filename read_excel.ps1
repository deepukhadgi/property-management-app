$filePath = "C:\Users\deepu.khadgi\.gemini\antigravity\scratch\property-management\YSMR Departure Cleaning (1).xlsx"
$tempDir = Join-Path $env:TEMP "excel_extract_$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir | Out-Null
Copy-Item $filePath "$tempDir\file.zip"
Expand-Archive -Path "$tempDir\file.zip" -DestinationPath "$tempDir\extracted" -Force

$xmlContent = Get-Content "$tempDir\extracted\xl\workbook.xml" -Raw
$regex = [regex]'<[^>]*name="([^"]+)"[^>]*>'
$matches = $regex.Matches($xmlContent)

Write-Host "Sheets found in the Excel file:"
foreach ($m in $matches) {
    # It might match other elements containing name="...", but usually in workbook.xml, sheets have name="...".
    Write-Host "- $($m.Groups[1].Value)"
}

Remove-Item -Recurse -Force $tempDir
