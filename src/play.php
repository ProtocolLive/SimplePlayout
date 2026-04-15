<?php
require('SendData.php');
$config = json_decode(file_get_contents('config.json'), true);

if($_GET['action'] === 'load'):
  if($_GET['video'] === 'ENTRADA NDI'):
    $data = 'ndi://' . $config['ndi'] ;
  else:
    $data = $_GET['video'];
  endif;
  SendData('LOADBG 1-10 "' . $data. '" ' . $_GET['transicao'] . ' ' . $_GET['duracao'] . ' ' . $_GET['tween'] . ' ' . $_GET['direcao']);
elseif($_GET['action'] === 'play'):
  $data = 'PLAY 1-10' . "\r\n";
  if($_GET['logo'] == 'true'):
    $data .= 'PLAY 1-20 "LOGO" MIX 30' . "\r\n";
  else:
    $data .= 'STOP 1-20' . "\r\n";
  endif;
  if($_GET['live'] == 'true'):
    $data .= 'PLAY 1-21 "AO VIVO" MIX 30';
  else:
    $data .= 'STOP 1-21';
  endif;
  SendData($data);
elseif($_GET['action'] === 'gc'):
  if($_GET['status'] === 'true'):
    SendData('PLAY 1-15 "ndi://' . $config['ndi2'] . '"');
  else:
    SendData('STOP 1-15');
  endif;
  return;
endif;