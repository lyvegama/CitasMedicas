
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const mydb = "CitasMedicas";
const coleccionM = "medicos";
const coleccionC = "citas";
const coleccionU = "usuarios";
const coleccionA = "agenda";
const url = "mongodb://localhost:27017/";

var ObjectId = require('mongodb').ObjectId;


let client, db, dCollection;
// async function queryAgenda(id_medico) {

//     try {
//         client = await MongoClient.connect(url);
//         db = client.db(mydb);
//         let query = {"id_medico": id_medico};
//         let dCollection = db.collection(coleccionA);
//         let result = await dCollection.find(query);

//         return result.toArray();

//     }
//     catch (err) { console.error(err); } // catch any mongo error here

// }


// queryAgenda("61f17f50471ba266c5ae5409").then(agenda => {
//     client.close();
//     // console.log("*****************\n" + a[0].citas); 
//     let querysCitas = [];
//     for (let i = 0; i < agenda[0].citas.length; i++) {
//         querysCitas.push({ _id: ObjectId(agenda[0].citas[i]) });
//     }
//     // console.log(querysCitas);
//     async function queryCitas() {
//         let result = [];
//         for (let i = 0; i < querysCitas.length; i++) {
//             result.push(0);
//         }
//         try {
//             client = await MongoClient.connect(url);
//             db = client.db(mydb);

//             let dCollection = db.collection(coleccionC);
//             for (let i = 0; i < querysCitas.length; i++) {
//                 result[i] = await dCollection.find(querysCitas[i]).toArray();
//             }

//             return result;

//         }
//         catch (err) { console.error(err); } // catch any mongo error here

//     }

//     //console.log(querysAutores);

//     queryCitas().then(citas => {
//         client.close();
//         for (let i = 0; i < citas.length; i++) {

//             console.log(citas[i][0].estado);
//         }

//         // client.close();
//     })

// });
// let dCollection;
// var query;
// async function reservarCita(dia, hora, id_medico, id_paciente) {
//    query = { "dia": dia, "hora": hora, "id_medico": id_medico}

//     try {
//         client = await MongoClient.connect(url);
//         db = client.db(mydb);
//         dCollection = db.collection(coleccionC);
//         let result = dCollection.find(query);

//         return result.toArray();

//     }
//     catch (err) { console.error(err); } // catch any mongo error here
// }

// // reservarCita("1", "13.5", "61f17ecb471ba266c5ae5408").then(cita => {
// //     // console.log(cita);
// //     if (cita[0].estado == "O" || cita[0].estado == "N") {
// //         console.log("No se puede reservar cita");
// //     } else {
// //         console.log("Sí se puede reservar");
// //     }
// //     client.close();
// // });

// reservarCita("2022-01-01", "13:30:00", "61f17ecb471ba266c5ae5408", "61f17ecb471ba266c5ae5718").then(async function (cita) {
//     console.log(cita);
//     // client.close();
//     if (cita[0].estado == "O" || cita[0].estado == "N") {
//         console.log("No se puede reservar cita");
//     } else {
//         console.log("Sí se puede reservar");
//         try {
//             client = await MongoClient.connect(url);
//             db = client.db(mydb);
//             dCollection = db.collection(coleccionC);
//             // var query = { "dia": "2022-01-01", "hora": "13:30:00", "id_medico": "61f17ecb471ba266c5ae5408" }
//             var newvalues = { $set: { "title": "Pepa Antonia Martínez", "estado": "O", "id_paciente":"61f17ecb471ba266c5ae5718" } };
//             dCollection.updateOne(query, newvalues, function (err, res) {
//                 if (err) throw err;
//                 console.log("Documento actualizado");

//             });

//         }
//         catch (err) { console.error(err); } // catch any mongo error he

//     }
// });
// var query;
// async function cancelDate(id_medico, start) {
//     query = { "id_medico": id_medico, "start": start }
//     try {
//         client = await MongoClient.connect(url);
//         db = client.db(mydb);
//         dCollection = db.collection(coleccionC);
//         let result = dCollection.find(query);

//         return result.toArray();

//     }
//     catch (err) { console.error(err); } // catch any mongo error here
// }
// cancelDate("61f17ecb471ba266c5ae5408", "2022-01-01T08:00:00").then(async function (cita) {
//     // console.log(cita);
//     var newvalues;

//     if (cita[0].estado == "L") {
//         newvalues = { $set: { "estado": "N" } };
//     } else {

//     }
//     try {
//         client = await MongoClient.connect(url);
//         db = client.db(mydb);
//         dCollection = db.collection(coleccionC);
//         dCollection.updateOne(query, newvalues, function (err, res) {
//             if (err) throw err;
//             console.log("Documento actualizado");

//         });
//     }
//     catch (err) { console.error(err); } // catch any mongo error he
// })


async function queryCitasMedico(id_medico) {

    try {
        client = await MongoClient.connect(url);
        db = client.db(mydb);
        let query = {"id_medico": id_medico};
        let dCollection = db.collection(coleccionC);
        let result = await dCollection.find(query);

        return result.toArray();

    }
    catch (err) { console.error(err); } // catch any mongo error here

}
queryCitasMedico("61f17ecb471ba266c5ae5408").then(citas =>{
    console.log(citas);
    client.close();
        // console.log("*****************\n" + a[0].citas); 
        let querysCitas = [];
        for (let i = 0; i < citas.length; i++) {
            querysCitas.push({ _id: ObjectId(citas[i]._id) });
        }
        // console.log(querysCitas);
        async function queryCambiarCitas() {
            // let result = [];
            // for (let i = 0; i < querysCitas.length; i++) {
            //     result.push(0);
            // }
            try {
                client = await MongoClient.connect(url);
                db = client.db(mydb);
            var newvalues = { $set: { "estado": "N", "title": "", "id_paciente": "" } };
                let dCollection = db.collection(coleccionC);
                for (let i = 0; i < querysCitas.length; i++) {
                    await dCollection.updateOne(querysCitas[i], newvalues);
                }
        
            }
            catch (err) { console.error(err); } // catch any mongo error here
    
        }
    
        //console.log(querysAutores);
    
        queryCambiarCitas().then(() => {
            console.log("cambiadas");
            // client.close();
        })
    
})



// var start;
// function cancelDay(id_medico, dia, turno) {
//     if (turno == "M") {
//         start = dia + "T08:00:00";

//         for (let i = 8; i < 14; i++) {
//             console.log("1: "+start)
//             //cancelDate(id_medico, start);
//              //"2022-01-01T08:00:00",
            
             
//              start = start.replaceAt(14, "3");
//              console.log("2: "+start)
//              //cancelDate(id_medico, start);
//              start = start.replaceAt(14, "0");
             
//              if(i<10){
//                 start = start.replaceAt(12, `${i+1}`);
                
//              }else{
//                 start = start.replaceAt(10, `${i/10}`);
//                 start = start.replaceAt(11, `${i%10}`);
                
//              }
//             //  console.log("3: "+start)
     
//          }
//     } /* else {
//         start = dia + "T14:00:00";
//         for (let i = 14; i < ; i++) {
//             cancelDay(id_medico, start);
//             var partsDate = start.split(":");
//             //"2022-01-01T08:00:00",
//             //[2022-01-01T08, 00, 00]
//              partsDate[0][partsDate.length-1] = 
     
     
//          } */
//     }

//     String.prototype.replaceAt = function(index, replacement) {
//         return this.substr(0, index) + replacement + this.substr(index + replacement.length);
//     }
  
//     cancelDay("A","2022-01-01","M");
