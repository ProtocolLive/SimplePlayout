<?php
//Versão 2026.04.02.00

ini_set('max_execution_time', '0');

header('Content-Type: text/event-stream');
header('Access-Control-Allow-Origin: *');
header('Cache-Control:no-cache');
header('Connection:keep-alive');
$sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
$temp = socket_bind($sock, gethostbyname(gethostname()), 6250);
while(true):
  $size = socket_recvfrom($sock, $data, 65536, 0, $from, $port);
  //file_put_contents('a.txt', $data);

  echo "event: message\n";
  echo 'data: ["';
  $pos = strpos($data, '/channel/1/stage/layer/10/foreground/file/name');
  if($pos !== false):
    $start = $pos + 46 + 6;
    $end = strpos($data, "\0", $start);
    echo substr($data, $start, $end - $start);
  endif;
  echo '",';

  $pos = strpos($data, '/channel/1/stage/layer/10/foreground/file/time');
  if($pos !== false):
    $tempo = substr($data, $pos + 46);
    $tempo = trim($tempo, "\0");
    $tempo = substr($tempo, 0, 8);
    $tempo = unpack('G2', $tempo);
    echo $tempo[2];
  endif;
  echo ',';

  $pos = strpos($data, '/channel/1/mixer/audio/volume');
  $pos = strpos($data, ',iiiiiiiiiiiiiiii', $pos);
  $offset = $pos + 17 + 1;
  $offset += (4 - ($offset % 4)) % 4;
  $som = unpack('N16', substr($data, $offset, 64));
  echo $som[1] . ',' . $som[2];

  echo "]\n\n";
  flush();
endwhile;