<?php
$fp = fsockopen($_GET['server'], 5250, $errno, $errstr, 5);
stream_set_timeout($fp, 1);
if($fp === false):
  return;
endif;
fwrite($fp, 'PLAY 1-10 "' . $_GET['video'] . '" ' . $_GET['transicao'] . ' ' . $_GET['duracao'] . ' ' . $_GET['tween'] . ' ' . $_GET['direcao'] . "\r\n");

if($_GET['logo'] == 'true'):
  fwrite($fp, "MIXER 1-11 FILL 0.835938 0.0416667 0.117188 0.208333 0 Linear\r\n");
  fwrite($fp, "MIXER 1-11 CHROMA Green 0.34 0.44 1\r\n");
  fwrite($fp, "PLAY 1-11 \"LOGO\" MIX 30\r\n");
else:
  fwrite($fp, "STOP 1-11\r\n");
endif;

if($_GET['live'] == 'true'):
  fwrite($fp, "MIXER 1-12 FILL 0.851563 0.1666667 0.078125 0.138889 0 Linear\r\n");
  fwrite($fp, "MIXER 1-12 CHROMA Green 0.34 0.44 1\r\n");
  fwrite($fp, "PLAY 1-12 \"AO VIVO\" MIX 30\r\n");
else:
  fwrite($fp, "STOP 1-12\r\n");
endif;

fclose($fp);