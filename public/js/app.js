$(document).ready(function () {
  var pageImages = [];
  var currentPage = 1;
  var numResults = 0;
  var totalPages = 0;


  $("#version").html("v0.14");

  $("#searchbutton").click(function (e) {
    displayModal();
  });

  $("#searchfield").keydown(function (e) {
    if (e.keyCode == 13) {
      displayModal();
    }
  });

  function displayModal() {
    let search = ($("#searchfield").val()).split(" ");
    $("#myModal").modal('show');
    $("#status").html("Searching...");
    $("#dialogtitle").html("Search for: " + $("#searchfield").val());
    $("#previous").hide();
    $("#next").hide();

    var imagesUrl = [];
    numResults = search.length;
    totalPages = Math.ceil(numResults / 4);

    for (let i = 0; i < search.length; i++) {
      $.getJSON('/search/' + search[i], function (data) {
        renderQueryResults(data);
      });
    }

  }

  $("#next").click(function (e) {
    if (currentPage < totalPages) {
      currentPage++;
      renderImages(pageImages[currentPage - 1]);
    }
  });

  $("#previous").click(function (e) {
    if (currentPage > 1) {
      currentPage--;
      renderImages(pageImages[currentPage - 1]);
    }

  });

  function renderQueryResults(data) {
    if (data.error != undefined) {
      $("#status").html("Error: " + data.error);
    } else {
      showResults(data.results);
    }
  }

  function showResults(results) {
    imagesUrl.push(results);

    if (imagesUrl.length == numResults) {
      if ((imagesUrl.length % 4) != 0) {
        let ix = 0;
        let lx = 0;
        for (let i = 0; i < totalPages; i++) {
          if (i == totalPages - 1) {
            lx = ix + (imagesUrl.length % 4);
          } else {
            lx += 4;
          }

          pageImages[i] = imagesUrl.slice(ix, lx);
          ix = ix + 4;
        }
        renderImages(pageImages[0]);
      } else
        renderImages(imagesUrl);
    }

  }

  function renderImages(images) {
    //$("#status").html(""+images.length+" result(s)");
    if (currentPage < totalPages) {
      $("#next").show();
    }
    if (currentPage == totalPages) {
      $("#next").hide();
    }
    if (currentPage != 1) {
      $("#previous").show();
    }
    if (currentPage == 1) {
      $("#previous").hide();
    }

    $("#status").html("" + numResults + " result(s) - Showing page " + currentPage + " of " + totalPages);

    let img;
    for (let i = 0; i < 4; i++) {
      if (images[i]) {
        img = document.createElement("img");
        img.src = images[i];
        img.width = 200;
      } else {
        img = "";
      }
      let photo = "#photo" + i;
      $(photo).html(img);
    }
  }

});