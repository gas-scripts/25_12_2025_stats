/**
 * Copyright 2025 Ogolknev Nikita
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { SALES_SHEET_NAME } from '../sheets';
import { hasSameHeaders, splitDateTimeColumns } from '../utils/splitDateTimeColumns';

export default function (sales: Sale[], sheetName = SALES_SHEET_NAME) {
  if (!sales.length) return;

  const normalizedSales = splitDateTimeColumns(sales);
  const nextHeaders = Object.keys(normalizedSales[0]);
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName) ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);

  let headers: string[] = [];

  if (sheet.getLastColumn() > 0) {
    headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0] as string[];
  }

  if (!headers[0] || !hasSameHeaders(headers, nextHeaders)) {
    sheet.clear();
    headers = nextHeaders;
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet
    .getRange(sheet.getLastRow() + 1, 1, normalizedSales.length, headers.length)
    .setValues(normalizedSales.map(sale => headers.map(header => sale[header])));
}
