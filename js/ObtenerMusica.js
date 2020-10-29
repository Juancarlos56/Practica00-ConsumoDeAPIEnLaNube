var search = [];
var searchPagination = [];
var nombre = "";
var nombre_original = "";
var paginas = 0;
var pagina_actual = 1;
var bandera = null;
var desde = 0;
var hasta = 5;

function getCancionesID(id) {
    let url = 'https://www.omdbapi.com/?apikey=533bb6&i=' + id;
    hacerPeticionAjax(url, getMusica);
    document.getElementById('footer').style="visibility: hidden";
    document.getElementById('mi_body').style.backgroundImage = 'none';
}

function getMusicaNombre() {
    document.getElementById('mi_body').style.backgroundImage = "url('https://www.wallpapertip.com/wmimgs/40-405583_high-resolution-white-background-hd.jpg')";
    document.getElementById('footer').style="visibility: visible";
    bandera = false;
    nombre_original = document.getElementById('txtNombre').value;
    nombre = nombre_original.trim().split(' ').join('%20');
    let url = 'https://api.musixmatch.com/ws/1.1/track.search?format=json&q_track='+nombre+'&quorum_factor=1&apikey=5cb44a93a8cda287b6cb4d7c7498dda3&page=' + 1;
    hacerPeticionAjax(url, getMusica);
}




function getCancionesNombPagina(pagina) {
    pagina_actual = pagina;
    if(pagina_actual > paginas){
        createModal("Error", "Pagina no existe "+ paginas + " páginas disponibles \n" + "por favor ingrese un valor valido.");
    }else {
        let url = 'https://api.musixmatch.com/ws/1.1/track.search?format=json&q_track='+nombre+'&quorum_factor=1&apikey=5cb44a93a8cda287b6cb4d7c7498dda3&page=' + 1;
        hacerPeticionAjax(url, getMusica);
    }
}

function createModal(titulo, mensaje){
    document.getElementById('nombre_Cancion').innerText = titulo;
    document.getElementById('cantidad_Canciones').innerText = mensaje;
    $('#myModal').modal();
}

function getMusica(data) {
    //if (data.Response == "True") {
        console.log("Estoy en get music");
        let resultados = parseInt(data.message.body.track_list.length);
        paginas = Math.ceil(resultados / 5);

        if(!bandera)
            createModal(nombre_original, "Se han encontrado "+ resultados + " posibles resultados" +
            " y se creo " + paginas + " paginas.");
        bandera=true;
        search = [];


        //if (data.Title === undefined) {
       
        //}// else {
           // search.push(data);
            //cargarTabla(search);
        //}

        for (let i = 0; i < data.message.body.track_list.length; i++) {
            search.push(data.message.body.track_list[i]);
        }
        
        cargarTabla(search);
    //} else {
        //createModal("ERROR", "Se ha producido un error al buscar la pelicula," +
        //    " por favor verifica que el nombre sea correcto.");
    //}
    actualizarBotones(-1);
}




function hacerPeticionAjax(url, callback) {
    
    let ajax = new XMLHttpRequest();
    ajax.open('GET', url, true);
    ajax.send();
    
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {


            let responseJSON = JSON.parse(ajax.responseText);
            console.log(responseJSON.message.body);

            /*

            for (var  i = 0; i < responseJSON.message.body.track_list.length; i++) {
                
                document.getElementById("informacion").innerHTML += responseJSON.message.body.track_list[i].track.track_id+"<br>";
                
                document.getElementById("informacion").innerHTML += responseJSON.message.body.track_list[i].track.track_name+"<br>";

                document.getElementById("informacion").innerHTML += responseJSON.message.body.track_list[i].track.album_name+"<br>";

                document.getElementById("informacion").innerHTML += responseJSON.message.body.track_list[i].track.artist_name+"<br>";
                
                //document.getElementById("informacion").innerHTML += responseJSON.message.body.track_list[i].track.primary_genres.music_genre_list[0].music_genre.music_genre_name+"<br>";

                document.getElementById("informacion").innerHTML += responseJSON.message.body.track_list[i].track.updated_time+"<br>";
                
            }

            */

            //document.getElementById("informacion").innerHTML = responseJSON;
            callback(responseJSON);
        }
    };
    

    
}



function cargarTabla(datos) {
    let keys = ['Nombre de la Cancion', 'Album', 'Artista', 'Fecha de Lanzamiento', 'Letra Disponible'];

    console.log("keys "+keys);
    //console.log("datos primero "+datos[0].track.track_name);

    
    let table = "";
    for (let i = 0; i < keys.length; i++) {
        table += "<th>" + keys[i] + "</th>";
    }

    for (let i = desde; i < hasta-1; i++) {
        let dt = datos[i];
        table = table + "<tr>";

        console.log("dat "+dt.track.track_name);


        for (let j = 0; j < keys.length; j++) {
            
            if (keys[j] == "Nombre de la Cancion") {
                let nameSong = dt.track.track_name;
                
                table += "<td>" + nameSong.toString() + "</td>";
            
            } else if (keys[j] == "Album") {

                table += "<td>" + dt.track.album_name + "</td>";

            } else if (keys[j] === "Artista") {
                    
                        table += "<td>"+dt.track.artist_name+"</td>";
                
            } else if (keys[j] == "Fecha de Lanzamiento") {
                table += "<td>"  + dt.track.updated_time +  "</td>";
            
            }else if (keys[j] == "Letra Disponible") {
                if (dt.track.has_lyrics == 0) {
                    table += "<td>Existe Letra Disponible</td>";     
                }else{
                    table += "<td>No Existe Letra Disponible</td>";
                }
               
            }
        }
        table = table + "</tr>";
    }
    
    document.getElementById('canciones').innerHTML = table;
    
}

function cargarUltimoIndex() {
    getCancionesNombPagina(paginas);
}

function regresarUnaCancion() {
    hasta = desde;
    desde = Math.ceil(desde - 5);
    
    console.log("Regresar: desde = "+desde+" hasta "+hasta)

    if (actualizarBotones(1) === 0) {
        pagina_actual = parseInt(pagina_actual) - 1;
        getCancionesNombPagina(pagina_actual);
    }
}

function aumentarUnaCancion() {
    desde = hasta; 
    hasta =  Math.ceil(desde * paginas);

    console.log("Subir = "+desde+" hasta "+hasta)
    if (actualizarBotones(2) === 0) {
        pagina_actual = parseInt(pagina_actual) + 1;
        getCancionesNombPagina(pagina_actual);
         
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