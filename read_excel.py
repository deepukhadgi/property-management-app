import zipfile
import xml.etree.ElementTree as ET
import sys
import os

filepath = r"C:\Users\deepu.khadgi\.gemini\antigravity\scratch\property-management\YSMR Departure Cleaning (1).xlsx"

if not os.path.exists(filepath):
    print("File not found.")
    sys.exit(1)

try:
    with zipfile.ZipFile(filepath, 'r') as z:
        workbook_xml = z.read('xl/workbook.xml')
        root = ET.fromstring(workbook_xml)
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        sheets = root.findall('.//ns:sheet', ns)
        
        print("--- SHEET LST ---")
        for sheet in sheets:
            print(f"Sheet: {sheet.get('name')}")
except Exception as e:
    print(f"Failed to read as xlsx: {e}")
