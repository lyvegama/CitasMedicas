//! CONEXIONES
// Instalado
const bodyParser = require('body-parser');
const mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
// const pug = require('pug');
const express = require('express');

//! COMPILA EL ARCHIVO PUG
// const templateCompiler = pug.compileFile('./views/index.pug');

//! Recoge valores para que Pug los compile. (Para ver desde console  y no desde elestar todo el rato mirando navegador)
// console.log(templateCompiler({ name: 'Coke'}));
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');


app.use(express.static('static'));

// app.use(express.static('C:\Users\minue\Desktop\BOOTCAMP\Proyectos\CitasDr'));
// app.use(express.static('C:\Users\minue\Desktop\BOOTCAMP\Proyectos\CitasDr'));


var urlencodedParser = bodyParser.urlencoded({ extended: false })

//! INDICA EL MOTOR DE PLANTILLAS Y EL DIRECTORIO DONDE SE ALMACENAN
// app.set('views'); //Directorio
// app.set('view engine', 'pug'); // Motor es pug

const MongoClient = mongo.MongoClient;
const mydb = "CitasMedicas";
const coleccionM = "medicos";
const coleccionC = "citas";
const coleccionU = "usuarios";
const coleccionA = "agenda";
const url = "mongodb://localhost:27017/";

//! NOS MANDA A index.html al poner localhost:3001
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/registro.html');
});


//! PAGINA DE VALIDACIONES

//RECOGE LA INFORMACIÓN PARA REGISTRARSE

app.post('/registrar', urlencodedParser, (req, res) => {
    // console.log(req);
    var dni = req.body.dni;
    var pass = req.body.password1;
    var pass2 = req.body.password2;
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;

    var regExpDni = new RegExp(/^[0-9]{8}\-?[a-zA-Z]{1}/);
    var regExpName = new RegExp(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/); // Otro para apellidos por el espacio!!
    var regExpPass = new RegExp(/^(?=\w*\d)(?=\w*[a-zA-Z])\S{6,10}$/);
    // var regExpEmail = new RegExp(/^[a-zA-Z\.\_0-9]+\@[a-zA-Z]+\.[a-zA-Z]{3}/);

    //! Zona de validaciones

    var formatdniOk = regExpDni.test(dni) && validation_dni(dni);

    var dniOk = formatdniOk && validation_dni(dni);
    var passOk = regExpPass.test(pass);
    var pass2Ok = regExpPass.test(pass2);
    var mismoPass = pass == pass2;
    var nombreOk = regExpName.test(nombre);
    var apellidosOk = regExpName.test(apellidos);
    nombre != "" ? nombreOk = regExpName.test(nombre) : nombreOk = true;
    apellidos != "" ? apellidosOk = regExpName.test(apellidos) : apellidosOk = true;
    //var emailOk = regExpEmail.test(email); futuro

    var ok = dniOk && nombreOk && apellidosOk && passOk && pass2Ok && mismoPass;
    if (ok) {
        console.log("correcto los campos");

        var listaUsuarios = [];
        var listaMedicos = [];
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(mydb);
            dbo.collection(coleccionU).find({ "dni": dni }).toArray(function (err, listaUsuarios) {
                if (err) throw err;
                // !Si no lo encuentra se procede a registrar
                if (listaUsuarios[0] == undefined) {

                    dbo.collection(coleccionM).find({}).toArray(function (err, listaMedicos) {
                        if (err) throw err;
                        // console.log(listaMedicos);
                        var randomDc = [];
                        randomDc.push(listaMedicos[caos(0, 3)]);
                        console.log(randomDc);
                        console.log(randomDc[0]._id);
                        console.log(randomDc[0].turno);

                        var user = {
                            dni: dni,
                            pass: pass,
                            nombre: nombre,
                            apellidos: apellidos,
                            turno: randomDc[0].turno,
                            id_medico: randomDc[0]._id,
                            admin: false
                        }
                        // console.log(user);

                        //!Insertar Usuari

                        dbo.collection(coleccionU).insertOne(user, function (err, result) {
                            if (err) throw err;
                            console.log("Documento insertado");
                            db.close();
                            res.sendFile(__dirname + '/registroSuccess.html');
                        });
                    });
                } else {
                    db.close();
                    res.sendFile(__dirname + '/usuarioExist.html');
                }
            });
        });

    } else {

        res.sendFile(__dirname + '/error.html');
    }

});



app.post("/calendario", urlencodedParser, (req, res) => {
    login(req, res);
})


