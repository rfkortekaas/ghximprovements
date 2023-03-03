// ==UserScript==
// @name         GHX Improvements
// @namespace    rfkortekaas
// @version      1.84
// @license      MIT
// @homepage     https://github.com/rfkortekaas/ghximprovements
// @updateURL    https://github.com/rfkortekaas/ghximprovements/blob/master/GHX%20Improvements.user.js?raw=true
// @downloadURL  https://github.com/rfkortekaas/ghximprovements/blob/master/GHX%20Improvements.user.js?raw=true
// @description  Improve GHX EBS
// @author       @rfkortekaas
// @match        https://surfnet-ebs.ghx.com/*
// @match        https://ebsnl.ghxeurope.com/*
// @match        http://ebs.ghx.com/*
//
// @resource     Select2 https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css
// @resource     JQuery_Modal https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js
// @require      https://cdn.jsdelivr.net/gh/rfkortekaas/MonkeyConfig@master/monkeyconfig.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
//
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

/* jshint esversion: 5 */
/* globals $, MonkeyConfig, jQuery, newLine, Cookies, moment */

GM_addStyle ( `
    .inputcount,
    #ghx-i-hide{
        font:inherit;
        margin:0;
        padding:0;
    }
    .inputcount{
        border:none;
        min-width:10px;
    }
    .ghx-i-hide{
        display:none;
        white-space:pre;
    }
    .modal span {
        display: flex;
        justify-content: flex-end;
        padding: .5em;
    }
    .modal span > label {
        padding: .5em 1em .5em 0;
        flex: 1;
    }
    .modal span > input,
    .modal span > select {
        flex: 2;
    }
    .modal span > input,
    .modal span > button,
    .modal span > select {
        padding: .5em;
    }
    .modal span > button {
        background: gray;
        color: white;
        border: 0;
    }
`);

var cfg = new MonkeyConfig({
    title: 'GHX Improvements Configuration',
    menuCommand: true,
    params:
    {
        account_uvahva:
        {
            label: 'UvAnetID/HvA-ID',
            type: 'checkbox',
            default: true
        },
        account_groupaccount:
        {
            label: 'Group Account',
            type: 'checkbox',
            default: true
        },
        default_delivery_location:
        {
            type: 'text',
            default: ''
        },
        default_order_unit:
        {
            type: 'select',
            choices: [ '', 'Bestel Eenheid', 'Doos', 'Meter', 'Stuks'],
            default: ''
        },
        default_cost_type:
        {
            type: 'text',
            default: ''
        },
        default_vat:
        {
            type: 'select',
            choices: [ '', '0%', '9%', '21%'],
            default: ''
        },
        open_in_tab:
        {
            name: 'Open shop in tab',
            type: 'checkbox',
            default: true
        },
        color_order_lines:
        {
            name: 'Color order lines in order receipt page',
            type: 'checkbox',
            default: true
        },
        pilot_hardware:
        {
            name: 'Pilot CMDB hardware',
            type: 'checkbox',
            default: false
        }
    }
});

