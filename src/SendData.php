<?php

function SendData(
  string $Data,
  bool $Log = true
):string|null{
  $config = json_decode(file_get_contents('config.json'), true);
  $fp = fsockopen($config['server'], 5250, $errno, $errstr, 5);
  stream_set_timeout($fp, 1);
  if($fp === false):
    return null;
  endif;
  fwrite($fp, $Data . "\r\n");
  if($Log):
    file_put_contents('logs/play.log', date('Y-m-d H:i:s') . "\t" . $Data, FILE_APPEND);
  endif;
  $response = '';
  while(feof($fp) === false):
    $chunk = fread($fp, 4096);
    if($chunk === false):
      break;
    endif;
    $response .= $chunk;
  endwhile;
  if($Log):
    file_put_contents('play.log', "\t" . $response, FILE_APPEND);
  else:
    return $response;
  endif;
  file_put_contents('play.log', PHP_EOL . $response, FILE_APPEND);
  return null;
}