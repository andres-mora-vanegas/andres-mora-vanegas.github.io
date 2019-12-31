const newWebU = [],
	newWebD = [],
	loading = 'cargando...',
	errorx = 'Error al llamar al archivo',
	jsonLink = 'https://ingeniero-andres-mora-bkt.s3.amazonaws.com/test/json.json';

let iframeError, web,otro;
const item = `<li>
    <a href="http://:url" target="_blank" data-uri=":url">
        :descript
    </a>
    <i class="ui-btn ui-corner-all ui-icon-carat-r ui-btn-icon-notext right"></i>
</li>`;

const listJsonItem = `<tr style="border-bottom:solid #ACACAC 0.7px">
<td><input type="text" class="form-control" value=":descript" /></td>
<td><input type="url" class="form-control" value=":url" /></td>
<td>
    <span class="puntero btn btn-default glyphicon glyphicon-option-vertical dropable" data-toggle="popover"
     data-placement="left" data-html="true"></span>
    <div class="noView">
        <span class="btn btn-default glyphicon glyphicon-circle-arrow-up up move col-xs-6"></span>
        <span class="btn btn-default glyphicon glyphicon-circle-arrow-down down move col-xs-6"></span>
        <span class="btn btn-danger glyphicon glyphicon-trash removeRow col-xs-12 margin-down"></span>
    </div>
</td>
</tr>`;

const newItem = `<tr style="border-bottom:solid #ACACAC 0.7px">
<td>
    <input type="text" class="form-control" name="title" placeholder="Descripción de la pagina" />
</td>
<td>
    <input type="url" class="form-control" name="descript" placeholder="url" />
</td>
<td>
    <span class="btn btn-danger glyphicon glyphicon-remove removeRow"></span>
</td>
</tr>`;

function loadM(web) {
	var answer = '<ul class="sidebar-nav">';
	for (const item_ of web) {
		answer += item.replace(/:url/g, item_.url).replace(':descript', item_.descript);
	}
	$('#sidebar-wrapper').html(answer + '</ul>');
	var firstElement = web[Math.floor(Math.random() * web.length)].url;
	var ifra = "<iframe src='//" + firstElement + "' class='principalIframe' ></iframe>";
	$('.newTab').attr('href', '//' + firstElement);
	$('#main').html(ifra);
}

function change() {
	var url = $('#addr').val();
	$('.principalIframe').attr('src', url);
	iframeError = setTimeout(error, 5000);
}

function load(e) {
	alert(e);
}

function error() {
	alert('error');
}

$(document).on('click', '.sidebar-nav li', function() {
	try {
		var li = $(this);
		var uri = 'http://' + $(this).children().attr('data-uri');
		$(this).children().attr('data-uri');
		var ifri = $('.principalIframe');
		ifri.attr('src', uri);

		$('.newTab').attr('href', uri);
	} catch (e) {
		alert('error');
	}
});

$(document).on('click', '.listJson', function() {
	var answer = '';
	for (var x = 0; x < web.length; x++) {
		answer += listJsonItem.replace(':url', web[x].url).replace(':descript', web[x].descript);
	}
	$('.editor').html(answer);
	$('.dropable').each(function() {
		var info = $(this).parent().children('div:first').html();
		$(this).attr({
			'data-content': info
		});
	});
});

$(document).on('click', '.removeRow', function() {
	$(this).parent().parent().parent().parent().remove();
});

$(document).on('click', '.dropable', function() {
	$('.dropable').not(this).popover('hide'); //all but this
});

$(document).on('click', '.new', function() {
	$('.editor').append(newItem);
});

$(document).on('click', '.viewList', function() {
	var answer = '<ul class="sidebar-nav">';
	for (var x = 0; x < web.length; x++) {
		answer += item.replace(/:url/g, web[x].url).replace(/:descript/g, web[x].descript);
	}
	//return answer;
	$('#sidebar-wrapper').html(answer + '</ul>');
});

//función que mueve el elemento hacia arriba o abajo
$(document).on('click', '.move', function() {
	var direction = $(this).attr('direction');
	var row = $(this).parents('tr:first');
	if ($(this).is('.up')) {
		row.insertBefore(row.prev());
	} else {
		row.insertAfter(row.next());
	}
});

$(document).on('click', '.save', function() {
	var answer = '[';
	var conta = 0;
	$('.editor tr').each(function() {
		var uri = $.trim($(this).children('td').children('input:eq(1)').val());
		var des = $.trim($(this).children('td').children('input').val());
		if (uri != '' && des != '') {
			answer += '{"url":"' + uri + '","descript":"' + des + '"},';
		}
		conta++;
	});
	web = JSON.parse(answer.slice(0, -1) + ']');
	var link = 'https://kam529bejg.execute-api.us-east-1.amazonaws.com/dev/another';
	var web_ = {};
	web_.data = web;

	/**
     * funcion que realiza proceso ajax 
        in
        atributo answer=id del div que contendrá la información
        atributo data=opcion del switch (controller) que realizará el proceso
        atributo id=id que tiene la información que procesará el switch
        atributo action=nombre del controlador
        atributo namer=nombre que se pasará al controlador (opcional)
        var link = "procesa.php";
        var answer = $(".answer");
        var data_value = {};
        data_value.data = web;
     */
	const url = link;
	const headers = {
		'Content-Type': 'application/json',		
		Accept: '*'
	};
	const payload = {
		method: 'POST',
		body: JSON.stringify(web),
		headers
	};
	fetch(url, payload).then((r) => r.json()).then((r) => {
		console.log('r', r);
	});
});

$(document).on('load', '.principalIframe', function() {
	load('ok');
	clearTimeout(iframeError);
});

$('#menu-toggle,.sidebar-nav a').click(function(e) {
	e.preventDefault();
	$('#wrapper').toggleClass('toggled');
});

var answer = $('.divix');
$(document).ready(function() {
	const url = jsonLink;
	const headers = {
		method: 'GET',
		headers: {
			'Access-Control-Allow-Credentials': true,
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'application/json',
			'Content-Type': 'application/json'
		},
		type: 'application/json',
		mode: 'cors'
	};
	fetch(url, headers).then((r) => r.json()).then((r) => {
		loadM(r);
		web = r;
	});

	//funcion que inicializa el tooltip
	$('body').popover({
		selector: '[data-toggle="popover"]'
	});
});
