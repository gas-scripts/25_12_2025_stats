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
const DATE_TIME_REGEX =
  /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?)(?:Z|[+-]\d{2}:\d{2})?$/;

type SheetRow = Record<string, unknown>;

export function splitDateTimeColumns<T extends SheetRow>(rows: T[]) {
  return rows.map(splitDateTimeInRow);
}

function splitDateTimeInRow(row: SheetRow) {
  const formatted: SheetRow = {};

  Object.entries(row).forEach(([key, value]) => {
    if (typeof value !== 'string') {
      formatted[key] = value;
      return;
    }

    const match = value.match(DATE_TIME_REGEX);

    if (!match) {
      formatted[key] = value;
      return;
    }

    const [, date, time] = match;
    formatted[`${key}Date`] = date;
    formatted[`${key}Time`] = time;
  });

  return formatted;
}

export function hasSameHeaders(existingHeaders: string[], nextHeaders: string[]) {
  return (
    existingHeaders.length === nextHeaders.length &&
    existingHeaders.every((header, index) => header === nextHeaders[index])
  );
}
