<?php
/**
 * Author: Vincent Loy <vincent.loy1@gmail.com>
 * Date: 07/10/15
 * Time: 19:58
 */
require(dirname(__DIR__) . '/vendor/autoload.php');

use \DrewM\MailChimp\MailChimp;

function mailchimpItError($message)
{
    print_r(json_encode(array(
        'status' => 'error',
        'error' => $message
    )));
}

if (!isset($_POST['newsletter_mail'])) {

    mailchimpItError('missing email parameter');

} else {
    try {
        $api_key = getenv('MAILCHIMP_API_KEY');
        $list_id = getenv('MAILCHIMP_LIST_ID');

        $email = $_POST['newsletter_mail'];
        $merge_vars = array();

        if (isset($_POST['newsletter_first_name'])) {
            $merge_vars['FNAME'] = $_POST['newsletter_first_name'];
        }

        if (isset($_POST['newsletter_last_name'])) {
            $merge_vars['LNAME'] = $_POST['newsletter_last_name'];
        }

        $mailchimp = new MailChimp($api_key);

        $result = $mailchimp->post(
            'lists/' . $list_id . '/members',
            array(
                'email_address' => $email,
                'status' => 'subscribed',
                'merge_fields' => $merge_vars
            )
        );

        if ($result) {
            print_r(json_encode($result));
        } else {
            mailchimpItError('Please check your configuration');
        }

    } catch (Exception $e) {
        mailchimpItError($e->getMessage());
    }
}