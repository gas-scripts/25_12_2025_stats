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
import getAdverts from './getAdverts';

export default function (start: string, end: string): AdvertStats[] {
  const advertIds = getAdverts().map(advert => advert.id);
  const allStats: AdvertStats[] = [];
  const BATCH_SIZE = 50;

  for (let i = 0; i < advertIds.length; i += BATCH_SIZE) {
    const batch = advertIds.slice(i, i + BATCH_SIZE);
    console.log(
      `FullStats батч ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} advertId`
    );

    const response = UrlFetchApp.fetch(
      `https://advert-api.wildberries.ru/adv/v3/fullstats?beginDate=${start}&endDate=${end}&ids=${batch.join(',')}`,
      {
        headers: {
          Authorization: getApiKey(),
        }
      }
    );

    const content = response.getContentText();
    const batchStats: AdvertStats[] = JSON.parse(content);

    console.log(`FullStats ответ батча: ${batchStats.length} записей`);

    allStats.push(...batchStats);
  }

  return allStats;
}
