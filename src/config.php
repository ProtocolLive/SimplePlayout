<?php
/**
 * @version 2026.05.05.00
 */

$action = $_GET['action'] ?? 'get';

if($action === 'save'):
  $_POST = array_map(trim(...), $_POST);
  file_put_contents('config.json', json_encode($_POST));
  require('ConfigServer.php');
else:
  if(file_exists('config.json')):
    $config = json_decode(file_get_contents('config.json'), true);
  endif;
  $html = file_get_contents('config.htm');
  $html = str_replace('**SERVER**', $config['server'] ?? '127.0.0.1', $html);
  $html = str_replace('**NDI**', $config['ndi'] ?? '', $html);
  $html = str_replace('**NDI2**', $config['ndi2'] ?? '', $html);
  $html = str_replace('**RTMP**', $config['rtmp'] ?? '', $html);
  $html = str_replace('**RTMP_KEY**', $config['rtmp_key'] ?? '', $html);
  $html = str_replace('**CANAL**', $config['canal'] ?? 1, $html);
  echo $html;
endif;