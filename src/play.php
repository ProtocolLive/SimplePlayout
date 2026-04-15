<?php
require('SendData.php');

$config = json_decode(file_get_contents('config.json'), true);
if(isset($_GET['video'])):
  if($_GET['video'] === 'ENTRADA NDI'):
    $video = 'ndi://' . $config['ndi'];
  else:
    $video = $_GET['video'];
  endif;
  $data = 'PLAY 1-10 "' . $video . '" ' . $_GET['transicao'] . ' ' . $_GET['duracao'] . ' ' . $_GET['tween'] . ' ' . $_GET['direcao'];
endif;

if(isset($_GET['gc'])):
  if($_GET['gc'] === 'true'):
    $data = 'PLAY 1-11 "ndi://' . $config['ndi2'] . '"' . "\r\n";
    $data .= 'MIXER 1-11 CHROMA Green 0.34 0.44 1';
  else:
    $data = 'STOP 1-11';
  endif;
endif;

if(isset($_GET['logo'])):
  if($_GET['logo'] == 'true'):
    $data .= "\r\n" . 'MIXER 1-20 FILL 0.867188 0.0430556 0.08125 0.140278 0 Linear' . "\r\n";
    $data .= 'MIXER 1-20 CHROMA Green 0.34 0.44 1' . "\r\n";
    $data .= 'PLAY 1-20 "LOGO" MIX 30';
  else:
    $data .= "\r\n" . 'STOP 1-20';
  endif;
endif;

if(isset($_GET['live'])):
  if($_GET['live'] == 'true'):
    $data .= "\r\n" . 'MIXER 1-21 FILL 0.878906 0.1222222 0.0570313 0.102778 0 Linear' . "\r\n";
    $data .= 'MIXER 1-21 CHROMA Green 0.34 0.44 1' . "\r\n";
    $data .= 'PLAY 1-21 "AO VIVO" MIX 30';
  else:
    $data .= "\r\n" . 'STOP 1-21';
  endif;
endif;

SendData($data);