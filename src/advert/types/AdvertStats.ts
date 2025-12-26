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
type NmStats = {
  atbs: number;
  canceled: number;
  clicks: number;
  cpc: number;
  cr: number;
  ctr: number;
  name: string;
  nmId: number;
  orders: number;
  shks: number;
  sum: number;
  sum_price: number;
  views: number;
};

type AppStats = {
  appType: number;
  atbs: number;
  canceled: number;
  clicks: number;
  cpc: number;
  cr: number;
  ctr: number;
  nms: NmStats[];
  orders: number;
  shks: number;
  sum: number;
  sum_price: number;
  views: number;
};

type DayStats = {
  apps: AppStats[];
  atbs: number;
  canceled: number;
  clicks: number;
  cpc: number;
  cr: number;
  ctr: number;
  date: string;
  orders: number;
  shks: number;
  sum: number;
  sum_price: number;
  views: number;
};

type BoosterStats = {
  avg_position: number;
  date: string;
  nm: number;
};

type AdvertStats = {
  advertId: number;
  atbs: number;
  boosterStats: BoosterStats[];
  canceled: number;
  clicks: number;
  cpc: number;
  cr: number;
  ctr: number;
  days: DayStats[];
  orders: number;
  shks: number;
  sum: number;
  sum_price: number;
  views: number;
};
