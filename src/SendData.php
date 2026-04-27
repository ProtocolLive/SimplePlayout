<?php
//2026.04.27.00

function SendData(
  string $Data,
  bool $Log = true
):string|bool{
  $config = json_decode(file_get_contents('config.json'), true);
  static $fp = fsockopen($config['server'], 5250, $errno, $errstr, 5);
  if($fp === false):
    return false;
  endif;
  stream_set_timeout($fp, 1);
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
  if($Log === false):
    return $response;
  endif;
  file_put_contents('logs/play.log', "\t" . $response, FILE_APPEND);
  if(filesize('logs/play.log') > 10 * 1024 * 1024) {
    rename('logs/play.log', 'logs/play_' . date('Y-m-d H:i') . '.log');
  }
  return true;
}