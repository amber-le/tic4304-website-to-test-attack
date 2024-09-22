jQuery(function($) {
    "use strict";
    // Chose here which method to send the email, available:
    // Phpmaimer text/html > phpmailer/contact_phpmailer.php
    // Phpmaimer text/html SMPT > phpmailer/contact_phpmailer_smpt.php
    // PHPmailer with html template > phpmailer/contact_phpmailer_template.php
    // PHPmailer with html template SMTP> phpmailer/contact_phpmailer_template_smtp.php
    // Submit loader mask
    $('form').attr('action', 'phpmailer/contact_phpmailer_template_smtp.php');
    // Validate 
    $('form').validate({
        ignore: [],
        rules: {
            website: {
                maxlength: 0
            }
        }
    });
    $('form').on('submit', function() {
        var form = $("form");
        form.validate();
        if (form.valid()) {
            $("#loader_form").fadeIn();
        }
    });
});