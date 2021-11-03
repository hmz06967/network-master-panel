window.exports = {}

var event_id = {
  "connet_ssh": true,
  "register": true,
  "login": true,
  "create_campute": true,
  "new_campute_setting": true,
  "ssh_connect": true
};

const appf = {
  "campsetup": false,
  "def_user": "root",
  "html": {
    "Main": {

    },
    "campute": {
      "machine": {
        "pr": "#myCampute .text-muted",
        "id": "#myCampute tbody",
        "html": '<tr> <th scope="row">1</th> <td>{name}</td> <td>{ip}</td> <td>{date}</td> <td>{info}</td> <td>{status}</td> <td class="action-tag"> <div class="dropdown"> <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false"> <img src="/src/img/icon/setup.png" alt="" width="32" height="32" class="rounded-circle me-2">  </a> <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2"> <li><a class="dropdown-item" id="mstop"  href="#">Hareketler</a></li> <li><a class="dropdown-item" id="mforplot" href="#">Üretilenler</a></li> <li><a class="dropdown-item" id="mlogs" hhref="#">Log Kaydı</a></li> <li><a class="dropdown-item" id="mstop"  href="#">Plotu: Durdur</a></li> <li><a class="dropdown-item" id="mreco" href="#">Plotu: Sıfırla</a></li> <li><a class="dropdown-item" id="mcssh"  href="#">SSH: Bağlan</a></li> </ul> </div> </td> </tr>'
      },
      "reconmented": {
        "data": "",
        "id": "#camputeSites",
        "html": '<div class="d-flex text-muted pt-3 {_id}"><div class="pb-4 mb-1 "><img class="d-flex justify-content-center" src="{img_url}" width="60px"><strongclass="d-block">{name}</strong></div></div>'
      }
    }
  }
};
 
var box = {
  "success_box": '<div class="alert alert-primary alert-dismissible fade show"><strong>%s</strong>%s</div>'
};

window.addEventListener('load', function () {

  if (jQuery) {
    t.user.id = $('meta[name=auth]').attr('content');

    var path = location.pathname.split("/");
    if (path[1] == "panel" && path[2]) {
      path = path[2];
      if (path == "camputes") {
        t.us.mch();
      }
    } else {
      path = "panel";
    }
    $("#" + path + "-collapse").addClass("show");
    $('[data-bs-target="#' + path + '-collapse"]').attr("aria-expanded", "true");


    if (t.user.id) {
      var loginer = $("#loginerbar");

      if (path == "panel") {
        appf["html"]["loginer"] = loginer.html();
      } else {
        loginer.html(appf["html"]["loginer"]);
      }
    }

  }
});

var ssh_coonn = function (data) {
  ///window.addEventListener('load', function() {
  var terminalContainer = document.getElementById('terminal-container');
  exports.term = new Terminal({ cursorBlink: true });
  const fitAddon = new FitAddon();
  exports.term.loadAddon(fitAddon);
  exports.term.open(terminalContainer);

  // Make the terminal's size and geometry fit the size of #terminal-container
  fitAddon.fit();
  const socket = io(window.location.origin + ":3000/", { transports: ['websocket'] });
  socket.on('connect', function () {

    socket.emit("access_data", data)
    exports.term.write('\r\n*** Arabirim haberleşti ***\r\n');
    response(201);

    // Browser -> Backend
    exports.term.onData(function (data) {
      socket.emit('data', data);
    });

    // Backend -> Browser
    socket.on('data', function (data) {
      exports.term.write(data);
    });

    socket.on('disconnect', function () {
      exports.term.write('\r\n*** Geçmiş olsun, bağlantı terkedildi ***\r\n');
    });
  });
  //}, false);
}

