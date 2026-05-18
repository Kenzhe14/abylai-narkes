// ============================================
// Google Apps Script — RSVP для Google Таблицы
// Сундет Той — Еламан Рамазан Алдияр
// ============================================
//
// БАПТАУ НҰСҚАУЛАРЫ:
//
// 1. Жаңа Google Таблица жасаңыз (Google Sheets)
//    - "Сундет Той — RSVP" деп атаңыз
//    - Бірінші жолға тақырыптар жазыңыз:
//      A1: Уақыты  |  B1: Есімі  |  C1: Қатысуы
//
// 2. Extensions > Apps Script мәзірін ашыңыз
//
// 3. Редактордағы барлық кодты өшіріп, осы кодты қойыңыз
//
// 4. Сақтаңыз (Ctrl+S)
//
// 5. Deploy > New deployment басыңыз:
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
//    - Deploy басыңыз
//
// 6. Берілген URL-ді көшіріңіз
//
// 7. URL-ді script.js файлына қойыңыз:
//    const GOOGLE_SCRIPT_URL = 'КОШІРІЛГАн_URL_ОСЫНДА';
//
// ============================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Тақырып жолы жоқ болса — автоматты жасаймыз
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Уақыты', 'Есімі', 'Қатысуы']);
      sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
    }

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('kk-KZ'),
      data.name || '',
      data.attendance || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Деректер сақталды!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Тест функциясы
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Тест Аты',
        attendance: 'Иә, әрине',
        timestamp: '22.07.2026 18:00'
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
