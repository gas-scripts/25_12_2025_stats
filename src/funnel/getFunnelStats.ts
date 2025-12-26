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
import getApiKey from '../auth/getApiKey';
import getCards from '../cards/getCards';

export default function (start: string, end: string): FunnelStats[] {
  const allNmIds = getCards().map(card => card.nmID);
  const allStats: FunnelStats[] = [];
  const BATCH_SIZE = 20;

  for (let i = 0; i < allNmIds.length; i += BATCH_SIZE) {
    const batch = allNmIds.slice(i, i + BATCH_SIZE);

    console.log(
      `Батч ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} товаров`
    );

    const response = UrlFetchApp.fetch(
      'https://seller-analytics-api.wildberries.ru/api/analytics/v3/sales-funnel/products/history',
      {
        method: 'post',
        headers: {
          'Authorization': getApiKey(),
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify({
          selectedPeriod: {
            start: start,
            end: end,
          },
          nmIds: batch,
        }),
        muteHttpExceptions: true,
      }
    );

    const content = response.getContentText();

    const batchStats: FunnelStats[] = JSON.parse(content);
    allStats.push(...batchStats);

    console.log(allStats);

    Utilities.sleep(1000 * 20);
  }

  return allStats;
}
