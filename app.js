
// Function to get the value of the selected bathroom radio button
function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value);
    }
  }
  return -1; // If no option is selected, return -1
}

// Function to get the value of the selected BHK radio button
function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value);
    }
  }
  return -1; // If no option is selected, return -1
}

// Function to be called when the "Estimate Price" button is clicked
function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  // Get form input values
  var sqft = document.getElementById("uiSqft").value;
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");

  // Check for missing or invalid inputs
  if (!sqft || isNaN(sqft) || bhk === -1 || bathrooms === -1 || !location) {
    alert("Please fill all the fields before estimating the price.");
    return;
  }

  console.log("Inputs: ", { sqft, bhk, bathrooms, location });

  // API endpoint (keep port number as 5000)
  var url = "http://127.0.0.1:5000/predict_home_price";

  // Send data to the server
  $.post(url, {
    total_sqft: parseFloat(sqft),
    bhk: bhk,
    bath: bathrooms,
    location: location
  }, function(data, status) {
    console.log("Response from server: ", data);
    if (data.estimated_price) {
      estPrice.innerHTML = `<h2>Estimated Price: ${data.estimated_price} Lakh</h2>`;
    } else {
      estPrice.innerHTML = `<h2>Failed to calculate the price</h2>`;
    }
  })
  .fail(function(err) {
    console.error("Error in POST request: ", err);
    estPrice.innerHTML = `<h2>Failed to get the price. Please try again later.</h2>`;
  });
}

// Function to load location names when the page is loaded
function onPageLoad() {
  console.log("Document loaded...");

  var url = "http://127.0.0.1:5000/get_location_names";

  // AJAX GET request to get the location names
  $.get(url, function(data, status) {
    console.log("Got response for get_location_names request: ", data);

    if (data && data.locations) {
      var locations = data.locations;
      var uiLocations = document.getElementById("uiLocations");

      // Clear the dropdown options before populating
      $('#uiLocations').empty();

      // Add a placeholder option
      var defaultOption = new Option("Choose a Location", "", true, false);
      $('#uiLocations').append(defaultOption);

      // Populate the dropdown with location names
      for (var i = 0; i < locations.length; i++) {
        var opt = new Option(locations[i], locations[i]);
        $('#uiLocations').append(opt);
      }
    } else {
      console.warn("No locations found or data is not in the expected format.");
    }
  })
  .fail(function(err) {
    console.error("Error in GET request for location names: ", err);
  });
}

// Trigger on page load
window.onload = onPageLoad;
