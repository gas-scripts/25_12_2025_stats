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
import { FUNNEL_SHEET_NAME } from '../sheets';

export default function (funnelStats: FunnelStats[], sheetName = FUNNEL_SHEET_NAME) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      sheetName
    ) ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);

  const normalizedFunnelStats = normalizeFunnelStats(funnelStats);

  let headers: string[] = [];

  if (sheet.getLastColumn() > 0)
    headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0] as string[];
  if (!headers[0] || typeof headers[0] !== 'string') {
    sheet.clear();
    headers = Object.keys(normalizedFunnelStats[0]);
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet
    .getRange(sheet.getLastRow() + 1, 1, normalizedFunnelStats.length, headers.length)
    .setValues(
      normalizedFunnelStats.map(stat => headers.map(header => stat[header as keyof typeof stat]))
    );
}

function normalizeFunnelStats(funnelStats: FunnelStats[]) {
  console.log(`Нормализация статистики воронки на ${funnelStats.length} продуктов`);

  return funnelStats.flatMap(product =>
    product.history.map(day => ({
      nmId: product.product.nmId,
      title: product.product.title,
      vendorCode: product.product.vendorCode,
      brandName: product.product.brandName,
      subjectName: product.product.subjectName,
      date: day.date,
      openCount: day.openCount,
      cartCount: day.cartCount,
      orderCount: day.orderCount,
      orderSum: day.orderSum,
      buyoutCount: day.buyoutCount,
      buyoutSum: day.buyoutSum,
      buyoutPercent: day.buyoutPercent,
      addToCartConversion: day.addToCartConversion,
      cartToOrderConversion: day.cartToOrderConversion,
      addToWishlistCount: day.addToWishlistCount,
    }))
  );
}
