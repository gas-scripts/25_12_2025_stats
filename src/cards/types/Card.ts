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
type Card = {
  nmID: number;
  imtID: number;
  nmUUID: string;
  subjectID: number;
  subjectName: string;
  vendorCode: string;
  brand: string;
  title: string;
  description: string;
  needKiz: boolean;
  photos: Array<{
    big: string;
    c246x328: string;
    c516x688: string;
    square: string;
    tm: string;
  }>;
  video?: string;
  wholesale: {
    enabled: boolean;
    quantum: number;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    weightBrutto: number;
    isValid: boolean;
  };
  characteristics: Array<{
    id: number;
    name: string;
    value: string[];
  }>;
  sizes: Array<{
    chrtID: number;
    techSize: string;
    skus: string[];
  }>;
  tags: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  createdAt: string;
  updatedAt: string;
};
