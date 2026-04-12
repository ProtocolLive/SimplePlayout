<!DOCTYPE html>
<html lang="pt-br">
<head>
  <link rel="stylesheet" href="https://estrategiagestao.com.br/public_css/bootstrap.css">
  <link rel="stylesheet" href="css/style.css">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="js/ajax.js"></script>
  <title>SimplePlayout</title>
</head>
<body>
  <div class="Flex">
    <div style="margin-right:10px">
      <div>
        <a href="#" onclick="Ajax('config.php','AjaxWindow');document.getElementById('AjaxWindow').showModal()">⚙️</a>
        <input type="checkbox" onclick="Ajax('rtmp.php?status='+this.checked,'AjaxBlank')"> RTMP &nbsp;
        <progress id="Volume1" min="0" max="1499999999"></progress>
        <progress id="Volume2" min="0" max="1499999999"></progress>
      </div>
      <div style="max-height:95vh;overflow-y:auto">
        <table>
          <thead>
            <tr>
              <th class="BorderFinBlack">Hora</th>
              <th class="BorderFinBlack">Vídeo</th>
              <th class="BorderFinBlack">Tempos</th>
              <th class="BorderFinBlack">Opções</th>
            </tr>
          </thead>
          <tbody id="Playlist">
            <tr id="Vazio" ondragover="event.preventDefault();this.classList.add('Selected')" ondragleave="this.classList.remove('Selected')" ondrop="event.preventDefault();this.classList.remove('Selected');CreateLine(this)">
              <td class="BorderFinBlack TextCenter" colspan="6">VAZIO</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <a href="#" onclick="Ajax('cls.php','Videos')">🔄️</a>
      <input type="text" onkeyup="FiltraVideos(this.value)">
      <div id="Videos" style="max-height:95vh;overflow-y:auto"></div>
    </div>
  </div>

  <dialog id="AjaxWindow"></dialog>

  <span id="AjaxBlank"></span>

  <script src="js/funcoes.js"></script>
  <script>
    const osc = new EventSource('http://<?=gethostbyname(gethostname())?>:8080/osc.php')
  </script>
</body>
</html>