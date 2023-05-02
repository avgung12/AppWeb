// replace this with the URL that points to your profile image directory
const imageUrl = 'https://testwebdbphotos.blob.core.windows.net/pics/';

// select all table rows in the results table
const rows = document.querySelectorAll('#results-table tbody tr');

// loop through each row
rows.forEach((row) => {
    // get the email address cell (4th cell)
    const emailCell = row.cells[4];
    // extract the email address from the cell
    const email = emailCell.textContent.trim();
    // extract the username from the email address
    const username = email.match(/([^@]+)/)[1];
    // construct the image source URL based on the username and the image URL
    const imgSrc = `${imageUrl}${username}.jpg`;
    // create an image element with the source URL
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `${username}'s profile image`;
    // add the image element to the first cell in the row
    const imgCell = row.insertCell(0);
    imgCell.appendChild(img);
  });