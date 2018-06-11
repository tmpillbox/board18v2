<?php
/*
 * The sendEmail() function uses SMTP to send plain text emails. 
 * Use configMail.php to specify the server and server access
 * information. And also the MAIL_SENDER field for the specification
 * of reply direction. You should use the SMTP server provided by your
 * ISP or your hosting service for these Emails. 
 * 
 * Input consists the following parameters:
 *   login
 *   subject
 *   body
 * 
 * Output is the echo return status of "success" or "fail".
 *
 * Copyright (c) 2015 Richard E. Price under the The MIT License.
 * A copy of this license can be found in the LICENSE.text file.
 */

require_once( 'class.phpmailer.php');
require_once('configMail.php');

function sendEmail($email, $subject, $body) {
  $mailObj = new PHPMailer;

  $mailObj->isSMTP();             // Set mailer to use SMTP.
  $mailObj->Host = MAIL_HOST;     // Specify server.
  $mailObj->Port = MAIL_PORT;     // Specify port. Use 587 for STARTTLS.
  $mailObj->SMTPAuth = true;      // Enable SMTP authentication
  $mailObj->SMTPSecure = 'tls';
  $mailObj->Username = MAIL_USER; // SMTP username.
  $mailObj->Password = MAIL_PASS; // SMTP password.
  $mailObj->setFrom(MAIL_SENDER,'BOARD18');
  // $mailObj->From = MAIL_SENDER;   // All replys will be sent here. 
  // $mailObj->FromName = 'BOARD18';
  
  $mailObj->addAddress($email);   // Add a recipient

  $mailObj->WordWrap = 60;        // Set word wrap to 60 characters.
  $mailObj->isHTML(false);        // Set email format to plaintext.

  $mailObj->Subject = $subject;
  $mailObj->Body = $body;
  $mailObj->Debugoutput = "error_log";
  if ($mailObj->send()) {
    echo 'success';
  } else {
    error_log('Mailer Error: ' . $mailObj->ErrorInfo);
    echo 'fail';
  }
}
?>