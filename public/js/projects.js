
$.fn.selectpicker.Constructor.BootstrapVersion = '4';

page = 1;
pageTotal = 0;
rowTotal = 0;
projects.forEach(function (x, i) {
  id = x[0];
  title = x[1];
  desc = x[2];
  author = x[3];
  date = x[4];
  views = x[5];
  visibility = x[6];
  sponsors = x[7];
  locked = x[8];
  url = "http://http://localhost:3000/";
  if (locked == 1) {
    locked = "<i class='material-icons'>lock</i>";
  } else {
    locked = "";
  }
  if (!(i % 3)) {
    rowTotal++;
    $(".card-deck").append("<div style='padding-bottom:1rem;' class='row' id='r" + rowTotal + "'></div>");
  }
  $("#r" + rowTotal).append(projectCard(id, title, desc, date, locked));
  $("#shortDesc" + id).text($("#shortDesc" + id).text().substring(0, 100) + '...');
  $(".modal-container").append(projectModal(id, title, desc, date, views, author, locked, url));
  if (!(i % 6)) {
    pageTotal++;
  }
});
if (pageTotal == 0) {
  pageTotal = 1;
}
if (rowTotal == 0) {
  rowTotal = 1;
}
for (i = 1; i < pageTotal + 1; i++) {
  $(".paginationHolder").append("<li class='page-item' id='p" + i + "'><a class='page-link' href='#p" + i + "'>" + i + "</a></li>");
}
// <!--Page change function-->
function pageChange(page, dir, init) {
  init = init || false;
  dir = dir || 0;
  $("#p" + page).addClass('active');
  $("#page-link[href=p" + page + "]").append("<span class='sr-only'>(current)</span>");
  if (init == false) {
    remove = page + dir;
    $("#p" + remove).removeClass("active");
    $("#page-link[href=p" + page + "]").remove("span#class-only");
  }
}
pageChange(page, 0, true);
if (page == 1) {
  $("#prevli").addClass("disabled");
}
if (page == pageTotal) {
  $("#nextli").addClass("disabled");
}
// <!--Start Keypress->
$(document).on("keydown", function (event) {
  // <!--Backward-->
  if (event.which == 37) {
    page--;
    if (page <= 0) {
      page = 1;
    }
    pageChange(page, 1);
    // <!--Forward-->
  } else if (event.which == 39) {
    page++;
    if (page > pageTotal) {
      page = pageTotal;
    }
    pageChange(page, -1);
  }
  // <!--Events regardless of which keypress-->
  if (page == 1) {
    $("#prevli").addClass("disabled");
  } else if ($("#prevli").hasClass("disabled")) {
    $("#prevli").removeClass("disabled");
  }
  if (page == pageTotal) {
    $("#nextli").addClass("disabled");
  } else if ($("#nextli").hasClass("disabled")) {
    $("#nextli").removeClass("disabled");
  }
});
// <!--End Keypress-->
// <!--Favorite button on modal-->
$("#favButton").on('click', function () {
  if ($("#favText").html() == "favorite") {
    $("#favText").html("favorite_border");
  } else {
    $("#favText").html("favorite");
  }
});
$(document).ready(function () {
  new QRCode($("#qrTest")[0], $("#qrTest").attr("href"));
  $("#qrTest").append("<i class='material-icons' style='color:#9D1535'>print</i><a class='regularLink' href='#' id='printQR'>Print me</a>");

  $("#printQR").on("click", function () {
    window.print();
  });
});
