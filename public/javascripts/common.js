var filterByPrinter = (function() {
  var
    $edit_marka = $('#edit-marka'),
    $edit_model = $('#edit-model'),
    $edit_dogo = $('#edit-dogo'),
    $cs_result  =$('#cs-result'),
    $tbody = $cs_result.find('tbody').first(),
    dataStorage = null;

  $edit_dogo.click(refillTable);
  $edit_marka.change(refillOptions);

  function init() {
    loadCartriges(fillSelect);

  }

  function loadCartriges(callback) {
    if(dataStorage) {
      callback( dataStorage );
    } else {
      $.get( "/cartriges", function( data ) {
        dataStorage = data;
        callback( data );
      });
    }
  }

  function fillSelect(data) {
    var producers = data.producers;
    for(var i = 0; i < producers.length; i++) {
      var data = producers[i];
      var option = '<option name="marka" data-id="' + i + '" value="' + data.producer + '">' + data.producer + '</option>';
      $edit_marka.append(option);
    }
    loadCartriges(fillOptions);
  }

  function refillOptions() {
    clearOptions();
    loadCartriges(fillOptions);
  }

  function fillOptions(data) {
    var producer = $edit_marka.find('option').filter(':selected');
    if(!producer) {
      console.log("cartriges is empty");
      return;
    }
    var printers = data.producers[producer.data('id')].printers;
    for(var i = 0; i < printers.length; i++) {
      var data = printers[i];
      var option = '<option name="model" data-id="' + i + '" value="' + data.model + '">' + data.model + '</option>';
      $edit_model.append(option);
    }
  }

  function clearOptions() {
    $edit_model.html('');
  }

  function refillTable() {
    clearTable();
    loadCartriges(fillTable);
  }

  function fillTable(data) {
    var producerSelected = $edit_marka.find('option').filter(':selected');
    var printerSelected =  $edit_model.find('option').filter(':selected');
    if(!producerSelected) {
      console.log("cartriges is empty");
      return;
    }
    var producer = data.producers[producerSelected.data('id')]
    var printer = producer.printers[printerSelected.data('id')];
    var cartriges = printer.cartriges;
    var th = '<tr>' +
      '<td class="cs-thead">Производитель</td>' +
      '<td class="cs-thead">Наименование принтера</td>' +
      '<td class="cs-thead">Наименование и тип картриджа</td>' +
      '<td class="cs-thead">Ресурс печати А4, 5%</td>' +
      '<td class="cs-thead">Цена заправки</td>' +
      '<td class="cs-thead">Цена восстановления</td>' +
      '</tr>';

    $tbody.append(th);

    for(var i = 0; i < cartriges.length; i++) {
      var cartrige = cartriges[i];
      var tr = '<tr>' +
        '<td class="cs-cell">' + ( producer.producer || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( printer.model || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( cartrige.name || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( cartrige.resource || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( cartrige.fill_price || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( cartrige.recovery_price || '-' ) + '</td>' +
        '</tr>';
      $tbody.append(tr);
    }
  }

  function clearTable() {
    $tbody.html('');
  }

  return {
    "clearTable": clearTable,
    "clearOptions": clearOptions,
    "init": init
  }
})();

var filterByCartrige = (function() {
  var
    $cartrige_type = $('#edit-cartrige-type')
    $edit_dogol = $('#edit-dogol'),
    $cs_result_lite =$('#cs-lite-result'),
    $tbody = $cs_result_lite.find('tbody').first(),
    dataStorage = null;

  $edit_dogol.click(refillTable);

  function init() {}

  function loadCartriges(callback) {
    if(dataStorage) {
      callback( getCartrigesList(dataStorage) );
    } else {
      $.get( "/cartriges", function( data ) {
        dataStorage = data;
        callback( getCartrigesList(data) );
      });
    }
  }

  function getCartrigesList(data) {
    var producers = data.producers;
    var cartrigeList = [];
    for(var i = 0; i < producers.length; i++) {
      var printers = producers[i].printers;
      for(var j = 0; j < printers.length; j++) {
        var cartriges = printers[j].cartriges;
        for(var k = 0; k < cartriges.length; k++) {
          var cartrige = cartriges[k];
          cartrige.producer = producers[i].producer;
          cartrige.printer_model = printers[j].model;
          cartrigeList.push(cartriges[k]);
        }
      }
    }

    return cartrigeList;
  }

  function refillTable() {
    clearTable();
    loadCartriges(fillTable);
  }

  function fillTable(data) {
    var str = $cartrige_type.val().replace(/([\|^$*+?.])/gim, "\\$1");
    var regexp = new RegExp(str, 'im');

    var th = '<tr>' +
      '<td class="cs-thead">Производитель</td>' +
      '<td class="cs-thead">Наименование принтера</td>' +
      '<td class="cs-thead">Наименование и тип картриджа</td>' +
      '<td class="cs-thead">Ресурс печати А4, 5%</td>' +
      '<td class="cs-thead">Цена заправки</td>' +
      '<td class="cs-thead">Цена восстановления</td>' +
      '</tr>';

    $tbody.append(th);

    for(var i = 0; i < data.length; i++) {
      var cartrige = data[i];
      if(!regexp.test(cartrige.name)) continue;
      var tr = '<tr>' +
        '<td class="cs-cell">' + ( cartrige.producer || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( cartrige.printer_model || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( cartrige.name || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( cartrige.resource || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( cartrige.fill_price || '-' ) + '</td>' +
        '<td class="cs-cell">' + ( cartrige.recovery_price || '-' ) + '</td>' +
        '</tr>';
      $tbody.append(tr);
    }
  }

  function clearTable() {
    $tbody.html('');
  }

  return {
    "init": init
  }
})();


;(function() {
  filterByPrinter.init();
  filterByCartrige.init();
})();
