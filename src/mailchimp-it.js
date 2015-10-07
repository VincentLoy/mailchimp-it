/**
 * Project : mailchimp-it
 * description : Small AJAX Mailchimp Wrapper - Turn a simple form into a Mailchimp ready form
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 */

/*global window, document, XMLHttpRequest, console*/

(function (exports) {
    'use strict';

    var // functions
        extend,
        mailchimpItLoader,
        subscribe,
        mailchimpIt;

    extend = function (out) {
        var i,
            key;

        out = out || {};

        for (i = 1; i < arguments.length; i += 1) {
            if (arguments[i]) {
                for (key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        out[key] = arguments[i][key];
                    }
                }
            }
        }
        return out;
    };

    mailchimpItLoader = function () {
        var el = document.createElement('div');
        el.classList.add('mailchimpit-loader');
        el.textContent = 'Please wait...';

        return el;
    };

    mailchimpIt = function (element, args) {

        var elt = document.querySelectorAll(element),
            parameters = extend({
                successMessage: 'Thanks for subscribing !',
                errorMessage: 'an error has occurred, please try again later.',
                mailInputName: 'newsletter_mail',
                firstNameInputName: 'newsletter_first_name',
                lastNameInputName: 'newsletter_last_name',
                loaderElt: mailchimpItLoader()
            }, args);

        Array.prototype.forEach.call(elt, function (el) {
            if (el.nodeName !== "FORM") {
                console.error('mailchimp-it only works with forms tags, you provide '
                    + el.nodeName, el);
            } else {
                // ok
                var action = el.getAttribute('action');

                el.onsubmit = function (e) {
                    e.preventDefault();
                    var request = new XMLHttpRequest(),
                        urlEncodedData = '',
                        urlEncodedDataPairs = [],
                        name,
                        mailInput = el.querySelector('input[name=' + parameters.mailInputName + ']'),
                        firstNameInput = el.querySelector('input[name=' + parameters.firstNameInputName + ']'),
                        lastNameInput = el.querySelector('input[name=' + parameters.lastNameInputName + ']'),
                        data = {};

                    if (mailInput) {
                        data[parameters.mailInputName] = mailInput.value;
                    }

                    if (firstNameInput) {
                        data[parameters.firstNameInputName] = firstNameInput.value;
                    }

                    if (lastNameInput) {
                        data[parameters.lastNameInputName] = lastNameInput.value;
                    }

                    for (name in data) {
                        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
                    }

                    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

                    request.open('POST', action, true);
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    //request.setRequestHeader('Content-Length', urlEncodedData.length);
                    request.onload = function () {
                        if (request.status >= 200 && request.status < 400) {
                            // Success!
                            var d = request.responseText;
                            console.log('success !');
                            console.log(d);
                        } else {
                            // We reached our target server, but it returned an error
                            console.error(JSON.parse(request.responseText));
                            console.error('baaaaaaaaaaad');
                        }
                    };
                    request.send(urlEncodedData);
                    console.log(urlEncodedData);
                };
            }
        });
    };

    exports.mailchimpIt = mailchimpIt;
}(window));

/*global $, jQuery, mailchimpIt*/
if (window.jQuery) {
    (function ($, mailchimpIt) {
        'use strict';

        function mailchimpItify(el, options) {
            mailchimpIt(el, options);
        }

        $.fn.tweetParser = function (options) {
            return mailchimpItify(this.selector, options);
        };
    }(jQuery, mailchimpIt));
}