(function() {
    'use strict';
    var Select2 = GM_getResourceText("Select2");
    GM_addStyle(Select2);
    var JQuery_Modal = GM_getResourceText("JQuery_Modal");
    GM_addStyle(JQuery_Modal);

    jQuery.noConflict();
    (function( $ ) {
        $(function() {
            document.title = "GHX Improved " + GM_info.script.version;
            var acc_ga = cfg.get('account_groupaccount');
            var acc_uvahva = cfg.get('account_uvahva');
            var dflt_del_loc = cfg.get('default_delivery_location');
            var dflt_order_unit = cfg.get('default_order_unit');
            var dflt_cost_type = cfg.get('default_cost_type');
            var dflt_vat = cfg.get('default_vat');
            var open_in_tab = cfg.get('open_in_tab');
            var pilot_hardware = cfg.get('pilot_hardware');
            var color_order_lines = cfg.get('color_order_lines');

            if ((window.location.href.indexOf("login.") > -1) || (window.location.href.indexOf("ebs.ghx") > -1))
            {
                if ( acc_uvahva === true && acc_ga === false)
                {
                    window.location.href = 'https://ebsnl.ghxeurope.com/synqeps/webroot/login/uvahva.cfm';
                }
                else
                {
                    window.location.href = "https://ebsnl.ghxeurope.com/synqeps/webroot/login_UVAHVA.cfm?skin=ghx/";
                }
            }
            else if (window.location.href.indexOf("login") > -1) {
                if ( acc_uvahva === true && acc_ga === false)
                {
                    // If only the UvAnetID/HvA-ID account is selected forward to the correct login page
                    window.location.href = 'https://ebsnl.ghxeurope.com/synqeps/webroot/login/uvahva.cfm';
                }
                else if ( acc_uvahva === true && acc_ga === true)
                {
                    document.forms.loginForm.removeAttribute('action');
                    document.forms.loginForm.removeAttribute('onsubmit');
                    $( ".buttonSmall" ).attr('formaction', 'login_UVAHVA_.cfm').attr('value', 'UvA Groupaccount Login').attr('onclick', 'return(checkForm());');
                    $( ".buttonSmall" ).clone().attr('formaction','https://ebsnl.ghxeurope.com/synqeps/webroot/login/uvahva.cfm').attr('value', 'UvAnetID Login').attr('onclick', '').appendTo("#inlog-button");
                }
            }
            else if (window.location.href.indexOf("nw_createReq") > -1 && $(".button_more").length)
            {
                // Replace the supplier selectbox with an improved searchable select box
                $(function ()
                {
                    $("#supplier").select2();
                });
                // Based on the new supplier selectbox disable or enable the custom supplier field
                $("#supplier").on("change", function ()
                {
                    if (this.value == "")
                    {
                        document.getElementById('supplierDescription').removeAttribute('disabled');
                        document.getElementById('supplierDescription').disabled=false;
                    }
                    else
                    {
                        document.getElementById('supplierDescription').disabled=true;
                    }
                });

                // Change the onclick call on the new line button
                $(".button_more").attr('onclick', 'javascript:ExtendedNewLine("'+cfg.get('default_order_unit')+'","'+cfg.get('default_cost_type')+'","'+cfg.get('default_vat')+'")');

                // Change default delivery location based on cfg `default_delivery_location`
                if (dflt_del_loc && $('#title').val() === '')
                {
                    $('#deliverylocation').val(dflt_del_loc);
                }

                // Select the default order unit if one is chosen in the configuration menu
                if (dflt_order_unit && $('select[name^="UOM"]').first().val() === '')
                {
                    $('select[name^="UOM"] option:contains("'+dflt_order_unit+'")').attr('selected', 'selected');
                }

                // Select the default cost type if one is chosen in the configuration menu
                if (dflt_cost_type && $('input[id^="costType"]').first().val() === '')
                {
                    $('input[id^="costType"]').first().val(dflt_cost_type);
                }

                // Select the default VAT if one is chosen in the configuration menu
                if (dflt_vat && $('select[name^="vat"]').first().val() === '')
                {
                    $('select[name^="vat"] option:contains("'+dflt_vat+'")').last().attr('selected', 'selected');
                }

                // Loop over all product description textarea's
                $('textarea[id^="unlistedproduct"]').each(function () {
                    // Create a new input text field for the product description
                    var input = $('<input type="text" />').attr({
                        'id': $(this).attr('id'),
                        'name': $(this).attr('name'),
                        'class': 'inputtext no-right-margin',
                        'size': '54',
                        'maxlength': '40',
                        'value': $(this).val()
                    });
                    // Replace the textarea with the new input text field for improved layout
                    $(this).replaceWith(input);
                });

                // Add the price edit button and set the validate function on focus out for the price field
                $('input[id^="price"]').each(function (index) {
                    if ( $(this).attr('id') != 'priceFAV')
                    {
                        $(this).parent().addClass('no-left-padding').removeClass('align-center').before(`
                            <td class="td-in no-right-padding">
                                <a id="mdlPrice${index+1}" href="#mdlPrice" data-modal data-index="${index+1}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor" style="display: inline-block">
                                        <path d="M9 13v-2a3 3 0 1 1 0-6V4a1 1 0 1 1 2 0v1h.022A2.978 2.978 0 0 1 14 7.978a1 1 0 0 1-2 0A.978.978 0 0 0 11.022 7H11v2a3 3 0 0 1 0 6v1a1 1 0 0 1-2 0v-1h-.051A2.949 2.949 0 0 1 6 12.051a1 1 0 1 1 2 0 .95.95 0 0 0 .949.949H9zm2 0a1 1 0 0 0 0-2v2zM9 7a1 1 0 1 0 0 2V7zm1 13C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path>
                                    </svg>
                                </a>
                            </td>
                        `);
                        $(this).attr('onfocusout', 'ValidatePrice(event)');
                    }
                });

                // Change the size of the costType field
                $('input[id^="costType"]').each(function () {
                    $(this).attr('size', '1');
                });
                // Change the size of the quantity field
                $('input[id^="quantity"]').each(function () {
                    $(this).attr('size', '4');
                });

                // Select table header cells and improve the layout
                $( "th:contains('Cost type')" ).attr('width', '6%').addClass('align-center').removeClass('align-right').html('Cost<br />type');
                $( "th:contains('Kostensoort')" ).attr('width', '6%').addClass('align-center').removeClass('align-right').html('Kosten<br />soort');
                $( "th:contains('Amount'), th:contains('Aantal')" ).addClass('align-center').removeClass('align-right');
                $( "th:contains('VAT'), th:contains('BTW')" ).addClass('align-center').removeClass('align-right');
                $( "th:contains('Price')" ).attr('width', '20%').attr('colspan', '2').html('Price (€)<br />ex. VAT');
                $( "th:contains('Prijs')" ).attr('width', '20%').attr('colspan', '2').html('Prijs (€)<br />ex. BTW');

                // Append the price modal to the body
                $("body").append(`
                    <!-- Modal HTML embedded directly into document -->
                    <div id="mdlPrice" class="modal">
                        <form style="display: flex; flex-direction: column;">
                            <span><label for="mdlVAT">VAT</label><select><option data-vat="1">0%</option><option data-vat="1.09">9%</option><option data-vat="1.21">21%</option></select></span>
                            <span><label for="mdlPriceInputInc">Incl. VAT</label><input type="text" id="mdlPriceInputInc"></span>
                            <span><label for="mdlPriceInputExc">Excl. VAT</label><input type="text" id="mdlPriceInputExc"></span>
                        </form
                    </div>
                `);

                var currentVAT = 1;
                var lastchanged = 'exc';
                var currentIndex = 0;

                // Show the modal when clicking on the row icon and fill in default data
                $(document).on("click", 'a[data-modal]', function()
                {
                    // Set the current row index
                    currentIndex = $(this).data('index');
                    currentVAT = parseFloat('1.'+$('select[name^="vat"][name$="'+currentIndex+'"]').find(':selected').html().replace(/\D/g,''), 10);
                    // Only allow model close by clicking the close button
                    $(this).modal({ clickClose: false,});
                    // Enter the modal name base on the description
                    $(".modal p:first").html(`Price for ${$('[id ^="unlistedproduct"][id $="'+currentIndex+'"]').val()}`);
                    // Set the ex. VAT price to the current row price
                    $(".modal #mdlPriceInputExc").val(parseFloat($('[id ^="price"][id $="'+currentIndex+'"]').val() ,10).toFixed(2));
                    // Calculate the inc. VAT price from the row price and VAT setting
                    $('.modal #mdlPriceInputInc').val(($('.modal #mdlPriceInputExc').val() * currentVAT).toFixed(2));
                    // Select the current VAT in the modal window
                    $('.modal select option:contains("'+$('select[name^="vat"][name$="'+currentIndex+'"]').find(':selected').html().trim()+'")').attr('selected', 'selected');
                    return false;
                });

                // On VAT change calculate the new price based on the last changed value
                $('.modal select').on('change', function()
                {
                    currentVAT = parseFloat($(this).find(':selected').data('vat'), 10);
                    if (lastchanged == 'inc')
                    {
                        $('.modal #mdlPriceInputExc').val(($('.modal #mdlPriceInputInc').val() / currentVAT).toFixed(2));
                    }
                    if (lastchanged == 'exc')
                    {
                        $('.modal #mdlPriceInputInc').val(($('.modal #mdlPriceInputExc').val() * currentVAT).toFixed(2));
                    }
                });

                // When changing one of the price fields calculate the new price.
                $('.modal').on('keyup', '#mdlPriceInputInc', function()
                {
                    var currentPrice = parseFloat($(this).val(), 10);
                    if (!isNaN(currentPrice))
                    {
                        $('.modal #mdlPriceInputExc').val((currentPrice / currentVAT).toFixed(2));
                        lastchanged = 'inc';
                    }
                });
                $('.modal').on('keyup', '#mdlPriceInputExc', function()
                {
                    var currentPrice = parseFloat($(this).val(), 10);
                    if (!isNaN(currentPrice))
                    {
                        $('.modal #mdlPriceInputInc').val((currentPrice * currentVAT).toFixed(2));
                        lastchanged = 'exc';
                    }
                });

                // On modal close update the current row.
                $('.modal').on($.modal.BEFORE_CLOSE, function(event, modal) {
                    $('[id ^="price"][id $="'+currentIndex+'"]').val($('.modal #mdlPriceInputExc').val());
                    $('select[name^="vat"][name$="'+currentIndex+'"] option:contains("'+$('.modal select').find(':selected').html().trim()+'")').attr('selected', 'selected');
                });
            }
            else if (window.location.href.indexOf("nw_order.") > -1)
            {
                // Change default delivery location based on cfg `default_delivery_location`
                // Only change the delivery location on the first entry of a new order (based on filled in title)
                if (dflt_del_loc && $('#title').val() === '')
                {
                    $('#deliverylocation').val(dflt_del_loc);
                }
                var orderid = getUrlParameter('orderid');
                if (pilot_hardware && (!orderid))
                {
                    // Append the hardware pilot modal to the body
                    $("body").append(`
                        <!-- Modal HTML embedded directly into document -->
                        <div id="mdlPilot" class="modal">
                            <div class="modal-header">
                                <h2 class="modal-title" id="modal-title">Hardware pilot required information</h2>
                            </div>
                            <form style="display: flex; flex-direction: column;">
                                <span><label for="mdlId">HvA-ID/UvAnetId</label><input type="text" id="mdlId"></span>
                                <span><label for="mdlMyPUP">MyPup-ID</label><input type="text" id="mdlMyPUP"></span>
                            </form
                        </div>
                    `);

                    $('#mdlPilot').modal();
                    // On modal close update the current row.
                    $('.modal').on($.modal.BEFORE_CLOSE, function(event, modal) {
                        if ($('.modal #mdlId').val() != "") {
                            $('#title').val('Pilot ' + $('.modal #mdlId').val());
                        }
                        if ($('.modal #mdlMyPUP').val() != "") {
                            $('#deliverylocation').val($('.modal #mdlMyPUP').val());
                        }
                    });
                }
            }
            else if (window.location.href.indexOf("nw_supplierInfo") > -1)
            {
                // Replace the supplier selectbox with an improved searchable select box
                $(function ()
                {
                    $("select").select2();
                });
                // If the selectbox is changed reload the page to show the supplier information
                $('select').on("change", function ()
                {
                    var fld = $(this).children("option:selected").val();
                    location.href='nw_supplierInfo.cfm?topsupplier='+fld+'&orderID=';
                });
            }
            else if (window.location.href.indexOf("nw_searchOrderReceipt.cfm") > -1)
            {
                // Replace the supplier selectbox with an improved searchable select box
                $(function () {
                    $("select").select2();
                });

                $('form[name="searchForm"]').attr('method', 'GET');

                if (color_order_lines) {
                    var orderstatus = getUrlParameter('orderstatus');
                    var index = 1
                    $("th:contains('Afleverdatum'), th:contains('Delivery')").prevAll('th').each(function() {
                        index += this.colSpan;
                    });

                    if (orderstatus == '25,32') {
                        $('tr:gt(0) td:nth-child('+index+')').each(function () {
                            if (moment($(this).html(), 'DD-MM-YYYY').isBefore(moment(), 'day')) {
                                $(this).parent().css('background', 'red');
                            }
                            else if (moment($(this).html(), 'DD-MM-YYYY').isSame(moment(), 'day')) {
                                $(this).parent().css('background', 'green');
                            }
                        });
                    }
                }
            }
            else if (window.location.href.indexOf("nw_overview") > -1)
            {
                if ($("a[href^='nw_orderReceipt'").length == 0)
                {
                    console.log('ww');
                    $(".inputcount").each(function ( index )
                    {
                        // Insert span element before input to improve layout
                        $($(".inputcount")[index]).before('<span class="ghx-i-hide '+index+'"></span>');
                        // Remove `readonly` attribue from the amount input
                        $($(".inputcount")[index]).removeAttr('readonly');
                    });
                }
                else
                {
                    console.log('order');
                    // Add `readonly` attribute to the amount input if send to the supplier
                    $(".inputcount").each(function ( index )
                    {
                        $($(".inputcount")[index]).attr('readonly', 'readonly');
                    });
                }

                // Set the width of all input fields to display the complete contents
                setInterval(function()
                {
                    $(".inputcount").each(function ( index )
                    {
                        $('.ghx-i-hide.'+index).text($($(".inputcount")[index]).val());
                        $($(".inputcount")[index]).width($('.ghx-i-hide.'+index).width());
                    });
                }, 100);
            }
            else if (window.location.href.indexOf("nw_searchOrder.cfm") > -1)
            {
                // On a first entry of the search order page change the from date to include 100 days more
                if (document.referrer.indexOf("nw_searchOrder.cfm") == -1)
                {
                    var Older = new Date();
                    Older.setDate(Older.getDate() - 100);
                    document.getElementById('reqdatefrom').value=Older.toISOString().slice(0,10);
                    $( ".buttonSmall" ).trigger( "click" );
                }
            }
            else if ((window.location.href.indexOf("nw_browse") > -1) || (window.location.href.indexOf("nw_productRange") > -1))
            {
                if (open_in_tab)
                {
                    // Loop over each shop button
                    $(".shop-button").each(function()
                    {
                        // Select the existing onClick attribute and extract the catalogid from this
                        var click = $(this).attr("onclick");
                        if (click.indexOf('selectOCICatalog') > -1)
                        {
                            var catalogid = click.substring(click.indexOf("(")+2, click.indexOf(")")-1);
                            var orderid = getUrlParameter('orderID');
                            // Create the new onClick function and replace the exisiting
                            $(this).attr("onclick",'window.open("getOCI.cfm?ORDERID='+orderid+'&CATALOGID='+catalogid+'", "_blank")');
                    }
                    });
                }
            }
        });
    })(jQuery);
})();

