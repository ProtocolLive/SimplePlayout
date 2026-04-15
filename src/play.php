<?php
require('SendData.php');

if($_GET['video'] === 'ENTRADA NDI'):
  $config = json_decode(file_get_contents('config.json'), true);
  $video = 'ndi://' . $config['ndi'];
else:
  $video = $_GET['video'];
endif;
$data = 'PLAY 1-10 "' . $video . '" ' . $_GET['transicao'] . ' ' . $_GET['duracao'] . ' ' . $_GET['tween'] . ' ' . $_GET['direcao'];

if($_GET['logo'] == 'true'):
  $data .= "\r\n" . 'MIXER 1-20 FILL 0.867188 0.0430556 0.08125 0.140278 0 Linear' . "\r\n" .
    'MIXER 1-20 CHROMA Green 0.34 0.44 1' . "\r\n" .
    'PLAY 1-20 "LOGO" MIX 30';
else:
  $data .= "\r\n" . 'STOP 1-20';
endif;

if($_GET['live'] == 'true'):
  $data .= "\r\n" . 'MIXER 1-21 FILL 0.878906 0.1222222 0.0570313 0.102778 0 Linear' . "\r\n" .
    'MIXER 1-21 CHROMA Green 0.34 0.44 1' . "\r\n" .
    'PLAY 1-21 "AO VIVO" MIX 30';
else:
  $data .= "\r\n" . 'STOP 1-21';
endif;

SendData($data);