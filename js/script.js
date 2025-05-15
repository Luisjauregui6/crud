// Inicializar localStorage con productos por defecto
if (!localStorage.getItem("products")) {
	localStorage.setItem("products", JSON.stringify([
		{ pid: 1, pname: "verduras", price: 10 },
		{ pid: 2, pname: "papel", price: 44 },
		{ pid: 3, pname: "huevo", price: 120 },
		{ pid: 4, pname: "bebidas", price: 80 },
		{ pid: 5, pname: "promo2x1", price: 5 },
		{ pid: 6, pname: "aceite", price: 20 },
		{ pid: 7, pname: "pasta", price: 30 },
	]));
}

var plen = 0;

$(document).ready(function () {
	var products = JSON.parse(localStorage.getItem("products"));
	plen = products.length;
	var sno = 0;
	var tb = $("#tbody");
	for (var i = 0; i < plen; i++) {
		if (products[i]) {
			tb.append("<tr><td>" + selectCheck(products[i].pid) + "</td><td>" + (sno + 1) + "</td><td id='n" + products[i].pid + "'>" + products[i].pname + "</td><td id='p" + products[i].pid + "'>" + products[i].price + "</td><td>" + txtQuantity(products[i].pid) + "</td><td id='t" + products[i].pid + "'>" + (products[i].price) + "</td></tr>");
			sno++;
		}
	}
});

function selectCheck(id) {
	return '<input type="checkbox" name="c' + id + '" class="chkbx-table" id="c' + id + '">';
}

function txtQuantity(id) {
	return '<input type="number" name="quantity" id="q' + id + '" value="1" min="0" onblur="quantity(this,' + id + ')">';
}

function quantity(obj, id) {
	var products = JSON.parse(localStorage.getItem("products"));
	var qty = Number(obj.value);
	var product = searchObj(id);
	$("#t" + id).html("" + (product.price * qty));
}

function searchObj(id) {
	var products = JSON.parse(localStorage.getItem("products"));
	plen = products.length;
	for (var i = 0; i < plen; i++) {
		if (products[i] && products[i].pid == id) {
			return products[i];
		}
	}
}

function searchObjIndex(id) {
	var products = JSON.parse(localStorage.getItem("products"));
	plen = products.length;
	for (var i = 0; i < plen; i++) {
		if (products[i] && products[i].pid == id) {
			return i;
		}
	}
}

function pdelete(id) {
	var products = JSON.parse(localStorage.getItem("products"));
	var confirmDelete = window.confirm("¿Borrar producto? " + id);
	if (confirmDelete) {
		var index = searchObjIndex(id);
		delete products[index];
		localStorage.setItem("products", JSON.stringify(products));
		alert("Producto eliminado.");
		window.location.reload();
	} else {
		alert("Cancelado");
	}
}

function edit(id) {
	$('.edit').css("display", "block");
	var product = searchObj(id);
	document.forms.editForm.name.value = product.pname;
	document.forms.editForm.price.value = product.price;
	document.forms.editForm.id.value = product.pid;
}

function pview(id) {
	$('.view').css("display", "block");
	var product = searchObj(id);
	$('#view-name').html(product.pname);
	$('#view-price').html(product.price);
}

function add() {
	$('.add').css("display", "block");
}

function viewEdit() {
	$('.view').css("display", "none");
	$('.edit').css("display", "block");
}

function viewClose() {
	$('.view').css("display", "none");
}

// validate data entered before saving

function isAlphanumeric(str){
	return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/.test(str);
}


function isAlphanumeric(str) {
    return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/.test(str);
}

