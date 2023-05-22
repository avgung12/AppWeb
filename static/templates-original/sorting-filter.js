// [0] Proflie, [1] Name, [2] First Name, [3] Last Name, [4] Phone, [5] Title, [6] Office, [7] Email Address, [8] Department, [9] Division
function sortTable() {
    var sortValue = $('#sort-dropdown').val();
    var columnIdx = -1;
    
    switch (sortValue) {
      case "division":
        columnIdx = 9;
        break;
      case "department":
        columnIdx = 8;
        break;
      case "first-name":
        columnIdx = 1;
        break;
      case "office":
        columnIdx = 6;
        break;
      default:
        columnIdx = 1;
    }
    if (columnIdx >= 1) {
      $('#results-table').DataTable().order([columnIdx, 'asc']).draw();
    }
  }

  function populateDepartmentFilter() {
    var departmentFilter = document.getElementById("department-filter");
    var departmentValues = [];
  
    var distinct = document.getElementById("results-table");
    for(let i = 1; i < distinct.rows.length; i++){
      var value = distinct.rows[i].cells[8].textContent.trim();
      var cleanedValue = value.replace(/&amp;/g, '&'); 
      if (!departmentValues.includes(cleanedValue)) {
        departmentValues.push(cleanedValue);
      }
    };
    
    // Add the distinct department values to the department-filter select element
    for (var i = 0; i < departmentValues.length; i++) {
      var option = document.createElement("option");
      option.value = departmentValues[i];
      var optionText = document.createTextNode(departmentValues[i].replace(/&amp;/g, '&')); // only replace "amp;" with "&" for display purposes
      option.appendChild(optionText);
      departmentFilter.appendChild(option);
    };
  }

  populateDepartmentFilter();