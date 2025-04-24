
$(document).ready(function () {

    // DEPENDENCY: https://github.com/flatlogic/bootstrap-tabcollapse


    // if the tabs are in a narrow column in a larger viewport
    $('.sidebar-tabs').tabCollapse({
        tabsClass: 'visible-tabs',
        accordionClass: 'hidden-tabs'
    });

    // if the tabs are in wide columns on larger viewports
    $('.content-tabs').tabCollapse();

    // initialize tab function
    $('.nav-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // slide to top of panel-group accordion
    $('.panel-group').on('shown.bs.collapse', function () {
        var panel = $(this).find('.in');
        $('html, body').animate({
            scrollTop: panel.offset().top - 140
        }, 300);
    });

    //Ferry
    $('#ferryDepCodeList').editableSelect()
        .on('select.editable-select', function (e, li) {
            var depVal = li.attr('value');
            $('#ferry_ferryDepCode').val(depVal);
            $('#ferryArrCodeList').editableSelect('destroy');
            $.get($('#ferryDesURL').val() + '?depCode=' + depVal, function (data) {
                $('#ferryArrCodeList').find('option').remove().end();
                for (var i = 0; i < data.length; i++) {
                    $('#ferryArrCodeList').append('<option value="' + data[i].ID + '">' + data[i].Name + '</option>');
                }
                setupFerryArrList();
            });
        });

    var setupFerryArrList = function () {
        $('#ferryArrCodeList').editableSelect()
            .on('select.editable-select', function (e, li) {
                $('#ferry_ferryArrCode').val(li.attr('value'));
            });
    };

    setupFerryArrList();

    var now = moment();

    $('#ferryDepDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: now.clone().subtract(1, 'days') // allow yesterday and future dates
    }).on("dp.change", function (e) {
        $('#ferryArrDateDiv').data("DateTimePicker").minDate(e.date);
    });
    $('#ferryArrDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: now.setDate(now.getDate())
    });

    $('#ferry_ferryVehicleType').change(function () {
        //console.log($('#ferry_ferryVehicleType').val());
        if ($('#ferry_ferryVehicleType').val() != '00000000-0000-0000-0000-000000000000') {
            $('#ferry_ferryVehicleNo').val('1');
        } else {
            $('#ferry_ferryVehicleNo').val('0');
        }
    });
    
    //Transfer
    
    var transferFromOptions = {

        url: function (phrase) {
            return $('#transfer_dep_place').val() + '?phase=' + phrase;
        },

        getValue: "Name",

        list: {
            maxNumberOfElements: 12,
            showAnimation: {
                type: "fade",
                time: 400
            },

            hideAnimation: {
                type: "fade",
                time: 400
            },

            onChooseEvent: function () {
                $('#transfer_transferDepCode').val($("#TRANSFERFROM").getSelectedItemData().Code);
                $.get($('#transferDesURL').val() + '?depCode=' + $("#TRANSFERFROM").getSelectedItemData().Code, function (data) {
                    $('#transferArrCodeList').find('option').remove().end();
                    for (var i = 0; i < data.length; i++) {
                        $('#transferArrCodeList').append('<option value="' + data[i].ID + '">' + data[i].Name + '</option>');
                    }
                    setupFerryArrList();
                    $('#TRANSFERTO').hide();
                });
            },
            match: {
                enabled: true
            }
        },
        adjustWidth: false
    };

    $("#TRANSFERFROM").easyAutocomplete(transferFromOptions);
    

    //var setupTransferDepList = function () {
    //    $('#transferDepCodeList').editableSelect()
    //        .on('select.editable-select', function (e, li) {
    //            $('#transfer_transferDepCode').val(li.attr('value'));
    //        });
    //};
    //setupTransferDepList();
    $('#transferDepCodeList').change(function () {
        var depCode = $('#transferDepCodeList').val();
        $('#transfer_transferDepCode').val(depCode);
        $.get($('#transferDesURL').val() + '?depCode=' + depCode, function (data) {
            $('#transferArrCodeList').find('option').remove().end();
            for (var i = 0; i < data.length; i++) {
                $('#transferArrCodeList').append('<option value="' + data[i].ID + '">' + data[i].Name + '</option>');
            }
            setupFerryArrList();
            $('#TRANSFERTO').hide();
        });
        if (depCode == '*****') {
            $('#TRANSFERFROM').show();
            $('#transfer_transferDepCode').val("");
        } else {
            $('#TRANSFERFROM').hide();
        }
    });

    var transferToOptions = {

        url: function (phrase) {
            return $('#transfer_arr_place').val() + '?phase=' + phrase + '&depCode=' + $('#transfer_transferDepCode').val();
        },

        getValue: "Name",

        list: {
            maxNumberOfElements: 12,
            showAnimation: {
                type: "fade",
                time: 400
            },

            hideAnimation: {
                type: "fade",
                time: 400
            },

            onChooseEvent: function () {
                $('#transfer_transferArrCode').val($("#TRANSFERTO").getSelectedItemData().Code);
            },
            match: {
                enabled: true
            }
        },
        adjustWidth: false
    };
    $("#TRANSFERTO").easyAutocomplete(transferToOptions);
    $('#transferArrCodeList').change(function () {
        var arrCode = $('#transferArrCodeList').val();
        $('#transfer_transferArrCode').val(arrCode);
        if (arrCode == '*****') {
            $('#TRANSFERTO').show();
            $('#transfer_transferArrCode').val("");
        } else {
            $('#TRANSFERTO').hide();
        }
    });

    now = new Date();
    $('#transferDepDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: now.setDate(now.getDate() - 1)
    }).on("dp.change", function (e) {
        $('#transferArrDateDiv').data("DateTimePicker").minDate(e.date);
    });
    $('#transferArrDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: now.setDate(now.getDate() - 1)
    });

    $('#transferDepTimeDiv').datetimepicker({
        format: 'HH:mm',
        ignoreReadonly: true,
        allowInputToggle: true
    });
    $('#transferArrTimeDiv').datetimepicker({
        format: 'HH:mm',
        ignoreReadonly: true,
        allowInputToggle: true
    });


    //JoinTicket
    $('#joinTicketDepCodeList').editableSelect()
        .on('select.editable-select', function (e, li) {
            var depVal = li.attr('value');
            $('#joinTicket_joinTicketDepCode').val(depVal);
            $('#joinTicketArrCodeList').editableSelect('destroy');
            $.get($('#joinTicketDesURL').val() + '?depCode=' + depVal, function (data) {
                $('#joinTicketArrCodeList').find('option').remove().end();
                for (var i = 0; i < data.length; i++) {
                    $('#joinTicketArrCodeList').append('<option value="' + data[i].ID + '">' + data[i].Name + '</option>');
                }
                setupJoinTicketArrList();
            });
        });

    var setupJoinTicketArrList = function () {
        $('#joinTicketArrCodeList').editableSelect()
            .on('select.editable-select', function (e, li) {
                $('#joinTicket_joinTicketArrCode').val(li.attr('value'));
            });
    };

    setupJoinTicketArrList();

    now = new Date();
    $('#joinTicketDepDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: now.setDate(now.getDate() - 1)
    }).on("dp.change", function (e) {
        $('#joinTicketArrDateDiv').data("DateTimePicker").minDate(e.date);
    });;
    $('#joinTicketArrDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: now.setDate(now.getDate() - 1)
    });


    //Hotel
    $('#hotelCityCodeList').editableSelect()
        .on('select.editable-select', function (e, li) {
            var depVal = li.attr('value');
            $('#hotel_cityCode').val(depVal);
        });

    now = new Date();
    $('#hotelCheckInDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: now.setDate(now.getDate() - 1)
    }).on("dp.change", function (e) {
        $('#hotelCheckOutDateDiv').data("DateTimePicker").minDate(e.date.add(1, 'days') );
    });
    $('#hotelCheckOutDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: now.setDate(now.getDate() - 1)
    });

    //Tour
    $('#tourLocationList').editableSelect()
        .on('select.editable-select', function (e, li) {
            var depVal = li.attr('value');
            $('#tour_cityCode').val(depVal);
        });

    now = new Date();
    $('#tourDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: now.setDate(now.getDate() - 1)
    });

    //Flight
    now = new Date();
    now.setDate(now.getDate() + 3);
    var minDate = now;
    console.log(minDate);
    $('#flightDepDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        minDate: minDate
    }).on("dp.change", function (e) {
        $('#flightArrDateDiv').data("DateTimePicker").useCurrent(true);
        $('#flightArrDateDiv').data("DateTimePicker").minDate(e.date);
    });
    $('#flightArrDateDiv').datetimepicker({
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        allowInputToggle: true,
        useCurrent: false,
        minDate: minDate
    });

    var easyACOptions = {

        url: function (phrase) {
            return $('#city_url').val() + '?city=' + phrase;
        },

        getValue: "Name",
        list: {
            maxNumberOfElements: 12,
            showAnimation: {
                type: "fade",
                time: 400
            },

            hideAnimation: {
                type: "fade",
                time: 400
            }
        },
        adjustWidth: false
    };
    $("#DEPARTCITY").easyAutocomplete(easyACOptions);
    $("#RETURNCITY").easyAutocomplete(easyACOptions);
});

