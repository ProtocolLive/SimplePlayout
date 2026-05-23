<?php
/**
 * @version 2026.05.23.00
 */

require('SendData.php');

$response = SendData('CLS', false);
if($response === false):
  echo 'Falha na conexão';
  return;
endif;
$response = explode("\r\n", $response);
array_shift($response);?>
<table id="Videos">
  <tr draggable="true" ondragstart="Dragged=this" ondblclick="Dragged=this;CreateLine(document.getElementById('Playlist').querySelector('tr:last-of-type'))" id="video-ENTRADANDI">
    <td colspan="2" class="TextCenter BorderFinBlack">ENTRADA NDI</td>
  </tr>
  <tr draggable="true" ondragstart="Dragged=this" ondblclick="Dragged=this;CreateLine(document.getElementById('Playlist').querySelector('tr:last-of-type'))" id="video-CANAL1">
    <td colspan="2" class="TextCenter BorderFinBlack">CANAL 1</td>
  </tr><?php
  foreach($response as &$item):
    preg_match_all('/"([^"]*)"|\'([^\']*)\'|(\S+)/', $item, $matches);
    $resultado = [];
    foreach($matches[0] as $parte):
      $resultado[] = trim($parte, "\"'");
    endforeach;
    $item = $resultado;
    if(isset($item[0])):
      if($item[1] !== 'MOVIE'):
        continue;
      endif;?>
      <tr draggable="true" ondragstart="Dragged=this" onclick="this.classList.toggle('Selected')" ondblclick="Dragged=this;CreateLine(document.getElementById('Playlist').querySelector('tr:last-of-type'))" id="video-<?=str_replace(' ', '', $item[0])?>">
        <td class="BorderFinBlack"><?=$item[0]?></td><?php
        $item[5] = explode('/', $item[5]);
        $item[5] = $item[5][1] / $item[5][0];
        $item[4] = $item[4] / $item[5];?>
        <td class="BorderFinBlack"><?=gmdate('H:i:s', floor($item[4]))?></td>
      </tr><?php
    endif;
  endforeach;?>
</table>