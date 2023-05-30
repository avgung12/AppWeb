//DataTable is created, features responsive table, paging, ordering, and set length per page = 12. 

//columDefs set columns width sizes, and keep it the same when tempty. 

//$ symbol selects or references via element ID 
$(document).ready(function() { //$ (document) refers to the <body> content of html. .ready(function()) means that this script will occur once the website is loaded.
  var table = $('#results-table').DataTable({  //var table, refers to the display table "results-table", which it creates a DataTables object from. 

    //Properties of the table. 
      dom: '<"search-justify"l>t<"center-justify"p>',  //dom varible controls the position and elements of the table (in this case, it follows a separate CSS files I created), 
      //length is above page links, table is in the middle, page link is at the bottom. 
      "resonsive": true, //Responsive, set to true, the table automatically resizes based on string length, the more string in a row, within a column, the column width automatically adjusts.
      "paging": true, //Set to true, allows paging within the datatables.
      "ordering": true, // Set to true, allows ordering with table column parameters. For ex.("order": [[ 3, "desc" ]]), It modifies the 4th column of the table order it by descending order, "asc" to ascending order, "desc to descending order"
      //It is used within the Sorting javascript function (lines 100-124)

      "info": false, //Set to false, it displays the current amount of results, to the total amount of results, ex. In page 2, it displays (30 out of 120 results)

      "pageLength": 12, //Set to 12, it is the default amount of results shown in each page. 

      //columnDefs allows modification of target columns within the table, since the table is dynamic, I set the columns width to appear bigger when empty. 
      "columnDefs": [
      { "width": 0, "targets": 0}, //Multiple columns can be targeted using arrays: for example { "width": 0, "targets": [0 , 2]} Targets columns 1 and 3 setting it to width.
      { "width": 180, "targets": 1}, //Additional functions such as hiding the colums {visible = false, "targets": [0 , 2]}, making the column unsearchable{searchable = false, "targets": [0 , 2]}
      { "width": 150, "targets": 3}, 
      { "width": 180, "targets": 2}, 
      { "width": 150, "targets": 4},
      { "width": 180, "targets": 5},
      { "width": 140, "targets": 6},
      { "width": 170, "targets": 7}
      ]
    });
    
    //Script calls upon department-filter selection menu.
    //Based on the selection, it calls upon dataTables, column (8), department, and filters based on department. 

    $('#department-filter').on('change', function() { //$ refers to the department-filter menu found in search_results.html, occurs when a value is changed within the element. 
      //For example, I want to filter the employees within the Police department, function (){}, searches by the value of 'Police department'

      table.column(8).search(this.value).draw(); //table.column (8) calls column 8 (Department column) of the table, and based on the value, it draws results. 
      table.page('first').draw('page'); //The .page('first') function will move to the first page of the table , and will draw within the current page. 
    });
    
    //Script creates child rows, when clicking on a table row.
    //$ calls upon the tbody section of results-table, 
    $('#results-table tbody').on('click', 'tr', function() { //on('click','tr'), refers to when the function is clicked, specifically "tr" or table row, a function form called.
      var table = $('#results-table').DataTable(); //When clicked, table calls upon the results-table to create a datatable. 
      var row = table.row(this);// The current row is called upon. 
    
      // Check if the child row is already displayed
      if (row.child.isShown()) { //If so, when clicked, the row is hidden. 
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

    //Creates a format for child rows, variable username takes information from email, and used to check for profile pic. 
    function format(d) {
      var storageAccount = "testwebdbphotos"; //variable StorageAccount, refers to the actual area of the Azure storage blob, in which all the pictures are located. 
      var containerName = "pics" ; //refers to the subfolder in which the pictures are accessed. 

      var email = d[7]; //The user email is called upon, this is accessed on column 7 of the DataTable. 

      var username = email.substring(0, email.indexOf("@")); // A variable username is created, the function .substring()  picks up from the first string letter of the email,
                                                             // Up until the @ sign of the email, thus only returning the username of the email. 

      //Variable imgURL, calls upon Azureblob, uses storageaccount and containername to find the images. images are called based on username.                                                      
      var imgUrl = "https://" + storageAccount + ".blob.core.windows.net/" + containerName + "/" + username + ".jpg"; 
  

      //A fallback link to use should var imgUrl = "https://testwebdbphotos.blob.core.windows.net/pics/" + username + ".jpg";

      

      // variable imgElement is created, if the URL exists, it is assigned as image source, 
      var imgElement;
      if (imgUrl) {

         //on error checks for any errors, if so, it replaces it with the deafault image
        imgElement = '<img src="' + imgUrl + '" width="100" onerror="this.onerror=null; this.src=\'/static/images/CSUDHdefaultl.jpg\'">';
      } else {


      //If nothing is returned, the default image is used. 
        var defaultUrl = "images/CSUDHdefaultl.jpg"; //Image is stored locally. 
        imgElement = '<img src="' + defaultUrl + '">';
      }

      // Wrap the returned HTML in a parent container div with a table class, putting information in a clean tabular format. 
    return '<div class="employee-details">' +
      '<div class="profile-image">' +
        imgElement + // adds the image element to the row
      '</div>' +
      '<div class="table-format">' + //Displays the table rows in tabular format. Information is pulled from the respective column of the DataTable
        '<table>' +
          '<tr><td><strong>Display Name:</strong></td><td>'+d[1]+'</td></tr>'+ //Display Name, includes first + last name, based on the first column of the DataTable, Name
          '<tr><td><strong>First Name:</strong></td><td>'+d[2]+'</td></tr>'+ // First Name, second column of DataTable (set as hidden)
          '<tr><td><strong>Last Name:</strong></td><td>'+d[3]+'</td></tr>'+// Last Name, third column of DataTable (set as hidden)
          '<tr><td><strong>Phone:</strong></td><td>'+d[4]+'</td></tr>'+ //Phone num, fourth column of DataTable
          '<tr><td><strong>Title:</strong></td><td>'+d[5]+'</td></tr>'+//Title, fifth column of DataTable
          '<tr><td><strong>Office:</strong></td><td>'+d[6]+'</td></tr>'+// Office, sixth column of DataTable, 
          '<tr><td><strong>Email Address:</strong></td><td>'+d[7]+'</td></tr>'+ //Email Address, seventh column
          '<tr><td><strong>Department:</strong></td><td>'+d[8]+'</td></tr>'+ // Department, eighth column
          '<tr><td><strong>Division:</strong></td><td>'+d[9]+'</td></tr>'+ // Division, ninth column column
        '</table>' +
      '</div>' +
    '</div>';
    }
  });



// Legend: [0] Proflie, [1] Name, [2] First Name, [3] Last Name, [4] Phone, [5] Title, [6] Office, [7] Email Address, [8] Department, [9] Division
function sortTable() {  // Sorting function, to create drop down a sort option, cases are assigned to proper columns.

  var sortValue = $('#sort-dropdown').val(); //the $ calls upon the #sort-dropdown menu created in ((search_results.html))
  var columnIdx = -1; 
  
  switch (sortValue) { //Based on the value of sortValue, case statements are deployed.

    case "division": //should the value be division, it will sort in column 9, which is the Division columns
      columnIdx = 9;
      break;
    case "department": //department, column 8, Department Column.
      columnIdx = 8;
      break;
    case "first-name": //first-name, column 1, Name column.
      columnIdx = 1;
      break;
    case "office": //office, column 6, Ofice Column
      columnIdx = 6;
      break;
    default:           //Automatically sorts by Name. 
      columnIdx = 1;
  }
  if (columnIdx >= 1) {
    $('#results-table').DataTable().order([columnIdx, 'asc']).draw(); // Sorting is ordered on ascending order. Any choice that is above or is columnID 1. 
  }
}



//Cleaned values replaces ampersand with & symbol to properly search exact queries.
//Departmentvalues is checked if value was already found, if not, adds the string. 

function populateDepartmentFilter() {  //Function to populate the dropdown menu in department-filter.

  var departmentFilter = document.getElementById("department-filter"); //Refers to the department-filter menu created in search_results.html
  var departmentValues = []; //Create an array to store the values. 

  var distinct = document.getElementById("results-table"); //Refers to results-table, and creats a variable. 
  for(let i = 1; i < distinct.rows.length; i++){  //For loop iterates through distinct, within each row.
 
    var value = distinct.rows[i].cells[8].textContent.trim(); //Looks specifically for cell 8, which is the cell where the Department values are stored. 

    var cleanedValue = value.replace(/&amp;/g, '&');  //Cleans the value, replacing any instances with an ampersand, to & instead. .value() replaces /&amp/, g means global modifier. 

    if (!departmentValues.includes(cleanedValue)) { //If-statement checks if the departmentValues with  cleanedvalues, and checks, if it is already existing
      departmentValues.push(cleanedValue); // If it fails to exist, the cleanedValue is added to the departmentValues array. 
    }


  };
  
  
  // Based on the length of DepartmentValues, text is created, option.value picks up from the departmentValues array. 
  // optiontext, along with createTextNode is used to clean and replaces ampersands with &.
  // option is then appended with optionext, which is then appended to the departmentFilter which fills it with distinct values. 

  for (var i = 0; i < departmentValues.length; i++) { // Loops through distinct department values.
    var option = document.createElement("option"); //An option menu is created to create an options menu. 

    option.value = departmentValues[i]; //departmentValues are pused into options, thus adding multiple option values from DepartmentValues,
    var optionText = document.createTextNode(departmentValues[i].replace(/&amp;/g, '&')); // only replace "amp;" with "&" for display purposes
    //createTextNode adds the departmentvalues as text options. 

    option.appendChild(optionText); //optiontext is appended to the list of children, in this case, the options. 
    departmentFilter.appendChild(option); //option, and all the text nodes, are added into departmentFilter, which is moved to deparment-filter menu. 
  };
}

//Function is then called.
populateDepartmentFilter();

