// ============================================
// Google Apps Script — RSVP для Google Таблицы
// Абылай & Наркес Той
// ============================================
//
// ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
//
// 1. Создайте новую Google Таблицу (Google Sheets)
//    - Назовите её "Абылай & Наркес — RSVP"
//    - В первой строке создайте заголовки:
//      A1: Уақыты  |  B1: Есімі  |  C1: Қатысуы  |  D1: Тілектері
//
// 2. Откройте меню Extensions > Apps Script
//
// 3. Удалите весь код в редакторе и вставьте этот код ниже
//
// 4. Нажмите сохранить (Ctrl+S)
//
// 5. Нажмите Deploy > New deployment
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
//    - Нажмите Deploy
//
// 6. Скопируйте полученный URL
//
// 7. Вставьте URL в файл script.js в строку:
//    const GOOGLE_SCRIPT_URL = 'ВАШ_URL_СЮДА';
//
// ============================================

function doPost(e) {
  try {
    // Получаем данные из запроса
    var data = JSON.parse(e.postData.contents);
    
    // Открываем активную таблицу
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Добавляем строку с данными
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('kk-KZ'),  // Уақыты
      data.name || '',                                         // Есімі
      data.attendance || '',                                   // Қатысуы
      data.wishes || ''                                        // Тілектері
    ]);
    
    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Деректер сақталды!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Возвращаем ошибку
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Тест функциясы — Apps Script ішінде тестілеу үшін
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Тест Аты',
        attendance: 'Келемін',
        wishes: 'Тест тілек!',
        timestamp: '22.04.2026 17:00'
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
