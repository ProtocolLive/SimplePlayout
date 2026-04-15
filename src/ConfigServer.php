<?php
require('SendData.php');

$data = 'MIXER 1-15 CHROMA Green 0.34 0.44 1' . "\r\n";
$data .= 'MIXER 1-20 FILL 0.867188 0.0430556 0.08125 0.140278 0 Linear' . "\r\n";
$data .= 'MIXER 1-20 CHROMA Green 0.34 0.44 1' . "\r\n";
$data .= 'MIXER 1-21 FILL 0.878906 0.1222222 0.0570313 0.102778 0 Linear' . "\r\n";
$data .= 'MIXER 1-21 CHROMA Green 0.34 0.44 1';
SendData($data, false);