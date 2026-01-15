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
import getAdvertStats from './advert/getAdvertStats';
import writeAdvertStatsToSheet from './advert/writeAdvertStats';
import getCards from './cards/getCards';
import getFunnelStats from './funnel/getFunnelStats';
import writeFunnelStats from './funnel/writeFunnelStats';
import getOrders from './orders/getOrders';
import writeOrders from './orders/writeOrders';
import getSales from './sales/getSales';
import writeSales from './sales/writeSales';
import getStocks from './stocks/getStocks';
import writeStocks from './stocks/writeStocks';
import { ADVERT_SHEET_NAME, FUNNEL_SHEET_NAME, ORDERS_SHEET_NAME, SALES_SHEET_NAME, SETTINGS_SHEET_NAME, STOCKS_SHEET_NAME } from './sheets';

const VALUE_COLUMN = 2;
const START_DATE_ROW = 5;
const END_DATE_ROW = 6;

function updateStocks(sheetName?: string) {
  const stocks = getStocks();
  writeStocks(stocks, sheetName);
}

function loadOrders(date: string, sheetName?: string) {
  let orders = getOrders();
  orders = orders.filter(order => order.date.startsWith(date));
  writeOrders(orders, sheetName);
}

function loadSales(date: string, sheetName?: string) {
  let sales = getSales();
  sales = sales.filter(sale => sale.date.startsWith(date));
  writeSales(sales, sheetName);
}

function loadFunnelStats(start: string, end: string, sheetName?: string) {
  const funnelStats = getFunnelStats(start, end);
  writeFunnelStats(funnelStats, sheetName);
}

function loadAdvertStats(start: string, end: string, sheetName?: string) {
  const advertStats = getAdvertStats(start, end);
  writeAdvertStatsToSheet(advertStats, sheetName);
}

function getSettingsSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SETTINGS_SHEET_NAME
  );
}

function getYesterday() {
  const tz = Session.getScriptTimeZone();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return Utilities.formatDate(yesterday, tz, 'yyyy-MM-dd');
}

function normalizeDate(value: unknown) {
  const tz = Session.getScriptTimeZone();

  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, tz, 'yyyy-MM-dd');
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed) {
      const parsed = new Date(trimmed);
      if (!isNaN(parsed.getTime())) {
        return Utilities.formatDate(parsed, tz, 'yyyy-MM-dd');
      }
      return trimmed;
    }
  }

  return '';
}

function getDateOrYesterday(range: GoogleAppsScript.Spreadsheet.Range) {
  const rawValue = range.getValue();
  const resolved = normalizeDate(rawValue);
  return resolved || getYesterday();
}

function getStartDateFromSettings() {
  const sheet = getSettingsSheet();
  if (!sheet) return getYesterday();
  return getDateOrYesterday(sheet.getRange(START_DATE_ROW, VALUE_COLUMN));
}

function getEndDateFromSettings() {
  const sheet = getSettingsSheet();
  if (!sheet) return getYesterday();
  return getDateOrYesterday(sheet.getRange(END_DATE_ROW, VALUE_COLUMN));
}

function isTriggerEnabled() {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty('triggerEnabled') === 'true';
}

function setTriggerEnabled(enabled: boolean) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('triggerEnabled', enabled.toString());
}

function onOpen() {
  createSettingsSheet();

  const triggerEnabled = isTriggerEnabled();
  const menuTitle = triggerEnabled ? 'wbapi' : '⚠️ wbapi';

  const menu = SpreadsheetApp.getUi()
    .createMenu(menuTitle)
    .addItem('Обновить остатки', 'menuUpdateStocks')
    .addSeparator()
    .addItem('Загрузить заказы', 'menuLoadOrders')
    .addItem('Загрузить продажи', 'menuLoadSales')
    .addItem('Загрузить статистику воронок', 'menuLoadFunnelStats')
    .addItem('Загрузить статистику рекламы', 'menuLoadAdvertStats')
    .addSeparator()
    .addItem('🔑 Обновить API ключ', 'menuUpdateApiKey');

  if (!triggerEnabled) {
    menu
      .addSeparator()
      .addItem('📅 Установить ежедневный запуск', 'menuSetupDailyTrigger');
  }

  menu.addToUi();
}

function menuUpdateStocks() {
  updateStocks(STOCKS_SHEET_NAME + "(Ручной вызов)");
}

function menuLoadOrders() {
  const date = getStartDateFromSettings();
  loadOrders(date, ORDERS_SHEET_NAME + "(Ручной вызов)");
}

function menuLoadSales() {
  const date = getStartDateFromSettings();
  loadSales(date, SALES_SHEET_NAME + "(Ручной вызов)");
}

function menuLoadFunnelStats() {
  const start = getStartDateFromSettings();
  const end = getEndDateFromSettings();
  loadFunnelStats(start, end, FUNNEL_SHEET_NAME + "(Ручной вызов)");
}

function menuLoadAdvertStats() {
  const start = getStartDateFromSettings();
  const end = getEndDateFromSettings();
  loadAdvertStats(start, end, ADVERT_SHEET_NAME + "(Ручной вызов)");
}

function menuSetupDailyTrigger() {
  const handler = 'dailyAutoRun';
  const triggers = ScriptApp.getProjectTriggers();
  const triggerAlreadyExists = triggers.some(
    t => t.getHandlerFunction() === handler
  );
  if (triggerAlreadyExists) {
    SpreadsheetApp.getUi().alert(
      'Ежедневный запуск уже установлен на 4:00 утра'
    );
    return;
  }
  setupDailyTrigger();
  SpreadsheetApp.getUi().alert('Ежедневный запуск установлен на 4:00 утра');
}