var setTab = function (tabId) {
    //remove on
    for (var i = 1; i <= 6; i++) {
        try {
            var currentSrc = $('#img-tab-' + i).attr('src');
            currentSrc = currentSrc.replace('_on.png', '.png');
            $('#img-tab-' + i).attr('src', currentSrc);
        }
        catch (exx) {}
    }

    //set on
    var onSrc = $('#img-tab-' + tabId).attr('src');
    onSrc = onSrc.replace('.png', '_on.png');
    $('#img-tab-' + tabId).attr('src', onSrc);

    //$('#searchType').val(tabId);
};

//Ferry
var selectFerryTripType = function (triptype) {
    $('#ferry_ferryTripType').val(triptype);
    if (triptype == 'D') {
        $('#ferryArrDateDiv').fadeOut();
    } else {
        $('#ferryArrDateDiv').fadeIn();
    }
};

var submitFerry = function (_form) {
    var errorList = [];
    if ($('#ferry_ferryDepCode').val() == '') {
        errorList.push('Please select departure point.');
        $('#ferry_ferryDepCodeList').addClass('error-input');
    }
    if ($('#ferry_ferryArrCode').val() == '') {
        errorList.push('Please select arrival point.');
        $('#ferry_ferryArrCodeList').addClass('error-input');
    }

    var adt = parseInt($('#ferry_ferryAdults').val());
    var chd = parseInt($('#ferry_ferryChilds').val());
    var veh = parseInt($('#ferry_ferryVehicleNo').val());

    if ((adt + chd + veh) == 0) {
        errorList.push('Please select at lease 1 passenger or vehicle.');
        $('#ferry_ferryAdults').addClass('error-input');
        $('#ferry_ferryChilds').addClass('error-input');
        $('#ferry_ferryVehicleNo').addClass('error-input');
    }

    if (veh == 0 && $('#ferry_ferryVehicleType').val() != '00000000-0000-0000-0000-000000000000') {
        errorList.push('Please select at lease 1 vehicle.');
        $('#ferry_ferryVehicleType').addClass('error-input');
        $('#ferry_ferryVehicleNo').addClass('error-input');
    }

    if (errorList.length <= 0) {
        _form.submit();
        $('#loading').modal('show');
    } else {
        var errorMsg = '<ul>';
        for (var i = 0; i < errorList.length; i++) {
            errorMsg += '<li>' + errorList[i] + '</li>';
        }
        errorMsg += '</ul>';
        $('#ferryError').html('');
        $('#ferryError').append(errorMsg);
        $('#ferryError').slideDown();
    }
};


