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
import { STOCKS_SHEET_NAME } from '../sheets';

export default function (stocks: Stock[], sheetName = STOCKS_SHEET_NAME) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName) ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);

  sheet.clear();

  const headers = Object.keys(stocks[0]);

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet
    .getRange(2, 1, stocks.length, headers.length)
    .setValues(
      stocks.map(stock => headers.map(header => stock[header as keyof Stock]))
    );
}