function menuUpdateApiKey() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Введите ваш API ключ Wildberries:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() === ui.Button.CANCEL) {
    return;
  }

  if (response.getSelectedButton() === ui.Button.OK) {
    const apiKey = response.getResponseText().trim();
    if (apiKey) {
      PropertiesService.getScriptProperties().setProperty('API_KEY', apiKey);
      ui.alert('✅ API ключ успешно обновлён');
      Logger.log('API ключ обновлён');
    } else {
      ui.alert('❌ API ключ не может быть пустым');
    }
  }
}

function printCards() {
  console.log(getCards());
}

function isAutoRunEnabled() {
  const sheet = getSettingsSheet();
  if (!sheet) return false;
  const value = sheet.getRange(4, VALUE_COLUMN).getValue();
  return !!value;
}

function dailyAutoRun() {
  if (!isAutoRunEnabled()) {
    Logger.log('Автозапуск отключен настройками.');
    return;
  }

  const date = getYesterday();

  // // Без даты
  // updateStocks();

  // С одной датой (начало)
  loadOrders(date);
  loadSales(date);

  // С двумя датами (начало и конец одинаковые — вчера)
  loadFunnelStats(date, date);
  loadAdvertStats(date, date);
}

function setupDailyTrigger() {
  const handler = 'dailyAutoRun';
  const triggers = ScriptApp.getProjectTriggers();
  const exists = triggers.some(t => t.getHandlerFunction() === handler);
  if (!exists) {
    ScriptApp.newTrigger(handler).timeBased().atHour(4).everyDays(1).create();
    setTriggerEnabled(true);
    Logger.log('Триггер ежедневного запуска установлен на 4:00');
  }
}

function createSettingsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SETTINGS_SHEET_NAME);
  if (sheet) {
    return;
  }

  sheet = ss.insertSheet(SETTINGS_SHEET_NAME);

  // Заголовок "Настройки интеграции Wildberries" с акцентом
  const titleRange = sheet.getRange(1, 1, 1, 2);
  titleRange.setValues([['Настройки интеграции Wildberries', '']]);
  titleRange.setFontWeight('bold');
  titleRange.setFontSize(13);
  titleRange.setVerticalAlignment('middle');
  titleRange.setBackground('#F5F0FF');
  titleRange.setFontColor('#333333');

  // Применяем фиолетовый цвет к Wildberries через форматирование
  titleRange.setFontColor('#6B4C9A');

  // Пометка о ручном запуске
  const noteRange = sheet.getRange(2, 1, 1, 2);
  noteRange.setValues([
    ['Примечание: ручной запуск доступен в меню сверху', ''],
  ]);
  noteRange.setFontSize(10);
  noteRange.setFontColor('#888888');
  noteRange.setBackground('#FFFFFF');
  noteRange.setFontStyle('italic');

  // Заголовок таблицы параметров
  const headerRange = sheet.getRange(3, 1, 1, 2);
  headerRange.setValues([['Параметр', 'Значение']]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#6B4C9A');
  headerRange.setFontColor('white');
  headerRange.setFontSize(12);
  headerRange.setVerticalAlignment('middle');

  // Настройки с данными (сдвинули на строку ниже)
  const values = [
    ['Включить автозапуск ежедневный', false],
    ['Дата начала периода', '2025-12-20'],
    ['Дата конца периода', '2025-12-25'],
  ];

  // Добавляем данные
  sheet.getRange(4, 1, values.length, 2).setValues(values);

  // Форматирование для всех ячеек данных
  const dataRange = sheet.getRange(4, 1, values.length, 2);
  dataRange.setBackground('#FAFAFA');
  dataRange.setBorder(
    true,
    true,
    true,
    true,
    true,
    true,
    '#D3D3D3',
    SpreadsheetApp.BorderStyle.SOLID
  );
  dataRange.setFontSize(11);
  dataRange.setVerticalAlignment('middle');

  // Форматирование для первого столбца (параметры)
  sheet.getRange(4, 1, values.length, 1).setFontColor('#333333');
  sheet.getRange(4, 1, values.length, 1).setHorizontalAlignment('left');

  // Форматирование для второго столбца (значения)
  const valueColumn = sheet.getRange(4, 2, values.length, 1);
  valueColumn.setHorizontalAlignment('center');
  valueColumn.setBackground('#FFFFFF');

  // Чекбокс для автозапуска (строка 4, колонна 2)
  const checkboxRange = sheet.getRange(4, 2);
  checkboxRange.insertCheckboxes();

  // Форматирование дат
  sheet.getRange(5, 2).setNumberFormat('yyyy-mm-dd');
  sheet.getRange(6, 2).setNumberFormat('yyyy-mm-dd');

  // Настройка ширины столбцов
  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 180);

  // Отступы и отформатированный вид
  sheet.setRowHeight(1, 32);
  sheet.setRowHeight(2, 28);
  sheet.setRowHeight(3, 28);
  sheet.setRowHeight(4, 28);
  sheet.setRowHeight(5, 28);
  sheet.setRowHeight(6, 28);

  // Чередование цветов для лучшей читаемости
  sheet.getRange(5, 2).setBackground('#F5F0FF');
  sheet.getRange(6, 2).setBackground('#F5F0FF');
}
