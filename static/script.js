// const newCalendar = { calendar }

// module.exports=function div(a,b){
//     if(b != 0){
//         return a / b;
//     }else {
//         return "No se puede dividir por 0";
//     }
// }


document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: '2022-01-07',
        locale: "es",
        headerToolbar: {
            left: 'prev,next today title',
            center: 'addEventButton',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        customButtons: {
            addEventButton: {
                text: 'Añadir cita',
                click: function () {
                    var dateStr = prompt('Introduzca una fecha con formato AAAA-MM-DD');
                    var hourStr = prompt('Introduzca una hora con formato HH:HH. Solo puede ser a "en punto" o "a y media" y tiene que ser entre las 08:00 y las 19:30');
                    var date = dateStr + 'T' + hourStr + ':00'; // will be in local time                    
                    if (validacionFecha(dateStr, hourStr)) { // valid?
                        calendar.addEvent({
                            title: 'Paciente - Dr',
                            start: date,
                            allDay: false
                        });
                        alert('Great. Now, update your database...');
                    } else {
                        alert('Formato de fecha incorrecto');
                    }
                }
            }
        },
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

            startTime: '08:00', // a start time (10am in this example)
            endTime: '20:00', // an end time (6pm in this example)
        },
        events: [
            
            // { 


            //     start: horaInicio,
            //     title: pacienteDoctor    //nombrepaciente + idmedico.nombre,                  

            // },
        {
            title: 'Long Event',
            start: '2022-01-07',
            end: '2022-01-10'
        },
        {
            groupId: '999',
            title: 'Repeating Event',
            start: '2022-01-09T16:00:00'
        },
        {
            groupId: '999',
            title: 'Repeating Event',
            start: '2022-01-16T16:00:00'
        },
        {
            title: 'Conference',
            start: '2022-01-11',
            end: '2022-01-13'
        },
        {
            title: 'MOD- Conference MOD',
            start: '2022-01-11'
        }
        ]
});

calendar.render();
});

function validacionFecha(dia, hora) {
    // "2022-01-28T08:08:00"
    const regExpDia = new RegExp(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
    const regExpHora = new RegExp(/^(0[8-9]|1[0-9]):[0,3][0]$/)
    return (regExpDia.test(dia) && regExpHora.test(hora))
}