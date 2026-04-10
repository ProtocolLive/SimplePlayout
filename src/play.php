<?php
require('SendData.php');

if($_GET['video'] === 'ENTRADA NDI'):
  $config = json_decode(file_get_contents('config.json'), true);
  $video = 'ndi://' . $config['ndi'];
else:
  $video = $_GET['video'];
endif;
SendData('PLAY 1-10 "' . $video . '" ' . $_GET['transicao'] . ' ' . $_GET['duracao'] . ' ' . $_GET['tween'] . ' ' . $_GET['direcao']);

if($_GET['logo'] == 'true'):
  SendData('MIXER 1-11 FILL 0.835938 0.0416667 0.117188 0.208333 0 Linear');
  SendData('MIXER 1-11 CHROMA Green 0.34 0.44 1');
  SendData('PLAY 1-11 "LOGO" MIX 30');
else:
  SendData('STOP 1-11');
endif;

if($_GET['live'] == 'true'):
  SendData('MIXER 1-12 FILL 0.851563 0.1666667 0.078125 0.138889 0 Linear');
  SendData('MIXER 1-12 CHROMA Green 0.34 0.44 1');
  SendData('PLAY 1-12 "AO VIVO" MIX 30');
else:
  SendData('STOP 1-12');
endif;