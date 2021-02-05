$(document).ready(function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        //height: '100%',
        //wight: '100%',
        expandRows: true,
        timeZone: 'Asia/Novosibirsk',
        themeSystem: 'bootstrap',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        //weekNumbers: true,
        initialView: 'dayGridMonth',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        selectable: true,
        nowIndicator: true,
        dayMaxEvents: true, // allow "more" link when too many events
        locale: 'ru',
        showNonCurrentDates: false,
        eventClick: function (info) {
            var date = String(new Date(info.event.start).toISOString());
            var day = date.substring(8, 10);
            var month = date.substring(5, 7);
            var year = date.substring(0, 4);

            var bornYear = new Number(info.event.extendedProps.year);

            $('#modalTitle').html(info.event.title);
            $('#birthDate').html(([day, month, year]).join('.'));
            $('#city').html(info.event.extendedProps.city);

            //console.log(bornYear);
            //console.log(new Date(info.event.start).getFullYear() - bornYear);
            switch (new Date(info.event.start).getFullYear() - bornYear) {
                case 50:
                case 60:
                    //case 65:
                case 70:
                case 80:
                    $('#superDate').html('Юбилей:' + (new Date(info.event.start).getFullYear() - bornYear));
                    break;
                default:
                    $('#superDate').html('');
                    break;
            }

            $('#birthModal').modal('show');
        },
        events: function (params, successCallback, failureCallback) {
            var data = [];
            $.ajax({
                type: 'GET',
                //url: '../json/data.json',
                url: '../json/birthDates.json',
                // data: {
                //     start: params['start'].valueOf(),
                //     end: params['end'].valueOf()
                // },
                success: function (response) {
                    data = response;
                    data = data.filter(function (i, n) {
                        var year = new Date(params['start'].valueOf()).getFullYear();
                        if (String(i.month).length == 1) {
                            i.month = '0' + String(i.month);
                        }
                        if (String(i.day).length == 1) {
                            i.day = '0' + String(i.day);
                        }

                        switch (i.dep2) {
                            case 'УИТ':
                                i.color = 'yellow';
                                i.textColor = 'black';
                                break;
                            case 'VIP':
                                i.color = 'rgb(159, 127, 219)';
                                i.textColor = 'white';
                                break;
                            case 'BOSS':
                                i.color = 'rgb(255, 110, 110)';
                                i.textColor = 'white';
                                break;
                            default:
                                i.color = 'transparent';
                                i.textColor = 'black';
                                break;

                        }

                        switch (year - i.year) {
                            case 50:
                            case 60:
                                //case 65:
                            case 70:
                            case 80:
                                i.color = 'green';
                                i.textColor = 'white';
                                break;
                        }


                        var startDate = ([year, i.month, i.day]).join('-');
                        i.title = i.fio;
                        i.start = startDate;
                        //console.log(new Date(params['start']));
                        return new Date(i.start).getTime() > params['start'].valueOf();
                    });
                    //console.log(data);
                    successCallback(data);
                    //console.log(JSON.parse(data));
                }
            });
        },        
    });
    calendar.render();
})