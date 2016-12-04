<meta http-equiv='refresh' content='5; url=http://bardahivskiy-resume.pp.ua/'>
<meta charset="UTF-8" />

 <style type="text/css">
 
.err {
	border: 1px solid #ff8c00;
	padding: 10px;
	background: #FFDF97;
	text-align: left;
	border-radius: 3px;
}
.ok {
	border: 1px #BCEF89 solid;
	margin-bottom: 15px;
	padding: 10px;
	background: #f5f9fd;
	text-align: center;
	border-radius: 3px;
}
</style>

<?php
$post = (!empty($_POST)) ? true : false;
if($post) {
	$email = $_POST['email'];
	$name = $_POST['name'];
	$email = $_POST['email'];
	
	$message = $_POST['message'];
	$error = '';
	if(!$name) {$error .= 'Please write down your name. ';}
	if(!$email) {$error .= 'Please enter your E-mail Address, . ';}
	
	if(!$message || strlen($message) < 1) {$error .= 'Enter a message. ';}
	if(!$error) {
		$address = "bohdbard@gmail.com";
		$mes = "Name: ".$name."\n\nMessage: ".$message."\n\n";
		$send = mail ($address,$sub,$mes,"Content-type:text/plain; charset = UTF-8\r\nFrom:$email");
		if($send) {echo '<div class="ok">Thank you for sending me message</div>';}
	}
	else {echo '<div class="err">'.$error.'</div>';}
}

?>