//JoinTicket
var selectJoinTicketTripType = function (triptype) {
    $('#joinTicket_joinTicketTripType').val(triptype);
    if (triptype == 'D') {
        $('#joinTicketArrDateDiv').fadeOut();
    } else {
        $('#joinTicketArrDateDiv').fadeIn();
    }
};

var submitJoinTicket = function (_form) {
    var errorList = [];
    if ($('#joinTicket_joinTicketDepCode').val() == '') {
        errorList.push('Please select departure point.');
        $('#joinTicket_joinTicketDepCodeList').addClass('error-input');
    }
    if ($('#joinTicket_joinTicketArrCode').val() == '') {
        errorList.push('Please select arrival point.');
        $('#joinTicket_joinTicketArrCodeList').addClass('error-input');
    }

    if (errorList.length <= 0) {
        _form.submit();
        $('#loading').modal('show');
    } else {
        var errorMsg = '<ul>';
        for (var i = 0; i < errorList.length; i++) {
            errorMsg += '<li>' + errorList[i] + '</li>';
        }
        errorMsg += '</ul>';
        $('#joinTicketError').html('');
        $('#joinTicketError').append(errorMsg);
        $('#joinTicketError').slideDown();
    }
};

//Transfer
$('input[type="radio"][name="transfer.isPrivate"]').change(function () {
    if (this.value === "False") {
        $('#transferDepTimeDiv').hide(); $('#transferArrTimeDiv').hide();
    } else {
        $('#transferDepTimeDiv').show(); $('#transferArrTimeDiv').show();
    }
});

var selectTransferTripType = function (triptype) {
    $('#transfer_transferTripType').val(triptype);
    if (triptype == 'D') {
        $('#transferArrDateDiv').fadeOut();
        $('#transferArrTimeDiv').fadeOut();
    } else {
        $('#transferArrDateDiv').fadeIn();
        $('#transferArrTimeDiv').fadeIn();
    }
};

