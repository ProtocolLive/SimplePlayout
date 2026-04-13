const HORA = 0
const VIDEO = 1
const TEMPOS = 2
const OPCOES = 3

const TemposTotal = 0
const TemposRestante = 2
const TemposBarra = 4

const OpcoesTransicao = 0
const OpcoesTempo = 1
const OpcoesTween = 3
const OpcoesDirecao = 4
const OpcoesLogo = 6
const OpcoesLive = 8

let DraggedVideo = null
let DraggedPlaylist = null

Ajax('cls.php', 'Videos')

osc.onmessage = function (event) {
  event = JSON.parse(event.data)
  //VU
  document.getElementById('Volume1').value = event[2]
  document.getElementById('Volume2').value = event[3]
  //tempo reproduzido
  tr = document.getElementById(event[0].replaceAll(' ', ''))
  if (tr === null) {
    return
  }
  decorrido = new Date('1970-1-1')
  decorrido.setMilliseconds(Math.floor(event[1]) * 1000)
  restante = new Date('1970-1-1 ' + tr.cells[TEMPOS].children[TemposTotal].textContent)
  restante = new Date(restante - decorrido)
  tr.cells[TEMPOS].children[TemposRestante].textContent = restante.toISOString().substr(11, 8)
  tr.cells[TEMPOS].children[TemposBarra].value = event[1]
  //play no proximo
  if (tr.cells[TEMPOS].children[TemposRestante].textContent === '00:00:00'
  && tr.getAttribute('played') === null) {
    tr.setAttribute('played', true)
    if (tr.nextElementSibling !== null) {
      Play(tr.nextElementSibling)
    }
  }
}