function editSave() {
    var products = JSON.parse(localStorage.getItem("products"));
    var id = document.forms.editForm.id.value;
    var name = document.forms.editForm.name.value.trim();
    var price = document.forms.editForm.price.value.trim();

    // Check if there are any empty fields
    if (!name || !price) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    // Only accept valid characters
    if (!isAlphanumeric(name)) {
        alert("El nombre solo debe contener letras y números.");
        return;
    }

    // check if the price is a positive number
    if (isNaN(price) || Number(price) <= 0) {
        alert("Solo se permiten números mayores a 0");
        return;
    }

    var index = searchObjIndex(id);
    products[index].pname = name;
    products[index].price = Number(price);

    localStorage.setItem("products", JSON.stringify(products));
    alert("Datos actualizados");
    $('.edit').css("display", "none");
    window.location.reload();
}


function editCancel() {
	$('.edit').css("display", "none");
}



function addSave() {
	var products = JSON.parse(localStorage.getItem("products"));
	var name = document.forms.addForm.name.value.trim();
	var price = document.forms.addForm.price.value.trim();

	// check if values are empty
	if (name === "" || price === "") {
		alert("Existen 1 o más valores incompletos");
		return;
	}

	// make sure that price is a positive number
	if (isNaN(price) || Number(price) <= 0) {
		alert("Por favor, solo ingresa números positivos");
		return;
	}


	var product = { pid: null, pname: null, price: null };
	var len = products.length;
	var chk = len - 1;
	var id = null;

	while (products[chk] == null && chk >= 0) {
		chk--;
	}
	if (chk >= 0) {
		id = products[chk].pid + 1;
	} else {
		id = 1;
	}

	product.pid = id;
	product.pname = name;
	product.price = price;
	products[len] = product;
	localStorage.setItem("products", JSON.stringify(products));
	alert("Producto agregado correctamente!");
	$('.add').css("display", "none");
	window.location.reload();
}

function addCancel() {
	$('.add').css("display", "none");
}

// select view button function

function selectView() {
	var products = JSON.parse(localStorage.getItem("products"));
	plen = products.length;
	var sno = 0;
	var tb = $("#select-view-tbody");
	var checkDisplay = false;
	for (var i = 0; i < plen; i++) {
		if (products[i]) {
			var checkboxObj = document.getElementById('c' + products[i].pid);
			var id = Number(document.getElementById('c' + products[i].pid).id.slice(1));
			var index = searchObjIndex(id);
			if (checkboxObj.checked == true) {
				tb.append("<tr class='select-view-row'><td>" + (sno + 1) + "</td><td>" + products[index].pname + "</td><td>" + products[index].price + "</td></tr>");
				checkDisplay = true;
			}
		}
	}
	if (checkDisplay == true) {
		$('.view-list').css("display", "block");
	} else {
		alert("Selecciona el producto que quieres ver!");
	}
}

function selectViewClose() {
	$('.view-list').css("display", "none");
	$('.select-view-row').remove();
}

// delete button function

function selectDelete() {
	var products = JSON.parse(localStorage.getItem("products"));
	plen = products.length;
	var checkDisplay = false;
	for (var i = 0; i < plen; i++) {
		if (products[i]) {
			var checkboxObj = document.getElementById('c' + products[i].pid);
			var id = Number(document.getElementById('c' + products[i].pid).id.slice(1));
			var index = searchObjIndex(id);
			if (checkboxObj.checked == true) {
				delete products[index];
				checkDisplay = true;
			}
		}
	}
	if (checkDisplay == true) {
		localStorage.setItem("products", JSON.stringify(products));
		alert("Productos eliminados correctamente!");
		window.location.reload();
	} else {
		alert("Selecciona por lo menos un producto a eliminar!");
	}
}

// edit button function
function selectEdit() {
	var products = JSON.parse(localStorage.getItem("products"));
	var selectedId = null;

	for (var i = 0; i < products.length; i++) {
		if (products[i]) {
			var checkbox = document.getElementById('c' + products[i].pid);
			if (checkbox && checkbox.checked) {
				if (selectedId !== null) {
					alert("Selecciona solo un producto para editar.");
					return;
				}
				selectedId = products[i].pid;
			}
		}
	}

	if (selectedId === null) {
		alert("Selecciona un producto para editar.");
		return;
	}

	edit(selectedId);
}
