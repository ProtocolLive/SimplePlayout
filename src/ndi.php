<?php
$fp = fsockopen($_GET['url'], 5250, $errno, $errstr, 5);
fwrite($fp, "PLAY 1-10 ndi://ACER/VLC\r\n");
stream_set_timeout($fp, 2);
$response = '';
while(!feof($fp)):
  $chunk = fread($fp, 4096);
  if($chunk === false):
    break;
  endif;
  $response .= $chunk;
endwhile;
fclose($fp);
echo $response;