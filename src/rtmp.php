<?php
require('SendData.php');

$config = json_decode(file_get_contents('config.json'), true);
$rtmp = $config['rtmp'];
if(substr($rtmp, -1) !== '/'):
  $rtmp .= '/';
endif;
$rtmp .= $config['rtmp_key'];
if($_GET['status'] === 'true'):
  SendData('ADD 1 STREAM ' . $rtmp . ' -codec:v libx264 -x264opts:v keyint=50 -preset:v faster -codec:a aac -strict -2 -b:a 128k -ar:a 48k -b:v 6M -maxrate:v 6000k -bufsize:v 2M -filter:v format=pix_fmts=yuv420p,fps=30 -filter:a pan=stereo|c0=c0|c1=c1 -format flv');
else:
  SendData('REMOVE 1 STREAM ' . $rtmp);
endif;