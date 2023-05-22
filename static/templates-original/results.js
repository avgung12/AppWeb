$(document).ready(function() {
  var table = $('#results-table').DataTable({ 
      dom: '<"search-justify"l>t<"center-justify"p>',
      "resonsive": true,
      "paging": true,
      "ordering": true,
      "info": false,
      "pageLength": 12,
      "columnDefs": [
      { "width": 0, "targets": 0},
      { "width": 180, "targets": 1},
      { "width": 150, "targets": 3},
      { "width": 180, "targets": 2},
      { "width": 150, "targets": 4},
      { "width": 180, "targets": 5},
      { "width": 140, "targets": 6},
      { "width": 170, "targets": 7}
      ]
    });
    
    $('#department-filter').on('change', function() {
      table.column(8).search(this.value).draw();
      table.page('first').draw('page');
    });
    
    //On-click function to display child rows. 
    $('#results-table tbody').on('click', 'tr', function() {
      var table = $('#results-table').DataTable();
      var row = table.row(this);
    
      // Check if the child row is already displayed
      if (row.child.isShown()) {
        row.child.hide();
        $(this).removeClass('shown');
      } else {
        // Display the child row
        var data = row.data();
        var childRow = format(data); // format the data using the format function
        row.child(childRow).show(); // pass the formatted data to the child row
        $(this).addClass('shown');
      }
    });

    //Add custom input for number of results

    function format(d) {
      var storageAccount = "testwebdbphotos";
      var containerName = "pics";
      var email = d[7];
      var username = email.substring(0, email.indexOf("@"));
      var imgUrl = "https://" + storageAccount + ".blob.core.windows.net/" + containerName + "/" + username + ".jpg";
      //var imgUrl = "https://testwebdbphotos.blob.core.windows.net/pics/" + username + ".jpg";

      // add the image element to the row
      var imgElement;
      if (imgUrl) {
        imgElement = '<img src="' + imgUrl + '" width="100" onerror="this.onerror=null; this.src=\'/static/images/CSUDHdefaultl.jpg\'">';
      } else {
        var defaultUrl = "images/CSUDHdefaultl.jpg";
        imgElement = '<img src="' + defaultUrl + '">';
      }
      // Wrap the returned HTML in a parent container div with a class
    return '<div class="employee-details">' +
      '<div class="profile-image">' +
        imgElement +
      '</div>' +
      '<div class="table-format">' +
        '<table>' +
          '<tr><td><strong>Display Name:</strong></td><td>'+d[1]+'</td></tr>'+
          '<tr><td><strong>First Name:</strong></td><td>'+d[2]+'</td></tr>'+
          '<tr><td><strong>Last Name:</strong></td><td>'+d[3]+'</td></tr>'+
          '<tr><td><strong>Phone:</strong></td><td>'+d[4]+'</td></tr>'+
          '<tr><td><strong>Title:</strong></td><td>'+d[5]+'</td></tr>'+
          '<tr><td><strong>Office:</strong></td><td>'+d[6]+'</td></tr>'+
          '<tr><td><strong>Email Address:</strong></td><td>'+d[7]+'</td></tr>'+
          '<tr><td><strong>Department:</strong></td><td>'+d[8]+'</td></tr>'+
          '<tr><td><strong>Division:</strong></td><td>'+d[9]+'</td></tr>'+
        '</table>' +
      '</div>' +
    '</div>';
    }
  });

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

