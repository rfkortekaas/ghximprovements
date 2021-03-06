
// ==UserScript==
// @name         GHX Improvements
// @version      1.1
// @homepage     https://github.com/rfkortekaas/ghximprovements
// @updateURL    https://github.com/rfkortekaas/ghximprovements/blob/master/GHX%20Improvements.user.js?raw=true
// @downloadURL  https://github.com/rfkortekaas/ghximprovements/blob/master/GHX%20Improvements.user.js?raw=true
// @description  Improve GHX EBS
// @author       @rfkortekaas
// @match        https://surfnet-ebs.ghx.com/*/nw_overview.cfm*
// @match        https://surfnet-ebs.ghx.com/*/index.cfm*
// @match        https://surfnet-ebs.ghx.com/*/nw_createReq.cfm*
// @match        https://surfnet-ebs.ghx.com/*/nw_supplierInfo.cfm*
// @match        https://surfnet-ebs.ghx.com/*/login.cfm*
// @match        https://surfnet-ebs.ghx.com/*/nw_searchOrderReceipt.cfm*
// @match        https://surfnet-ebs.ghx.com/*/nw_searchOrder.cfm*
// @match        https://ebs.ghx.com/*
//
// @resource     Select2 https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js
//
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// ==/UserScript==

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
` );

(function() {
    'use strict';
    var Select2 = GM_getResourceText("Select2");
    GM_addStyle(Select2);

    jQuery.noConflict();
    (function( $ ) {
        $(function() {
            document.title = "GHX Improved 1.1";

            if (window.location.href.indexOf("login") > -1) {
                window.location.href = "https://surfnet-ebs.ghx.com/synqeps/webroot/login_UVAHVA.cfm?skin=ghx/";
            }
            else if (window.location.href.indexOf("index") > -1) {
                window.location.href = "https://surfnet-ebs.ghx.com/synqeps/webroot/login_UVAHVA.cfm?skin=ghx/";
            }
            else if (window.location.href.indexOf("https://ebs") > -1) {
                window.location.href = "https://surfnet-ebs.ghx.com/synqeps/webroot/login_UVAHVA.cfm?skin=ghx/";
            }
            else if (window.location.href.indexOf("nw_createReq") > -1) {
                $(function () {
                    $("select").select2();
                });
                $("#supplier").on("change", function () {
                    if (this.value == "") {
                        document.getElementById('supplierDescription').removeAttribute('disabled');
                        document.getElementById('supplierDescription').disabled=false;
                    }
                    else {
                        document.getElementById('supplierDescription').disabled=true;
                    }
                });
            }
            else if (window.location.href.indexOf("nw_supplierInfo") > -1) {
                $(function () {
                    $("select").select2();
                });
                $('select').on("change", function () {
                    var fld = $(this).children("option:selected").val();
                    location.href='nw_supplierInfo.cfm?topsupplier='+fld+'&orderID=';
                });
            }
            else if (window.location.href.indexOf("nw_searchOrderReceipt.cfm") > -1) {
                $(function () {
                    $("select").select2();
                });
            }
            else if (window.location.href.indexOf("nw_overview") > -1) {
                $(".inputcount").each(function ( index ) {
                    $($(".inputcount")[index]).before('<span class="ghx-i-hide '+index+'"></span>');
                    $($(".inputcount")[index]).removeAttr('readonly');
                });

                setInterval(function(){
                    $(".inputcount").each(function ( index ) {
                        $('.ghx-i-hide.'+index).text($($(".inputcount")[index]).val());
                        $($(".inputcount")[index]).width($('.ghx-i-hide.'+index).width());
                    });
                }, 100);
            }
            else if (window.location.href.indexOf("nw_searchOrder.cfm") > -1) {
                if (document.referrer.indexOf("nw_searchOrder.cfm") == -1) {
                    var Older = new Date();
                    Older.setDate(Older.getDate() - 100);
                    document.getElementById('reqdatefrom').value=Older.toISOString().slice(0,10);
                    $( ".buttonSmall" ).trigger( "click" );
                }
            }
        });
    })(jQuery);
})();

