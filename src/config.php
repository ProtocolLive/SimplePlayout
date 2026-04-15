<?php
$action = $_GET['action'] ?? 'get';

if($action === 'save'):
  $_POST = array_map(trim(...), $_POST);
  file_put_contents('config.json', json_encode($_POST));
else:
  $config = json_decode(file_get_contents('config.json'), true);
  $html = file_get_contents('config.htm');
  $html = str_replace('**SERVER**', $config['server'] ?? '', $html);
  $html = str_replace('**NDI**', $config['ndi'] ?? '', $html);
  $html = str_replace('**NDI2**', $config['ndi2'] ?? '', $html);
  $html = str_replace('**RTMP**', $config['rtmp'] ?? '', $html);
  $html = str_replace('**RTMP_KEY**', $config['rtmp_key'] ?? '', $html);
  echo $html;
endif;