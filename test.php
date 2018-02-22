<?php
$file="upload/597f0d2c7c957.png";

// is_readable($file)
if (is_writable($file)) {
	  echo 'The file is writable';
	} else {
	  echo 'The file is not writable';
	}
?>