var sc = (name, value, days) => {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

var gc = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

window.addEventListener("click", function (event) {

  if (app.f(jQuery)) {
    var tar = $(event);
    var id = tar[0].target.id;
    console.log($(event)[0], "clicked:", id);
    if (event_id[id]) {
      var p = tar[0].target;
      try {
        if (p.dataset) {
          var d = JSON.parse(p.dataset.value);
          if (app.f(eval(d["f"]))) {
            eval(d["f"])(p.dataset);
          }

          //app.us.r(data);
          /*$.post("/connect",{access_data:data}, function(r){
            ssh_coonn()            
          })*/
          //socket.emit("access_data",data)
        } else {
          console.log("target error");
        }

      } catch (error) {
        throw error;
      }
    };
  }

});

var getDate = (d) => {

  var today = new Date(d);
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var h = String(today.getHours()).padStart(2, '0');
  var i = String(today.getMinutes()).padStart(2, '0');
  today = yyyy + '.' + mm + '.' + dd + ' ' + h + ':' + i
  return today;
}

var cvas = (r) => {
  if (jQuery) {
    $("#panelsStayOpen-collapseTwo").find(".accordion-body").html(r);
  }
}

var response = function (code, msg) {
  if (code == 201) {
    var b = $("#alert-box");
    b.innerText = box.success_box.f("Bağlantı: ", "başarıyla sağlandı.");
    b.show();
  }
}

var getFormData = function ($form) {
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

var app = {
  f: (f) => { return typeof f == "function" },
  b: { "pop": "", "falert": ".alert.form" },
  u: { r: "/api/user/", l: "/api/auth", c: "/api/campute/", pa: "/panel/app" },
  us: {
    t: app,
    n: (d, u, c) => {
      if (t.f(jQuery)) {
        d = getFormData($("#" + d.form));
        app.us.p(d, u, (r) => {
          c(r)
        })
      }
    },
    p: (d, u, c) => {
      if (t.f(jQuery)) {
        $.post(u, d, (r) => {
          if (t.f(c)) c(r)
        });
      }
    },
    r: (d) => {
      t.us.n(d, t.u.r + t.user.id, (r) => {
        t.s(r, "falert");
      });
    },
    l: (d) => {
      t.us.n(d, t.u.l, (r) => {
        t.s(r, "falert");
      });
    },
    c: (d) => {
      t.us.n(d, t.u.c, (r) => {
        t.o(r, "falert");
      });
    },
    gp: (d) => {
      t.us.n(d, t.u.pa, (r) => {
        eval(d["eval"])(r);
        console.log("loaded." + (d["eval"]));
      });
    },
    kms: (d) => {
      var b = $("#new_campute_setting");
      if (b.length == 1) {
        if ($("#start_plot [aria-expanded=false]")[0])
          b.trigger("click");
      }
    },
    ssh: (d) => {
      if (jQuery) {
        $("#offcanvasExampleLabel").html("Makineler Yükleniyor");
        $.get(t.u.c + t.user.id, { "new": "ssh-connect", "sub": "ssh" }, (r) => {
          $(".sshcon-body").text(r.message.msg);
          $(".sshconnect .offcanvas-title").text("Sunucular #");
        });
      }
    },
    mch: (d) => {
      if (jQuery) {
        $.get(t.u.c + t.user.id, { "view": "camputes", "sub": "campute" }, (r) => {
          if (r.status == "success")
            t.us.mrpl(r);
        });
      }
    },
    mrpl: (r) => {

      var j = appf["html"]["campute"]["machine"];

      if (r.data.length > 0) {

        for (const m in r.data) {
          var machine = r.data[m];
          var h = j.html;

          for (const i in machine) {
            if (i == "date")
              machine[i] = getDate(machine[i]);
            h = h.replace("{" + i + "}", machine[i]);
          }


          $(j.id).prepend(h);
        }

        $(j.pr).hide();
      }
    },
    scp: (d) => {
      var k = $("input[name='autoplot']"),
        c = $("input[name='autocopy']")[0];



      if ($("input#LRaJoWn")[0] && $("input#LRaJoWn").is(':checked')) {
        /*t.us.gp({
          form:"start_plot",
          eval: (r) => {
            cvas(r);*/
        setTimeout(() => {
          t.us.n({ form: "start_plot" }, t.u.c + t.user.id, (r) => {
            //t.s(r, "falert");
            if (r.status == "success") {

              t.us.n({ form: "start_plot" }, t.u.c + t.user.id, (r) => {

                t.us.mrpl([r.data])

              });
            } else {
              t.o(r.message.msg, "machinefalert");
            }
          });

        }, 200);

        /*});*/
      } else {
        if (!k.is(':checked')) {

          t.us.n({ form: "start_plot" }, t.u.c + t.user.id, (r) => {

            if (r.status == "success") {
              t.us.mrpl([r.data]);
              console.log("yeni makine eklendi");
            } else {
              t.o(r, "falert");
              console.log(r.message.msg);
            }

          });
        } else {
          if (confirm("Lütfen ayarları kontrol edin")) {
            t.us.kms()
          }
        }
      }
    }
  },
  o: (d, b) => {
    console.log(d);
  },
  s: (d, b) => {
    var k = $(t.b[b]);
    var e = d.status == "error";
    if (e)
      t.bf(k, d.status == "error", d.message.msg);
    else {
      window.location.href = "/panel";
    }
  },
  bf: (b, o, m) => {
    b.text(m);
    if (!o) {
      b.removeClass("alert-danger");
      b.addClass("alert-success");
      return true;
    }
    b.addClass("alert-danger");
    b.removeClass("alert-success");
  },
  user: {
    id: ""
  }
}

window.t = app;