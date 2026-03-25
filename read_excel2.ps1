$filePath = "C:\Users\deepu.khadgi\.gemini\antigravity\scratch\property-management\YSMR Departure Cleaning (1).xlsx"
$tempDir = Join-Path $env:TEMP "ex_$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir | Out-Null
Copy-Item $filePath "$tempDir\f.zip"
Expand-Archive -Path "$tempDir\f.zip" -DestinationPath "$tempDir\ext" -Force

$xmlContent = Get-Content "$tempDir\ext\xl\workbook.xml" -Raw
$regex = [regex]'<sheet[^>]*name="([^"]+)"'
$matches = $regex.Matches($xmlContent)

$output = "Sheets:`n"
foreach ($m in $matches) {
    $output += "- $($m.Groups[1].Value)`n"
}
$output | Out-File "C:\Users\deepu.khadgi\.gemini\antigravity\scratch\property-management\sheets.txt" -Encoding utf8
Remove-Item -Recurse -Force $tempDir
