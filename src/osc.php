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
while(true){
  socket_recvfrom($sock, $buffer, 4096, 0, $from, $portFrom);
  $dados = parseOscToNestedArray($buffer);
  if(empty($dados)):
    continue;
  endif;
  if(isset($dados['channel'][1]['stage']['layer'][10]['foreground']['file']['name'])
  and isset($dados['channel'][1]['stage']['layer'][10]['foreground']['file']['time'])):
    echo "event: message\n";
    echo 'data: ["' . $dados['channel'][1]['stage']['layer'][10]['foreground']['file']['name'] . '",' .
      $dados['channel'][1]['stage']['layer'][10]['foreground']['file']['time'][0] . ']' . "\n\n";
  endif;
}

function parseOscToArray($buffer, &$offset = 0){
  $results = [];
  $header = readOscString($buffer, $offset);
  if($header === "#bundle"):
    $offset += 8;
    while($offset < strlen($buffer)):
      $elementSize = unpack("N", substr($buffer, $offset, 4))[1];
      $offset += 4;
      $elementData = substr($buffer, $offset, $elementSize);
      $subOffset = 0;
      $results = array_merge($results, parseOscToArray($elementData, $subOffset));
      $offset += $elementSize;
    endwhile;
  else:
    $address = $header;
    $tags = readOscString($buffer, $offset);
    $args = [];
    if(str_starts_with($tags, ',')):
      $tagArray = str_split(substr($tags, 1));
      foreach($tagArray as $tag):
        if($tag === 'f'):
          $val = unpack('f', strrev(substr($buffer, $offset, 4)))[1];
          $args[] = round($val, 4);
          $offset += 4;
        elseif($tag === 'i'):
          $val = unpack('N', substr($buffer, $offset, 4))[1];
          if($val > 0x7FFFFFFF):
            $val -= 0x100000000;
          endif;
          $args[] = $val;
          $offset += 4;
        elseif($tag === 's'):
          $args[] = readOscString($buffer, $offset);
        endif;
      endforeach;
    endif;
    $results[] = [
      'address' => $address,
      'args' => $args
    ];
  endif;
  return $results;
}

function parseOscToNestedArray($buffer){
  $mensagensFlat = parseOscToArray($buffer);
  $tree = [];
  foreach($mensagensFlat as $msg):
    $pathStr = ltrim($msg['address'], '/');
    if(empty($pathStr)):
      continue;
    endif;
    $parts = explode('/', $pathStr);
    $current = &$tree;
    foreach($parts as $part):
      if(is_numeric($part)):
        $part = (int) $part;
      endif;
      if(!isset($current[$part])):
        $current[$part] = [];
      endif;
      $current = &$current[$part];
    endforeach;
    $current = (count($msg['args']) === 1) ? $msg['args'][0] : $msg['args'];
  endforeach;
  return $tree;
}

function readOscString($buffer, &$offset){
  $nullPos = strpos($buffer, "\0", $offset);
  if($nullPos === false):
    return '';
  endif;
  $len = $nullPos - $offset;
  $str = substr($buffer, $offset, $len);
  $offset += (floor($len / 4) + 1) * 4;
  return $str;
}