var submitTransfer = function (_form) {
    var errorList = [];
    if ($('#transfer_transferDepCode').val() == '') {
        errorList.push('Please select departure point.');
        $('#TRANSFERFROM').addClass('error-input');
    }
    if ($('#transfer_transferArrCode').val() == '') {
        errorList.push('Please select arrival point.');
        $('#TRANSFERTO').addClass('error-input');
    }


    if (errorList.length <= 0) {
        _form.submit();
        $('#loading').modal('show');
    } else {
        var errorMsg = '<ul>';
        for (var i = 0; i < errorList.length; i++) {
            errorMsg += '<li>' + errorList[i] + '</li>';
        }
        errorMsg += '</ul>';
        $('#transferError').html('');
        $('#transferError').append(errorMsg);
        $('#transferError').slideDown();
    }
};

//FT
var selectFTTripType = function (triptype) {
    $('#ft_ftTripType').val(triptype);
    if (triptype == 'D') {
        $('#ftArrDateDiv').fadeOut();
    } else {
        $('#ftArrDateDiv').fadeIn();
    }
}

var submitFT = function (_form) {
    var errorList = [];
    if ($('#ft_ftDepCode').val() == '') {
        errorList.push('Please select departure point.');
        $('#ft_ftDepCodeList').addClass('error-input');
    }
    if ($('#ft_ftArrCode').val() == '') {
        errorList.push('Please select arrival point.');
        $('#ft_ftArrCodeList').addClass('error-input');
    }


    if (errorList.length <= 0) {
        _form.submit();
        $('#loading').modal('show');
    } else {
        var errorMsg = '<ul>';
        for (var i = 0; i < errorList.length; i++) {
            errorMsg += '<li>' + errorList[i] + '</li>';
        }
        errorMsg += '</ul>';
        $('#ftError').html('');
        $('#ftError').append(errorMsg);
        $('#ftError').slideDown();
    }
}


//Flight

function ADULTS_setOptions(frm, objAdult, objChild, objInfant) {
    var Maximum = 9;
    var adtultVal = objAdult.options[objAdult.selectedIndex].value;
    if (objInfant != null) {
        objInfant.options.length = 0;
        for (q = 0; q <= adtultVal; q++) {
            objInfant.options[objInfant.options.length] = new Option(q, q);
        }//for
    }//if
    if (objChild != null) {
        objChild.options.length = 0;
        for (i = 0; i <= Maximum; i++) {
            if (adtultVal == i) {
                objChild.options[objChild.options.length] = new Option(0, 0);
                for (z = 1; z <= (Maximum - i); z++) {
                    objChild.options[objChild.options.length] = new Option(z, z);
                }//for
                break;
            }//if
        }//for

    }//if
}//fn

var selectFlightTripType = function (triptype) {
    $('#TYPEOFTRIP').val(triptype);
    if (triptype == 'D') {
        $('#flightArrDateDiv').fadeOut();
    } else {
        $('#flightArrDateDiv').fadeIn();
    }
}

var submitFlight = function (_form) {
    var errorList = [];
    if ($('#DEPARTCITY').val() == '') {
        errorList.push('Please select departure city.');
        $('#DEPARTCITY').addClass('error-input');
    }
    if ($('#RETURNCITY').val() == '') {
        errorList.push('Please select arrival city.');
        $('#RETURNCITY').addClass('error-input');
    }

    if (errorList.length <= 0) {
        _form.submit();
    } else {
        var errorMsg = '<ul>';
        for (var i = 0; i < errorList.length; i++) {
            errorMsg += '<li>' + errorList[i] + '</li>';
        }
        errorMsg += '</ul>';
        $('#flightError').html('');
        $('#flightError').append(errorMsg);
        $('#flightError').slideDown();
    }
};

//Hotel
var submitHotel = function (_form) {
    var errorList = [];
    if ($('#hotel_cityCode').val() == '') {
        errorList.push('Please select city.');
        $('#hotelCityCodeList').addClass('error-input');
    }


    if (errorList.length <= 0) {
        _form.submit();
        $('#loading').modal('show');
    } else {
        var errorMsg = '<ul>';
        for (var i = 0; i < errorList.length; i++) {
            errorMsg += '<li>' + errorList[i] + '</li>';
        }
        errorMsg += '</ul>';
        $('#hotelError').html('');
        $('#hotelError').append(errorMsg);
        $('#hotelError').slideDown();
    }
};


//Tour
var submitTour = function (_form) {
    var errorList = [];
    if ($('#tour_cityCode').val() == '') {
        errorList.push('Please select city.');
        $('#tourLocationList').addClass('error-input');
    }


    if (errorList.length <= 0) {
        _form.submit();
        $('#loading').modal('show');
    } else {
        var errorMsg = '<ul>';
        for (var i = 0; i < errorList.length; i++) {
            errorMsg += '<li>' + errorList[i] + '</li>';
        }
        errorMsg += '</ul>';
        $('#tourError').html('');
        $('#tourError').append(errorMsg);
        $('#tourError').slideDown();
    }
};