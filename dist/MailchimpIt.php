<?php
/**
 * Author: Vincent Loy <vincent.loy1@gmail.com>
 * Date: 07/10/15
 * Time: 19:58
 */
require_once dirname(__DIR__) . '/vendor/autoload.php';

// Mandatory AJAX/XMLHttpRequest
//if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (!isset($_POST['newsletter_mail'])) {

        print_r(json_encode(array(
            'error' => true,
            'status' => 'failed',
            'message' => 'missed parameters'
        )));

        return;
    }

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

        $mailchimp = new \Drewm\MailChimp($api_key);

        $result = $mailchimp->call(
            'lists/subscribe',
            array(
                'id' => $list_id,
                'email' => array('email' => $email),
                'merge_vars' => $merge_vars,
                'double_optin' => false,
                'update_existing' => true,
                'replace_interests' => false,
                'send_welcome' => false,
            )
        );

        print_r(json_encode($result));

    } catch (Exception $e) {

        echo $e->getMessage();
    }
//} else {
//    var_dump(json_encode(array(
//        'error' => true,
//        'status' => 'unauthorized',
//        'message' => 'you cannot reach this page'
//    )));
//
//    return;
//}