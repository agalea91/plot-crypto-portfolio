/**
 * Transform and plot data
 * that was "copy and pasted" from
 * www.cryptocompare.com
 */ 
function main() {
  var data = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  data = reshape(data);
  data = parse(data)
  write(data, 'table');
  makePlot(data);
}

/**
 * Make a new sheet
 */
function makeNewSheet(spreadsheet, newSheetName){
  var sitemapSheet = spreadsheet.getSheetByName(newSheetName);
  if (sitemapSheet) {
    sitemapSheet.clear();
    sitemapSheet.activate();
  } else {
    sitemapSheet =
        spreadsheet.insertSheet(newSheetName, spreadsheet.getNumSheets());
  }
  return sitemapSheet;
}

/**
 * Write data to new sheet
 */
function write(data, name) {
  var sheet = makeNewSheet(SpreadsheetApp.getActive(), name)
  data.forEach(function(d, i){
    sheet.getRange(i+1, 1, 1, d.length).setValues([d]);
  })
  var range = sheet.getRange(2, 1, data.length, 3);
  range.sort({column: 2, ascending: false});
  SpreadsheetApp.flush();
}

/**
 * Reshape "copy and pasted" data
 */
function reshape(data) {
  var reshaped_data = [];
  var index = 0;
  data.forEach(function(d, i){
    if (i === 0) {
      reshaped_data.push([]);
      index += 1;
    } else if (i < 6) {
      reshaped_data[index-1].push(d[0]);
    } else {
      if ((i-6) % 11 === 0) {
        reshaped_data.push([]);
        index += 1;
      }
      reshaped_data[index-1].push(d[0]);
    }
  });
  return reshaped_data;
}

/**
 * Parse the data
 */
function parse(data) {
  Logger.log(data);
  parsed_data = [];
  parsed_data.push(['Coin', 'Value ('+ data[1][2].split(' ')[0] +')', 'Currency']);
  data.forEach(function(d, i){
    if (i === 0) {}
    else {
    parsed_data.push([
      d[0],
      parseFloat(d[5].split(' ')[1].replace(',', '')),
      d[5].split(' ')[0]
    ]);
    }
  });
  return parsed_data;
}

/**
 * Plot a bar chart
 */
function makePlot(data) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var chartData = Charts.newDataTable()
      .addColumn(Charts.ColumnType.STRING, data[0])
      .addColumn(Charts.ColumnType.NUMBER, data[1])
  data.forEach(function(d, i){
    if (i === 0) {}
    else {
      chartData = chartData.addRow([d[0], d[1]])
    }
  });
  chartData = chartData.build();
  
  var chartBuilder = sheet.newChart();
  var range = sheet.getRange(1, 1, data.length, 2);
  chartBuilder.addRange(range)
      .setChartType(Charts.ChartType.BAR)
      .setOption('title', 'Crypto Holdings (' + data[1][2] + ')')
      .setPosition(2, data[0].length + 1, 1, 1);
  sheet.insertChart(chartBuilder.build());
}
