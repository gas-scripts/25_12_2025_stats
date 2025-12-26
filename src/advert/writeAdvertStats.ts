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
import { ADVERT_SHEET_NAME } from '../sheets';

export default function writeAdvertStatsToSheet(advertStats: any[]) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ADVERT_SHEET_NAME) ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(ADVERT_SHEET_NAME);

  const normalizedAdvertStats = normalizeAdvertStats(advertStats);

  let headers: string[] = [];

  if (sheet.getLastColumn() > 0)
    headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0] as string[];
  if (!headers[0] || typeof headers[0] !== 'string') {
    sheet.clear();
    headers = Object.keys(normalizedAdvertStats[0]);
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet
    .getRange(sheet.getLastRow() + 1, 1, normalizedAdvertStats.length, headers.length)
    .setValues(
      normalizedAdvertStats.map(stat => headers.map(header => stat[header as keyof typeof stat]))
    );
}


function normalizeAdvertStats(stats: AdvertStats[]) {
  return stats.flatMap(advert =>
    advert.days.flatMap(day =>
      day.apps.flatMap(app =>
        app.nms.map(nm => ({
          advertId: advert.advertId,
          date: day.date,
          appType: app.appType,
          nmId: nm.nmId,
          nmName: nm.name,
          clicks: nm.clicks,
          views: nm.views,
          ctr: nm.ctr,
          orders: nm.orders,
          sum: nm.sum,
          sum_price: nm.sum_price,
        }))
      )
    )
  );
}
