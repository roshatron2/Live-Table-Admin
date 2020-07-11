var Tables, seconds, updatedData;
$(document).ready(() => {
  $.getJSON("/tables")
    .then(addTables)
    .catch((err) => {
      console.log(err);
    });
});

function addTables(tables) {
  tables.forEach((table) => {
    $("#tables").append(`<div class="table">
    <div class="div-row">
      <div class="name">${table.name}</div>
      <div class="timer">00:00:00</div>
    </div>
    <div class="buttons">
      <div class="status">
        <button class="ui button inverted wait">Waiting</button>
        <button class="ui button inverted order">Ordered</button>
        <button class="ui button inverted eat">Eating</button>
      </div>
      <div>
        <button class="ui button inverted start">Start</button>
      </div>
    </div>
  </div>`);
  });

  $(".start").each(function (i) {
    $(this).data({ id: tables[i]._id, seconds: 0, timerID: 0, empty: true });
  });

  $(".wait").each(function (i) {
    $(this).data({ id: tables[i]._id, waiting: false });
  });

  $(".order").each(function (i) {
    $(this).data({ id: tables[i]._id, ordered: false });
  });

  $(".eat").each(function (i) {
    $(this).data({ id: tables[i]._id, eating: false });
  });

  $(".start").on("click", toggleTimer);

  $(".wait").on("click", toggleWait);
  $(".order").on("click", toggleOrder);
  $(".eat").on("click", toggleEat);
}

function toggleTimer() {
  var timerID;
  var currentTime = new Date().getTime();
  currentStart = $(this);
  var timer = currentStart.parent().parent().parent().find(".timer");
  if (currentStart.data("empty")) {
    currentStart
      .data("empty", false)
      .html("Stop")
      .addClass("negative")
      .data("seconds", 0);

    updatedData = { empty: false, waiting: true, start_time: currentTime };
    $.post({
      method: "PUT",
      url: "/tables/" + currentStart.data("id"),
      data: updatedData,
    }).then((data) => {
      console.log(data);
    });

    timerID = setInterval(() => {
      startTimer(timer, $(this));
    }, 1000);

    currentStart
      .parent()
      .parent()
      .find(".wait")
      .data({ waiting: true })
      .addClass("red");
    $(this).data({ timerID: timerID });
  } else {
    clearInterval(currentStart.data("timerID"));
    currentStart
      .html("Start")
      .removeClass("negative")
      .data({ timerID: 0, empty: true, seconds: 0 });

    updatedData = {
      empty: true,
      waiting: false,
      eating: false,
      ordered: false,
      start_time: 0,
    };
    $.post({
      method: "PUT",
      url: "/tables/" + currentStart.data("id"),
      data: updatedData,
    }).then((data) => {
      console.log(data);
    });

    timer.html("00:00:00");

    currentStart
      .parent()
      .parent()
      .find(".wait")
      .data("waiting", false)
      .removeClass("red");

    currentStart
      .parent()
      .parent()
      .find(".order")
      .data("ordered", false)
      .removeClass("orange");

    currentStart
      .parent()
      .parent()
      .find(".eat")
      .data("eating", false)
      .removeClass("green");
  }
}

function toggleWait() {
  currentWait = $(this);
  siblingEat = $(this).parent().find(".eat");
  siblingOrdered = $(this).parent().find(".order");

  if (
    currentWait.data("waiting") == false &&
    $(this).parent().parent().find(".start").data("empty") == false
  ) {
    siblingEat.data("eating", false).removeClass("green");
    $.post({
      method: "PUT",
      url: "/tables/" + siblingEat.data("id"),
      data: { eating: false },
    }).then((data) => {
      console.log(data);
    });

    siblingOrdered.data("ordered", false).removeClass("orange");
    $.post({
      method: "PUT",
      url: "/tables/" + siblingOrdered.data("id"),
      data: { ordered: false },
    }).then((data) => {
      console.log(data);
    });

    currentWait.addClass("red").data("wating", true);
    $.post({
      method: "PUT",
      url: "/tables/" + currentWait.data("id"),
      data: { waiting: true },
    }).then((data) => {
      console.log(data);
    });
  }
}

function toggleOrder() {
  currentOrder = $(this);
  siblingWait = $(this).parent().find(".wait");
  siblingEat = $(this).parent().find(".eat");

  if (
    currentOrder.data("ordered") == false &&
    $(this).parent().parent().find(".start").data("empty") == false
  ) {
    siblingEat.data("eating", false).removeClass("green");
    $.post({
      method: "PUT",
      url: "/tables/" + siblingEat.data("id"),
      data: { eating: false },
    }).then((data) => {
      console.log(data);
    });

    siblingWait.data("waiting", false).removeClass("red");
    $.post({
      method: "PUT",
      url: "/tables/" + siblingWait.data("id"),
      data: { waiting: false },
    }).then((data) => {
      console.log(data);
    });

    currentOrder.addClass("orange").data("ordered", true);
    $.post({
      method: "PUT",
      url: "/tables/" + currentOrder.data("id"),
      data: { ordered: true },
    }).then((data) => {
      console.log(data);
    });
  }
}

function toggleEat() {
  currentEat = $(this);
  siblingOrdered = $(this).parent().find(".order");
  siblingWait = $(this).parent().find(".wait");

  if (
    currentEat.data("eating") == false &&
    $(this).parent().parent().find(".start").data("empty") == false
  ) {
    siblingWait.data("waiting", false).removeClass("red");
    $.post({
      method: "PUT",
      url: "/tables/" + siblingWait.data("id"),
      data: { waiting: false },
    }).then((data) => {
      console.log(data);
    });

    siblingOrdered.data("ordered", false).removeClass("orange");
    $.post({
      method: "PUT",
      url: "/tables/" + siblingOrdered.data("id"),
      data: { ordered: false },
    }).then((data) => {
      console.log(data);
    });

    currentEat.addClass("green").data("eating", true);
    $.post({
      method: "PUT",
      url: "/tables/" + currentEat.data("id"),
      data: { eating: true },
    }).then((data) => {
      console.log(data);
    });
  }
}

function startTimer(timer, startBtn) {
  seconds = startBtn.data("seconds");
  var h = Math.floor(seconds / 3600);
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;

  if (m > 60) {
    m = m % 60;
  }

  if (h < 10) {
    h = "0" + h;
  }
  if (m < 10) {
    m = "0" + m;
  }

  if (s < 10) {
    s = "0" + s;
  }

  timer.html(h + ":" + m + ":" + s);

  seconds += 1;
  startBtn.data("seconds", seconds);
}

$(window).on("unload", function () {
  $(".start").each(function (i) {
    $.post({
      url: "/tables/" + $(this).data("id"),
      method: "PUT",
      data: {
        empty: true,
        waiting: false,
        eating: false,
        ordered: false,
        start_time: 0,
      },
    });
  });
});
