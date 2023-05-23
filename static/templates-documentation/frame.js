
//Script targets towards iframe, and displays within the same website. 
function submitForm() {
    var form = document.getElementById("search-form");
    var iframe = document.getElementById("search_results_iframe");
    iframe.src = "{{ url_for('search_results') }}";
    return false; // prevent the form from submitting normally
  }