function login(req, res) {
    var dniLogin = req.body.dni;                     // RECOGE EL USUARIO            
    var passwordLogin = req.body.password3;                  // RECOGE LA PASSWORD

    // SE EJECUTA PARA SABER SI EXISTE ESTE USUARIO EN LA BD. DEVUELVE TRUE O FALSE
    obtenerUsuarioDB(dniLogin).then(async userExiste => {
        if (userExiste[0] === undefined) {                       // <-- ENTRA AQUÍ SI EL USUARIO NO EXISTE
            res.sendFile(__dirname + "/errorLogin.html");
        } else {                                            // ENTRA AQUÍ SI EL USUARIO HA SIDO ENCONTRADO EN LA BD
            if (userExiste[0].pass === passwordLogin) {     // SI LAS DOS PASSWORDS COINCIDEN ENTRA AQUÍ
                // PASSWORD CORRECTA
                console.log((JSON.stringify(userExiste[0].id_medico)));
                console.log(typeof("61f17ecb471ba266c5ae5408"));
                queryAgenda(JSON.stringify(userExiste[0].id_medico)).then(agenda => {
                    // client.close();
                    console.log("155: " + agenda);
                    console.log("156: " + agenda[0]);
                    console.log("157: " + agenda[0].citas);
                    let querysCitas = [];
                    for (let i = 0; i < agenda[0].citas.length; i++) {
                        querysCitas.push({ _id: ObjectId(agenda[0].citas[i]) });
                    }
                    // console.log(querysCitas);
                    async function queryCitas() {
                        let result = [];
                        for (let i = 0; i < querysCitas.length; i++) {
                            result.push(0);
                        }
                        try {
                            client = await MongoClient.connect(url);
                            db = client.db(mydb);

                            let dCollection = db.collection(coleccionC);
                            for (let i = 0; i < querysCitas.length; i++) {
                                result[i] = await dCollection.find(querysCitas[i]).toArray();
                            }
                            return result;
                        }
                        catch (err) { console.error(err); } // catch any mongo error here
                    }
                    //console.log(querysAutores);

                    queryCitas().then(citas => {
                        // client.close();

                        res.render("calendario.pug", citas);

                        // client.close();
                    })
                })

                
            } else {                                        // SI LAS DOS PASSWORDS NO COINCIDEN TE MANDA AQUÍ
                // PASSWORD NO CORRECTA
                console.log("entra por aqui")
                res.sendFile(__dirname + "/errorLogin.html");  // <-- HTML "USUARIO O PASSWORD ERRONEO" CON VINCULO AL LOGIN
            }
        }
    })
}



let client, db;
async function obtenerUsuarioDB(dniLogin) {

    try {
        client = await MongoClient.connect(url);
        db = client.db(mydb);
        let query = { "dni": dniLogin };
        let dCollection = db.collection(coleccionU);
        let result = await dCollection.find(query);

        return result.toArray();

    }
    catch (err) { console.error(err); } // catch any mongo error here

}


async function queryAgenda(id_medico) {
    try {
        client = await MongoClient.connect(url);
        console.log("224" + url);
        db = client.db(mydb);
        console.log("225" + mydb);
        let query = { "id_medico": id_medico };
        console.log("226" + query.id_medico);
        let dCollection = db.collection(coleccionA);
        console.log("coleccionA: " + coleccionA);
        let result = await dCollection.find(query);
        return result.toArray();
    }
    catch (err) {
        console.error(err);
    } // catch any mongo error here
}


app.listen(3001);


function validationFormat(dni) {
    dni = dni.toUpperCase();
    var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    var nums = parseInt(dni.substring(0, dni.length - 1));
    var letra = letras[nums % letras.length]; // [nums % letras.length] = posicion de la letra del array de la policia
    return dni.charCodeAt(8) >= "A".charCodeAt(0) && dni.charCodeAt(8) <= "Z".charCodeAt(0) && !isNaN(nums) && letra == dni[8];
}

function quitarGuion(dni) {
    var conGuion = dni.split("-");
    if (conGuion.length == 1) {
        return dni;
    } else {
        return conGuion[0] + conGuion[1];
    }
}

function validation_dni(dni) {
    dni = quitarGuion(dni);
    return validationFormat(dni);
}

// generar números aleatorios con mínimo y máximo
function caos(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// !**************************************************


// //! NOS MANDA A index.pug al poner localhost:3001/view
// app.get('/view', (req, res) => {
//     res.render('index.pug' {
//     eventos = ´´´´´daá´´ds
// }

 // Se muestra la plantilla view.pug
// });

//! Recoge la info de los usuarios

