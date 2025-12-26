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
import getApiKey from "../auth/getApiKey";


type CardsResponse = {
  cards: Card[];
  cursor: {
    updatedAt: string;
    nmID: number;
    total: number;
  };
};

type Cursor = {
  updatedAt?: string;
  nmID: number;
  limit: number;
};

export default function (): Card[] {
  const baseUrl = 'https://content-api.wildberries.ru/content/v2/get/cards/list';
  const allCards: Card[] = [];
  let cursor: Cursor | null = {
    nmID: 0,
    limit: 100
  };

  while (true) {
    const requestBody = {
      settings: {
        cursor,
        filter: {
          withPhoto: -1
        }
      }
    };

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      headers: {
        'Authorization': getApiKey(),
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(requestBody)
    };

    const response = UrlFetchApp.fetch(baseUrl, options);
    
    if (response.getResponseCode() !== 200) {
      console.error('WB API error:', response.getContentText());
      throw new Error(`HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
    }

    const data: CardsResponse = JSON.parse(response.getContentText());
    allCards.push(...data.cards);

    console.log(`Получено ${data.cards.length} карточек. Всего: ${allCards.length}. Total: ${data.cursor.total}`);

    // Проверяем пагинацию
    if (data.cursor.total < cursor.limit) {
      break;
    }

    cursor = {
      updatedAt: data.cursor.updatedAt,
      nmID: data.cursor.nmID,
      limit: 100
    };
  }

  return allCards;
}
