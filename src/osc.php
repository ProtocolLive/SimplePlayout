<?php
//Protocol Corporation Ltda.
//https://github.com/ProtocolLive/Ajax
//Versão 2026.05.26.00

ini_set('max_execution_time', '0');

header('Content-Type: text/event-stream');
header('Access-Control-Allow-Origin: *');
header('Cache-Control:no-cache');
header('Connection:keep-alive');

$sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
$temp = socket_bind($sock, gethostbyname(gethostname()), 6250);
while(true):
  socket_recvfrom($sock, $buffer, 4096, 0, $from, $portFrom);
  $mensagens = ParseOsc($buffer);
  $index = array_search('/channel/1/stage/layer/10/foreground/file/name', array_column($mensagens, 'address'));
  $video = $index === false ? null : $mensagens[$index]['args'][0];
  $index = array_search('/channel/1/stage/layer/10/foreground/file/time', array_column($mensagens, 'address'));
  $tempo = $index === false ? null : $mensagens[$index]['args'][0];

  if($video !== null and $tempo !== null):
    echo "event: message\n";
    echo 'data: ["' . $video . '",' . $tempo . ']' . "\n\n";
  endif;
endwhile;

function ParseOsc(
  string $buffer,
  &$offset = 0
):array{
  $results = [];
  $header = OscString($buffer, $offset);
  if($header === "#bundle"):
    $offset += 8;
    while($offset < strlen($buffer)):
      $elementSize = unpack("N", substr($buffer, $offset, 4))[1];
      $offset += 4;
      $elementData = substr($buffer, $offset, $elementSize);
      $subOffset = 0;
      $results = array_merge($results, ParseOsc($elementData, $subOffset));
      $offset += $elementSize;
    endwhile;
  else:
    $address = $header;
    $tags = OscString($buffer, $offset);
    $args = [];
    if(str_starts_with($tags, ',')):
      $tagArray = str_split(substr($tags, 1));
      foreach($tagArray as $tag):
        if($tag === 'f'):
          $val = unpack("f", strrev(substr($buffer, $offset, 4)))[1];
          $args[] = round($val, 4);
          $offset += 4;
        elseif($tag === 'i'):
          $val = unpack("N", substr($buffer, $offset, 4))[1];
          if ($val > 0x7FFFFFFF) $val -= 0x100000000;
          $args[] = $val;
          $offset += 4;
        elseif($tag === 's'):
          $args[] = OscString($buffer, $offset);
        endif;
      endforeach;
    endif;
    $results[] = [
      'address' => $address,
      'tags' => $tags,
      'args' => $args
    ];
  endif;
  return $results;
}

function OscString(
  string $buffer,
  &$offset
):string{
  $nullPos = strpos($buffer, "\0", $offset);
  if($nullPos === false):
    return '';
  endif;
  $len = $nullPos - $offset;
  $str = substr($buffer, $offset, $len);
  $offset += (floor($len / 4) + 1) * 4;
  return $str;
}