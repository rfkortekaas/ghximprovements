// ==UserScript==
// @name         GHX Improvements
// @version      0.3
// @homepage     https://gist.github.com/rfkortekaas
// @description  Improve GHX EBS
// @author       @rfkortekaas
// @match        https://ebs.ghx.com/*/nw_overview.cfm*
// @match        https://ebs.ghx.com/*/index.cfm*
// @match        https://ebs.ghx.com/*/nw_createReq.cfm*
// @match        https://ebs.ghx.com/*/nw_supplierInfo.cfm*
// @match        https://ebs.ghx.com/*/login.cfm*
//
// @resource     Select2 https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js
//
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    var Select2 = GM_getResourceText("Select2");
    GM_addStyle(Select2);

    jQuery.noConflict();
    (function( $ ) {
        $(function() {
            document.title = "GHX Improved 0.3";

            if (window.location.href.indexOf("login") > -1) {
                window.location.href = "https://ebs.ghx.com/synqeps/webroot/login_UVAHVA.cfm?skin=ghx/";
            }
            else if (window.location.href.indexOf("index") > -1) {
                window.location.href = "https://ebs.ghx.com/synqeps/webroot/login_UVAHVA.cfm?skin=ghx/";
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
            else {
                var els = document.getElementsByClassName('inputcount'), elLength = els.length;

                for (var i = 0; i < elLength; i++) {
                    els.item(i).removeAttribute('readonly');
                };
            }
        });
    })(jQuery);

})();
