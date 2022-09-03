document.writeln("<div id=\"dialog-upload\" title=\"Subida de archivos\" style=\"display:none;\">");
document.writeln("<form id=\"file-upload-form\" enctype=\"multipart/form-data\" action=\"/docencia/upload.php\" method=\"post\" role=\"form\">");
document.writeln("<fieldset id=\"camposformulario\">");
document.writeln("<label for=\"usuario\">Curso/Asignatura:</label> <select name=\"asignatura\" id=\"asignatura\" class=\"form-control text ui-widget-content ui-corner-all\"></select>");
document.writeln("<label for=\"usuario\">Usuario:</label> <input type=\"text\" name=\"usuario\" id=\"usuario\" placeholder=\"Tu usuario\" class=\"form-control text ui-widget-content ui-corner-all\" autofocus/>");
document.writeln("<label for=\"clave\">Clave:</label> <input type=\"password\" name=\"clave\" id=\"clave\" placeholder=\"Tu clave\" class=\"form-control text ui-widget-content ui-corner-all\"/>");
document.writeln("<label for=\"titulo\">Nombre del trabajo:</label> <input type=\"text\" name=\"titulo\" id=\"titulo\" placeholder=\"Título del trabajo o examen\" class=\"form-control text ui-widget-content ui-corner-all\"/>");
document.writeln("<label for=\"fichero\">Archivo a subir:</label>");
document.writeln("<input type=\"file\" name=\"fichero\" id=\"fichero\"/>");
document.writeln("<input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\">");
document.writeln("</fieldset>");
document.writeln("<div id=\"subdialog\"></div>");
document.writeln("<div id=\"errordialog\"></div>");
document.writeln("</form>");
document.writeln("</div>");

$(function() {

    var img_error= "<span style=\"float:left; padding-right: 1em;\"><img src=\"/resources/images/error.png\"/></span>";

    var dialog = $("#dialog-upload").dialog({
      autoOpen: false,
      height: 430,
      width: 500,
      modal: true,
      hide: 'explode',
      show: 'explode',
      buttons: 
		[{
			id: "subir",
			text: "Subir",
			click: function() { $("#file-upload-form").submit(); }
		},{
			id: "cancelar",
			text: "Cancelar",
			click: function() {
				dialog.dialog("close");
			}
		}]
    });

    $("#entrega").on("click", function(event) {
      event.preventDefault();
      $("#mensaje").html('');
      dialog.dialog("open");
    });

    $("#dialog-upload").on("submit", function(e){
        e.preventDefault();
        var f = $(this);

	// required html tag in the future, but in the meantime...
	if ( ($("#usuario").val() == "") || ($("#clave").val() == "") || ($("#titulo").val() == "") || ($("#fichero").val() == "") ) {
		$("#errordialog").html(img_error + "Cubre todos los campos ¿Te has acordado de adjuntar también el fichero?");
		$("#errordialog").dialog({
			modal: true,
			height: 260,
			width: 550,
			buttons: [{
				text: "OK",
				click: function() {
					$( this ).dialog( "close" );
				}
			}]});
		return;
	}

        var formData = new FormData(document.getElementById("file-upload-form"));//$("#file-upload-form")
        //formData.append("usuario", "valor");
        //formData.append(f.attr("name"), $(this)[0].files[0]);

        $.ajax({
            url: "/docencia/upload.php",
            type: "post",
            dataType: "html",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
			beforeSend: function() {
        		$("#subir").button("disable");
				$("#cancelar").button("disable");
				$("#subdialog").html("<p style=\"text-align: center;\"><img src=\"/resources/images/loadingcat.gif\"/></p><p style=\"text-align: center;\">Subiendo gatos, espera por favor...</p>");
				$("#subdialog").dialog({
					height: 350,
					width: 350,
					modal: true,
					dialogClass: "no-close"
				});
			},
			success: function(res) {
				$("#subdialog").dialog("close");
				$("#usuario").val('');
				$("#clave").val('');
				$("#titulo").val('');
				$("#fichero").val('');
				$("#mensaje").html(res);
				$("#mensaje").css('background-color', '#0f0')
					.css('margin-left', '3em').css('color', '#000')
					.css('padding', '0.2em').css('font-weight', '400');
				$("#mensaje").hide();
				$("#mensaje").show('explode', {}, 500, function() {setTimeout(function() {$("#mensaje").hide('explode', {}, 3000); }, 5000);} );
				dialog.dialog('close');
			},
			error: function(xhr, ajaxOptions, thrownError){
				$("#subdialog").dialog("close");
				
				if (xhr.status == 403) {
					$("#errordialog").html(img_error + "El usuario o la clave son incorrectos");
				} else {
					$("#errordialog").html(img_error + xhr.status + " " + thrownError);
				}
				$("#errordialog").dialog({
					modal: true,
					height: 260,
					width: 550,
					buttons: [{
						text: "OK",
						click: function() {
							$( this ).dialog( "close" );
						}
					}]});
			},
			complete: function() {
				$("#subir").button("enable");
				$("#cancelar").button("enable");
			}
        });
		
    });

    $('#asignatura').children().remove().end();
    $.getJSON("/docencia/cursos/index.json", function(result) {
            var statusElements = $.each(result, function(index, curso) {
                    if (curso.visible) {
                      var asignatura = curso.curso + '-' + curso.acronimo;
                      $("#asignatura").append($('<option>', {value: asignatura, text: curso.nombre}));
                    }
            });
    });

 $('[data-toggle="tooltip"]').tooltip();

});
