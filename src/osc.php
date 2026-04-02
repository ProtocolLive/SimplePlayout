<?php
//Versão 2026.04.02.00

ini_set('max_execution_time', '0');

header('Content-Type: text/event-stream');
header('Access-Control-Allow-Origin: http://127.0.0.1');
header('Cache-Control:no-cache');
header('Connection:keep-alive');
$sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
$temp = socket_bind($sock, '192.168.0.100', 6250);
while(true):
  $size = socket_recvfrom($sock, $data, 65536, 0, $from, $port);
  //file_put_contents('a.txt', $data);

  $comando = '/channel/1/stage/layer/10/foreground/file/name';
  $pos = strpos($data, $comando);
  if($pos !== false):
    $arquivo = substr($data, $pos + strlen($comando) + 6);
    $arquivo = substr($arquivo, 0, strpos($arquivo, "\0"));
  endif;

  $comando = '/channel/1/stage/layer/10/foreground/file/time';
  $pos = strpos($data, $comando);
  if($pos !== false):
    $tempo = substr($data, $pos + strlen($comando));
    $tempo = trim($tempo, "\0");
    $tempo = substr($tempo, 0, 8);
    $tempo = unpack('G2', $tempo);
  endif;

  $comando = '/channel/1/mixer/audio/volume';
  $pos = strpos($data, $comando);
  $typePos = strpos($data, ',iiiiiiiiiiiiiiii', $pos);
  $dataOffset = $typePos + strlen(',iiiiiiiiiiiiiiii') + 1;
  $dataOffset += (4 - ($dataOffset % 4)) % 4;
  $som = unpack('N16', substr($data, $dataOffset, 64));

  echo "event: message\n";
  echo 'data: [';
  echo '"' . ($arquivo ?? '') . '",';
  echo ($tempo[2] ?? 0) . ',';
  echo ($som[1] ?? 0) . ',';
  echo ($som[2] ?? 0);
  echo "]\n\n";
  flush();
endwhile;