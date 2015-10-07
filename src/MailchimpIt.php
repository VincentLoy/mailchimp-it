<?php
/**
 * Author: Vincent Loy <vincent.loy1@gmail.com>
 * Date: 07/10/15
 * Time: 19:58
 */
echo dirname(__DIR__) . '/vendor/autoload.php';

// Mandatory AJAX/XMLHttpRequest
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if (!isset($_POST['newsletter_mail']) ||
        !isset($_POST['newsletter_last_name']) ||
        !isset($_POST['newsletter_first_name'])) {

        print_r(json_encode(array(
            'error'      => true,
            'status'     => 'failed',
            'message' => 'missed parameters'
        )));

        return;
    }

    try {
        $api_key = getenv('MAILCHIMP_API_KEY');
        $list_id = getenv('MAILCHIMP_LIST_ID');

        $email = $_POST['newsletter_mail'];
        $first_name = $_POST['newsletter_first_name'];
        $last_name = $_POST['newsletter_last_name'];

        $mailchimp = new \Drewm\MailChimp($api_key);

        $result = $mailchimp->call(
            'lists/subscribe',
            array(
                'id'                => $list_id,
                'email'             => array('email' => $email),
                'merge_vars'        => array('FNAME' => $first_name, 'LNAME' => $last_name),
                'double_optin'      => false,
                'update_existing'   => true,
                'replace_interests' => false,
                'send_welcome'      => false,
            )
        );

        print_r(json_encode($result));

    } catch (Exception $e) {

        echo $e->getMessage();
    }
} else {
    header("location: http://" . $_SERVER['HTTP_HOST']);
}