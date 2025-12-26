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
type BidsKopecks = {
  recommendations: number;
  search: number;
};

type Subject = {
  id: number;
  name: string;
};

type NmSettings = {
  bids_kopecks: BidsKopecks;
  nm_id: number;
  subject: Subject;
};

type Placements = {
  recommendations: boolean;
  search: boolean;
};

type Timestamps = {
  created: string;
  deleted: string;
  started: string | null;
  updated: string;
};

type AdvertSettings = {
  name: string;
  payment_type: 'cpm' | 'cpc';
  placements: Placements;
};

type Advert = {
  bid_type: 'manual' | 'unified';
  id: number;
  nm_settings: NmSettings[];
  settings: AdvertSettings;
  status: number;
  timestamps: Timestamps;
};
