var search = [];
var searchPagination = [];
var nombre = "";
var nombre_original = "";
var paginas = 0;
var pagina_actual = 1;
var bandera = null;

function getPeliculasID(id) {
    let url = 'https://www.omdbapi.com/?apikey=533bb6&i=' + id;
    hacerPeticionAjax(url, getPeliculas);
    document.getElementById('footer').style="visibility: hidden";
    document.getElementById('mi_body').style.backgroundImage = 'none';
}

function getMusicaNombre() {
    //document.getElementById('mi_body').style.backgroundImage = "url('https://images2.alphacoders.com/228/thumb-1920-228760.jpg')";
    document.getElementById('footer').style="visibility: visible";
    bandera = false;
    nombre_original = document.getElementById('txtNombre').value;
    nombre = nombre_original.trim().split(' ').join('%20');
    let url = 'https://api.musixmatch.com/ws/1.1/track.search?format=json&callback=callback&q_track='+nombre+'&quorum_factor=1&apikey=e5682fb951789680203cb310508bf8af'
        
    //let url = 'https://www.omdbapi.com/?apikey=533bb6&s=' + nombre + '&page=' + 1;
    hacerPeticionAjax(url, getPeliculas);
}




function getPeliculasNombPagina(pagina) {
    pagina_actual = pagina;
    if(pagina_actual > paginas){
        createModal("Error", "Ha intentado abrir un número de página que no existe, existen "+ paginas + " páginas disponibles \n" +
            "por favor ingrese un valor valido.");
    }else {
        let url = 'https://www.omdbapi.com/?apikey=533bb6&s=' + nombre + '&page=' + pagina;
        hacerPeticionAjax(url, getPeliculas);
    }
}

function createModal(titulo, mensaje){
    document.getElementById('nombre_pelicula').innerText = titulo;
    document.getElementById('cantidad_peliculas').innerText = mensaje;
    $('#myModal').modal();
}

function getPeliculas(data) {
    if (data.Response == "True") {
        let resultados = parseInt(data.totalResults);
        paginas = Math.ceil(resultados / 10);
        if(!bandera)
            createModal(nombre_original, "Se han obtenido "+ resultados + " resultados" +
            " y se han creado " + paginas + " paginas.");
        bandera=true;
        search = [];
        if (data.Title === undefined) {
            for (let i = 0; i < data.Search.length; i++) {
                search.push(data.Search[i]);
            }
        } else {
            search.push(data);
            cargarTabla(search);
        }
        cargarTabla(search);
    } else {
        createModal("ERROR", "Se ha producido un error al buscar la pelicula," +
            " por favor verifica que el nombre sea correcto.");
    }
    actualizarBotones(-1);
}




function hacerPeticionAjax(url, callback) {
    let ajax;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        ajax = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }


    document.getElementById("informacion").innerHTML = url;
    ajax.open('GET', url, true);
    ajax.send();

    document.getElementById("informacion").innerHTML = ajax.responseText;
            
    

    
}


function cargarTabla(datos) {
    let keys = Object.keys(datos[0]);
    if (datos.length > 1) {
        keys.push("Más Detalles");
    } else {
        keys.pop();
    }
    let table = "";
    for (let i = 0; i < keys.length; i++) {
        table += "<th>" + keys[i] + "</th>";
    }
    for (let i = 0; i < datos.length; i++) {
        let dt = datos[i];
        table = table + "<tr>";
        for (let j = 0; j < keys.length; j++) {
            if (keys[j] == "Ratings") {
                let ratings = dt[keys[j]];
                values = [];
                for (let k = 0; k < ratings.length; k++) {
                    values.push("->" + ratings[i].Source + '<->' + ratings[i].Value + "<-");
                }
                table += "<td>" + values.toString() + "</td>";
            } else if (keys[j] == "Poster") {
                if (dt[keys[j]] === "N/A") {
                    table += "<td><img alt='img' class='thumbnail' src=https://www.octoparse.com/images/404_logo.gif style='width:150px;height:250px;'></td>";
                } else
                    table += "<td><img alt='img' class='thumbnail' src=" + dt[keys[j]] + " style='width:150px;height:250px;'></td>";
            } else if (keys[j] == "Más Detalles") {
                table += "<td><input type='button' class='input_button' onclick='getPeliculasID(this.id)' value='Más Detalles' id=" + dt["imdbID"] + "></td>";
            } else {
                table += "<td>" + dt[keys[j]] + "</td>";
            }
        }
        table = table + "</tr>";
    }
    document.getElementById('peliculas').innerHTML = table;
}

function cargarUltimoIndex() {
    getPeliculasNombPagina(paginas);
}

function regresarUnaPelicula() {
    if (actualizarBotones(1) === 0) {
        pagina_actual = parseInt(pagina_actual) - 1;
        getPeliculasNombPagina(pagina_actual);
    }
}

function aumentarUnaPelicula() {
    if (actualizarBotones(2) === 0) {
        pagina_actual = parseInt(pagina_actual) + 1;
        getPeliculasNombPagina(pagina_actual);
    }
}

function actualizarBotones(btn) {
    scroll(0, 0);
    document.getElementById('btn_avanzar').disabled = false;
    document.getElementById('btn_regresar').disabled = false;
    if (pagina_actual === 1 && btn === 1) {
        document.getElementById('btn_regresar').disabled = true;
        alert("Ya esta en la primera pagina");
        return 1; //ERROR En caso de que se quiera regresar y ya este en el inicio
    } else if (pagina_actual === paginas && btn === 2) {
        document.getElementById('btn_avanzar').disabled = true;
        alert("Ya esta en la ultima pagina");
        return 2; //ERROR En caso de que se quiera avanzar y ya este en el final;
    } else {
        return 0; // No pasa nada :v
    }
}