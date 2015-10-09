#Mailchimp-it

Mailchimp-it is a small Javascript Library that turn a simple form into a working mailchimp form using a small PHP script as a dependency.

## Getting started

#### HTML
First of all, you need to load mailchimp-it files
```html
<!-- You can customize mailchimp-it.css -->
<link rel="stylesheet" href="dist/mailchimp-it.css"/>
<script src="dist/mailchimp-it.min.js"></script>
```

Then, prepare your form
```html
<div class="form-container">
    <form class="test_form" method="post" action="src/MailchimpIt.php">
	    <!-- Optional inputs -->
	    <input type="text" name="newsletter_first_name"/>
        <input type="text" name="newsletter_last_name"/>
               
	    <!-- Mandatory input -->
        <input type="email" name="newsletter_mail" required/>
        <button type="submit">subscribe</button>
    </form>
</div>
```

#### Javascript
Basic usage
```javascript
(function () {
    'use strict';
    mailchimpIt('.test_form');
}());
```

Mailchimp-it allow you to customize a lot of things
```javascript
(function () {
    'use strict';
    mailchimpIt('.test_form', {
        successMessage: 'Thanks for subscribing !', //Default success message
        successMessageBefore: null, //innerHTML before success Message
        successMessageAfter: null, //innerHTML after success Message
        successMessageClassName: 'mailchimp-it-success', //Success message div class
        errorMessageClassName: 'mailchimp-it-error', //Error message div class
        errorMessageBefore: null, //innerHTML before error Message
        errorMessageAfter: null, //innerHTML after error Message
        errorMessageTimeout: 5000, //Time that error message will be displayed
        mailInputName: 'newsletter_mail', //default mail input name
        firstNameInputName: 'newsletter_first_name', //default first name input name
        lastNameInputName: 'newsletter_last_name', //default last name input name
        loaderElt: mailchimpItLoader() //default loader, you can write your own function
    });
}());
```

Custom example
```javascript
(function () {
    'use strict';
    mailchimpIt('.test_form', {
        successMessage: 'Thanks for subscribing, you\'ll be notified for the next update !',
        successMessageBefore: '<p>Hell Yeah !</p>'
    });
}());
```

Want to use jQuery ?
No problem
```javascript
(function ($) {
    'use strict';
    $('.test_form').mailchimpIt({
        successMessage: 'Thanks for subscribing, you\'ll be notified for the next update !',
        successMessageBefore: '<p>Hell Yeah !</p>'
    });
}(jQuery));
```