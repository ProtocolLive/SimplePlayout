<?php
$config = json_decode(file_get_contents('config.json'), true);
$fp = fsockopen($config['server'], 5250, $errno, $errstr, 5);
stream_set_timeout($fp, 1);
if($fp === false):
  return;
endif;
$rtmp = $config['rtmp'];
if(substr($rtmp, -1) !== '/'):
  $rtmp .= '/';
endif;
$rtmp .= $config['rtmp_key'];
if($_GET['status'] === 'true'):
  fwrite($fp, 'ADD 1 STREAM ' . $rtmp . ' -codec:v libx264 -x264opts:v keyint=50 -preset:v faster -codec:a aac -strict -2 -b:a 128k -ar:a 48k -b:v 6M -maxrate:v 6000k -bufsize:v 2M -filter:v format=pix_fmts=yuv420p,fps=30 -filter:a pan=stereo|c0=c0|c1=c1 -format flv' . "\r\n");
else:
  fwrite($fp, 'REMOVE 1 STREAM '. $rtmp. "\r\n");
endif;