function CreateLine(Objeto) {
  const Css = 'BorderFinBlack TextCenter'

  tr = document.createElement('tr')
  if (DraggedVideo !== null) {
    tr.id = DraggedVideo.cells[0].textContent.replaceAll(' ', '')
  } else {
    tr.id = DraggedPlaylist.getAttribute('id')
  }
  DragEnable(tr)

  //hora
  td = document.createElement('td')
  td.classList = Css
  tr.appendChild(td)

  //video
  td = document.createElement('td')
  td.classList = Css
  temp = document.createElement('span')
  if (DraggedVideo !== null) {
    temp.textContent = DraggedVideo.cells[0].textContent
  } else {
    temp.textContent = DraggedPlaylist.cells[VIDEO].children[0].textContent
  }
  td.appendChild(temp)
  td.appendChild(document.createElement('br'))
  temp = document.createElement('span')
  temp.innerHTML = '<a href"#" onclick="Play(this.parentNode.parentNode.parentNode)" class="Pointer">▶️</a>'
  temp.innerHTML += '<a href"#" onclick="Remover(this)" class="Pointer">❎</a>'
  td.appendChild(temp)
  tr.appendChild(td)

  //tempos
  td = document.createElement('td')
  td.classList = Css
  temp = document.createElement('span')
  if (DraggedVideo !== null) {
    if (DraggedVideo.cells[1] !== undefined) {
      temp.textContent = DraggedVideo.cells[1].textContent
    }
  } else {
    temp.textContent = DraggedPlaylist.cells[TEMPOS].children[TemposTotal].textContent
  }
  td.appendChild(temp)
  temp = document.createElement('span')
  temp.textContent = ' / '
  td.appendChild(temp)
  temp = document.createElement('span')
  if (DraggedVideo !== null) {
    if (DraggedVideo.cells[1] !== undefined) {
      temp.textContent = DraggedVideo.cells[1].textContent
    }
  } else {
    temp.textContent = DraggedPlaylist.cells[TEMPOS].children[TemposTotal].textContent
  }
  td.appendChild(temp)
  td.appendChild(document.createElement('br'))
  td.appendChild(document.createElement('progress'))
  tr.appendChild(td)

  //transição
  td = document.createElement('td')
  td.classList = Css
  select = document.createElement('select')
  temp = document.createElement('option')
  temp.value = 'CUT'
  temp.textContent = 'Corte'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'MIX'
  temp.textContent = 'Fade'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'PUSH'
  temp.textContent = 'Empurrar'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'SLIDE'
  temp.textContent = 'Deslizar'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'WIPE'
  temp.textContent = 'Limpar'
  select.appendChild(temp)
  td.appendChild(select)
  temp = document.createElement('input')
  temp.type = 'number'
  temp.value = 0
  temp.style.width = '30px'
  td.appendChild(temp)
  td.appendChild(document.createElement('br'))
  select = document.createElement('select')
  temp = document.createElement('option')
  temp.value = 'LINEAR'
  temp.textContent = 'Linear'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easynone'
  temp.textContent = 'Easy none'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinquad'
  temp.textContent = 'Easy In Quad'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutquad'
  temp.textContent = 'Easy Out Quad'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutquad'
  temp.textContent = 'Easy In Out Quad'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutinquad'
  temp.textContent = 'Easy Out In Quad'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyincubic'
  temp.textContent = 'Easy In Cubic'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutcubic'
  temp.textContent = 'Easy Out Cubic'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutcubic'
  temp.textContent = 'Easy In Out Cubic'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutincubic'
  temp.textContent = 'Easy Out In Cubic'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinquart'
  temp.textContent = 'Easy In Quart'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutquart'
  temp.textContent = 'Easy Out Quart'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutquart'
  temp.textContent = 'Easy In Out Quart'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutinquart'
  temp.textContent = 'Easy Out In Quart'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinquint'
  temp.textContent = 'Easy In Quint'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutquint'
  temp.textContent = 'Easy Out Quint'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutquint'
  temp.textContent = 'Easy In Out Quint'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutinquint'
  temp.textContent = 'Easy Out In Quint'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinsine'
  temp.textContent = 'Easy In Sine'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutsine'
  temp.textContent = 'Easy Out Sine'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutsine'
  temp.textContent = 'Easy In Out Sine'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutinsine'
  temp.textContent = 'Easy Out In Sine'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinexpo'
  temp.textContent = 'Easy In Expo'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutexpo'
  temp.textContent = 'Easy Out Expo'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutexpo'
  temp.textContent = 'Easy In Out Expo'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutinexpo'
  temp.textContent = 'Easy Out In Expo'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyincirc'
  temp.textContent = 'Easy In Circ'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutcirc'
  temp.textContent = 'Easy Out Circ'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutcirc'
  temp.textContent = 'Easy In Out Circ'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutincirc'
  temp.textContent = 'Easy Out In Circ'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinelastic'
  temp.textContent = 'Easy In Elastic'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutelastic'
  temp.textContent = 'Easy Out Elastic'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutelastic'
  temp.textContent = 'Easy In Out Elastic'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutinelastic'
  temp.textContent = 'Easy Out In Elastic'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinback'
  temp.textContent = 'Easy In Back'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutbacl'
  temp.textContent = 'Easy Out Back'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutbacl'
  temp.textContent = 'Easy In Out Back'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutinbacl'
  temp.textContent = 'Easy Out In Back'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinbounce'
  temp.textContent = 'Easy In Bounce'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutbounce'
  temp.textContent = 'Easy Out Bounce'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyinoutbounce'
  temp.textContent = 'Easy In Out Bounce'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'easyoutinbounce'
  temp.textContent = 'Easy Out In Bounce'
  select.appendChild(temp)
  td.appendChild(select)
  select = document.createElement('select')
  temp = document.createElement('option')
  temp.value = 'RIGHT'
  temp.textContent = 'Direita'
  select.appendChild(temp)
  temp = document.createElement('option')
  temp.value = 'LEFT'
  temp.textContent = 'Esquerda'
  select.appendChild(temp)
  td.appendChild(select)
  td.appendChild(document.createElement('br'))
  temp = document.createElement('input')
  temp.type = 'checkbox'
  td.appendChild(temp)
  temp = document.createElement('span')
  temp.textContent = 'Logo'
  td.appendChild(temp)
  temp = document.createElement('input')
  temp.type = 'checkbox'
  td.appendChild(temp)
  temp = document.createElement('span')
  temp.textContent = 'Live'
  td.appendChild(temp)
  tr.appendChild(td)

  tr.appendChild(td)
  Objeto.parentNode.insertBefore(tr, Objeto.nextSibling)
  if (DraggedVideo !== null) {
    if (document.getElementById('Vazio') !== null) {
      document.getElementById('Playlist').removeChild(document.getElementById('Vazio'))
    }
  } else {
    document.getElementById('Playlist').removeChild(Objeto.previousSibling)
  }
  DraggedVideo = null
  DraggedPlaylist = null
}