//-------------------------------------
// To be injected js follows after this
// ------------------------------------

// Extending the newLine function to insert default values and improve the layout
function ExtendedNewLine(order_unit, cost_type, vat)
{
    // Call the original newLine function to insert a new line
    newLine();

    // If an order unit is specified set the option field selected for the correct order unit.
    if (order_unit)
    {
        $('select[name^="UOM"] option:contains("'+order_unit+'")').last().attr('selected', 'selected');
    }
    // If a cost type is specified set the input field to the correct cost type
    // As there is a hidden input field costTypeFav as last element we need to use `eq(-2)` to
    // select the before-last element
    if (cost_type)
    {
        $('input[name^="costType"]').eq(-2).val(cost_type).attr('size', '1');
    }
    // If a vat is specified set the option field selected for the correct order unit.
    if (vat)
    {
        $('select[name^="vat"] option:contains("'+vat+'")').last().attr('selected', 'selected');
    }
    // Create a new input text field for the product description
    var input2 = $('<input type="text" />').attr({
        'id': $('textarea[id^="unlistedproduct"]').last().attr('id'),
        'name': $('textarea[id^="unlistedproduct"]').last().attr('name'),
        'class': 'inputtext no-right-margin',
        'size': '54',
        'maxlength': '40',
        'value': $('textarea[id^="unlistedproduct"]').last().val()
    });
    // Replace the textarea with the new input text field for improved layout
    $('textarea[id^="unlistedproduct"]').last().replaceWith(input2);
    // Reduce the size of the quantity field
    $('input[id^="quantity"]').last().attr('size', '4');

    // Add the price edit button and set the validate function on focus out for the price field
    var mdlIndex = $('input[id^="price"][type="text"]').last().attr('id').replace(/\D/g,'');
    $('input[id^="price"][type="text"]').last().parent().addClass('no-left-padding').removeClass('align-center').before(`
            <td class="td-in no-right-padding">
                <a id="mdlPrice${mdlIndex}" href="#mdlPrice" data-modal data-index="${mdlIndex}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor" style="display: inline-block">
                        <path d="M9 13v-2a3 3 0 1 1 0-6V4a1 1 0 1 1 2 0v1h.022A2.978 2.978 0 0 1 14 7.978a1 1 0 0 1-2 0A.978.978 0 0 0 11.022 7H11v2a3 3 0 0 1 0 6v1a1 1 0 0 1-2 0v-1h-.051A2.949 2.949 0 0 1 6 12.051a1 1 0 1 1 2 0 .95.95 0 0 0 .949.949H9zm2 0a1 1 0 0 0 0-2v2zM9 7a1 1 0 1 0 0 2V7zm1 13C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path>
                    </svg>
                </a>
            </td>
            `);
    $('input[id^="price"][type="text"]').last().attr('onfocusout', 'ValidatePrice(event)');
}

// Price cannot contain a comma; should be replaced with a dot
// Function is run on focus out of the price entry
function ValidatePrice(event)
{
    // Select the input field using the current event target id and call a function to replace the comma with a dot
    $('input[id^="'+event.target.id+'"]').val(function(index, value) {
        return value.replace(',','.');
    });
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

// Create a new HTML Script element to inject javascript functions in the page context
var script = document.createElement('script');
script.appendChild(document.createTextNode(ExtendedNewLine));
script.appendChild(document.createTextNode(ValidatePrice));
script.appendChild(document.createTextNode(getUrlParameter));
(document.body || document.head || document.documentElement).appendChild(script);
