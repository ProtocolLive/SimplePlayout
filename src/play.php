<?php
/**
 * @version 2026.05.05.00
 */

require('SendData.php');
ini_set('max_execution_time', '5');
$config = json_decode(file_get_contents('config.json'), true);

if($_GET['action'] === 'load'
or $_GET['action'] === 'loadplay'):
  if($_GET['video'] === 'ENTRADA NDI'):
    $data = 'ndi://' . $config['ndi'] ;
  else:
    $data = $_GET['video'];
  endif;
  SendData('LOADBG ' . $config['canal'] . '-10 "' . $data. '" ' . $_GET['transicao'] . ' ' . $_GET['duracao'] . ' ' . $_GET['tween'] . ' ' . $_GET['direcao']);
endif;

if($_GET['action'] === 'play'
or $_GET['action'] === 'loadplay'):
  $data = 'PLAY 1-10' . "\r\n";
  if($_GET['logo'] == 'true'):
    $data .= 'PLAY ' . $config['canal'] . '-20 "LOGO" MIX 30' . "\r\n";
  else:
    $data .= 'STOP ' . $config['canal'] . '-20' . "\r\n";
  endif;
  if($_GET['live'] == 'true'):
    $data .= 'PLAY ' . $config['canal'] . '-21 "AO VIVO" MIX 30';
  else:
    $data .= 'STOP ' . $config['canal'] . '-21';
  endif;
  SendData($data);
endif;

if($_GET['action'] === 'gc'):
  if($_GET['status'] === 'true'):
    SendData('PLAY ' . $config['canal'] . '-15 "ndi://' . $config['ndi2'] . '"');
  else:
    SendData('STOP ' . $config['canal'] . '-15');
  endif;
  return;
endif;