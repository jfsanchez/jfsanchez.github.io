$(function() {

$.getJSON("avisos.json", function(result) {
            var statusElements = $.each(result, function(index, aviso) {
                    if (aviso.visible) {
                      var avisodiv = document.createElement("div");
                      avisodiv.innerHTML = aviso.mensaje;
                      avisodiv.className="alert alert-" + aviso.color;
                      $("#avisos").append(avisodiv);
                    }
            });
    });

});

