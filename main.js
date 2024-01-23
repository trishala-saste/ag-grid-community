
            var filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split('/');
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );

    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }

    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }

    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};

const columnDefs = [
  { field: 'athlete', floatingFilter:true,   headerCheckboxSelection: true,
      checkboxSelection: true  },
  { field: 'age', filter: 'agNumberColumnFilter', maxWidth: 100, floatingFilter:true  },
  {
    field: 'date',
    filter: 'agDateColumnFilter',
    filterParams: filterParams,
    floatingFilter:true 
  },
  { field: 'country', floatingFilter:true },
  { field: 'sport',   floatingFilter:true  },
  { field: 'gold',  filter: 'agNumberColumnFilter', floatingFilter:true, hide:false },
  { field: 'silver', filter: 'agNumberColumnFilter', floatingFilter:true, hide:false  },
  { field: 'bronze', filter: 'agNumberColumnFilter', floatingFilter:true  },
  { field: 'total', filter: false },
];

const gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: 'agTextColumnFilter',
    menuTabs: ['filterMenuTab'],
    resizable: true
  },
  pagination: true
};


function onMedalsFirst() {
  gridOptions.columnApi.moveColumns(['gold', 'silver', 'bronze', 'total'], 0);
}

function onMedalsLast() {
  gridOptions.columnApi.moveColumns(['gold', 'silver', 'bronze', 'total'], 5);
}

function onCountryFirst() {
  gridOptions.columnApi.moveColumn('country', 0);
}

function onSwapFirstTwo() {
  gridOptions.columnApi.moveColumnByIndex(0, 1);
}

function sizeToFit() {
  gridOptions.api.sizeColumnsToFit();
}

function autoSizeAll(skipHeader) {
  const allColumnIds = [];
  gridOptions.columnApi.getColumns().forEach((column) => {
    allColumnIds.push(column.getId());
  });

  gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
}


// currency
function currencyFormatter(currency, sign) {
  var sansDec = currency.toFixed(0);
  var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + `₹{formatted}`;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then((response) => response.json())
    .then((data) => gridOptions.api.setRowData(data));
});
        