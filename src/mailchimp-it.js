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
        makeDiv,
        makeBox,
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

    makeDiv = function (elType, className, content) {
        var el = document.createElement(elType);
        el.classList.add(className);
        el.innerHTML = content;
        return el;
    };

    makeBox = function (message, className, before, after) {
        var div = document.createElement('div'),
            divBefore,
            divAfter,
            p = document.createElement('p');

        div.classList.add('mailchimp-it-response-box');
        div.classList.add(className);

        p.classList.add('mailchimp-it-text');
        p.textContent = message;
        div.appendChild(p);

        if (before) {
            divBefore = makeDiv('div', 'mailchimp-it-before-response', before);
            div.insertBefore(divBefore, p);
        }

        if (after) {
            divAfter = makeDiv('div', 'mailchimp-it-after-response', after);
            div.appendChild(divAfter);
        }

        return div;
    };

    mailchimpItLoader = function () {
        var el = document.createElement('div');
        el.classList.add('mailchimpit-loader');
        el.innerHTML =
            '<svg class="mailchimp-it-spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">' +
            '<circle class="mailchimp-it-path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>' +
            '</svg>';

        return el;
    };

    mailchimpIt = function (element, args) {

        var elt = document.querySelectorAll(element),
            parameters = extend({
                successMessage: 'Thanks for subscribing !',
                successMessageBefore: '<p>Before !</p>',
                successMessageAfter:  '<p>After !</p>',
                successMessageClassName: 'mailchimp-it-success',
                errorMessageClassName: 'mailchimp-it-error',
                errorMessageBefore: null,
                errorMessageAfter: null,
                errorMessageTimeout: 5000,
                mailInputName: 'newsletter_mail',
                firstNameInputName: 'newsletter_first_name',
                lastNameInputName: 'newsletter_last_name',
                loaderElt: mailchimpItLoader()
            }, args),
            successBox = makeBox(
                parameters.successMessage,
                parameters.successMessageClassName,
                parameters.successMessageBefore,
                parameters.successMessageAfter
            ),
            errorBox;

        Array.prototype.forEach.call(elt, function (el) {
            if (el.nodeName !== "FORM") {
                console.error('mailchimp-it only works with forms tags, you provide ' + el.nodeName, el);
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
                        if (data.hasOwnProperty(name)) {
                            urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
                        }
                    }

                    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

                    request.open('POST', action, true);
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    //request.setRequestHeader('Content-Length', urlEncodedData.length);
                    el.parentNode.insertBefore(parameters.loaderElt, el.nextSibling);
                    el.remove();

                    request.onload = function () {
                        var d = JSON.parse(request.responseText);
                        // Success!
                        if (request.status >= 200 && request.status < 400 && d.status === 'subscribed') {
                            console.log('success !');
                            console.log(request.status);
                            console.log(d);

                            parameters.loaderElt.parentNode.insertBefore(successBox, parameters.loaderElt.nextSibling);
                            parameters.loaderElt.remove();

                        } else {
                            // We reached our target server, but it returned an error
                            errorBox = makeBox(
                                d.detail,
                                parameters.errorMessageClassName,
                                parameters.errorMessageBefore,
                                parameters.errorMessageAfter
                            );
                            console.error(d);
                            console.error(d.detail);

                            parameters.loaderElt.parentNode.insertBefore(errorBox, parameters.loaderElt.nextSibling);
                            parameters.loaderElt.remove();

                            window.setTimeout(function () {
                                errorBox.parentNode.insertBefore(el, errorBox.nextSibling);
                                errorBox.remove();
                            }, parameters.errorMessageTimeout);
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