function DragEnable(tr){
  tr.setAttribute('draggable', 'true')
  tr.setAttribute('ondragstart', "DraggedPlaylist=this")
  tr.setAttribute('ondragover', "event.preventDefault();this.classList.add('Selected')")
  tr.setAttribute('ondragleave', "this.classList.remove('Selected')")
  tr.setAttribute('ondrop', "event.preventDefault();this.classList.remove('Selected');CreateLine(this);RecalcularTudo(this)")
}

function FiltraVideos(Texto) {
  document.getElementById('Videos').querySelectorAll('tr').forEach(function (tr) {
    if (tr.cells[0].textContent.toLowerCase().search(Texto.toLowerCase()) === -1) {
      tr.style.display = 'none'
    } else {
      tr.style.display = ''
    }
  })
}

function Play(Objeto) {
  fetch(
    'play.php?video=' + Objeto.cells[VIDEO].children[0].textContent +
    '&transicao=' + Objeto.cells[OPCOES].children[OpcoesTransicao].value +
    '&duracao=' + Objeto.cells[OPCOES].children[OpcoesTempo].value +
    '&tween=' + Objeto.cells[OPCOES].children[OpcoesTween].value +
    '&direcao=' + Objeto.cells[OPCOES].children[OpcoesDirecao].value +
    '&logo=' + Objeto.cells[OPCOES].children[OpcoesLogo].checked +
    '&live=' + Objeto.cells[OPCOES].children[OpcoesLive].checked
  )
  //Hora reproduzido
  temp = new Date
  Objeto.cells[HORA].innerHTML = temp.toLocaleDateString() + '<br>' + temp.toLocaleTimeString()
  //Definir valor máximo no progress
  duracao = Objeto.cells[TEMPOS].children[TemposTotal].textContent.split(':')
  duracao = (duracao[0] * 3600) + (duracao[1] * 60) + parseInt(duracao[2])
  Objeto.cells[TEMPOS].children[TemposBarra].setAttribute('max', duracao)
  //Drag e classe
  Objeto.classList.add('Played')
  Objeto.removeAttribute('draggable')
  Objeto.removeAttribute('ondragstart')
  //Hora dos próximos
  Objeto.removeAttribute('played')
  RecalcularTudo(Objeto)
}

function RecalcularTudo(Objeto) {
  Objeto = Objeto.nextElementSibling
  while (Objeto !== null) {
    Objeto.cells[HORA].textContent = TempoSoma(
      Objeto.previousSibling.cells[HORA].innerHTML.replaceAll('<br>', ' '),
      Objeto.previousSibling.cells[TEMPOS].children[TemposTotal].textContent
    )
    Objeto.cells[HORA].innerHTML = Objeto.cells[HORA].innerHTML.replaceAll(' ', '<br>')
    Objeto.cells[TEMPOS].children[TemposRestante].textContent = Objeto.cells[TEMPOS].children[TemposTotal].textContent
    Objeto.cells[TEMPOS].children[TemposBarra].value = 0
    Objeto.removeAttribute('played')
    Objeto.classList.remove('Played')
    Objeto = Objeto.nextElementSibling
  }
}

function Remover(Objeto) {
  document.getElementById('Playlist').removeChild(Objeto.parentNode.parentNode.parentNode)
  if (document.getElementById('Playlist').querySelectorAll('tr').length === 0) {
    tr = document.createElement('tr')
    tr.id = 'Vazio'
    td = document.createElement('td')
    td.classList = 'BorderFinBlack TextCenter'
    td.textContent = 'VAZIO'
    td.setAttribute('colspan', 6)
    tr.appendChild(td)
    document.getElementById('Playlist').appendChild(tr)
    DragEnable(tr)
  }
}

function TempoSoma(Start, Segundos) {
  if (Start === '') {
    return
  }
  Start = Start.split('/')
  Start = Start[1] + '/' + Start[0] + '/' + Start[2]
  Start = new Date(Start)
  Segundos = Segundos.split(':')
  Start.setSeconds(Start.getSeconds() + parseInt(Segundos[2]))
  Start.setMinutes(Start.getMinutes() + parseInt(Segundos[1]))
  Start.setHours(Start.getHours() + parseInt(Segundos[0]))
  return Start.toLocaleDateString() + ' ' + Start.toLocaleTimeString()
}