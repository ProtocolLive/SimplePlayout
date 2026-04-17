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

let TempoNdi = []

Ajax('cls.php', 'Videos')
Ajax('ConfigServer.php', 'AjaxBlank')

decorrido = new Date('1970-1-1')
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
  decorrido.setSeconds(Math.floor(event[1]))
  restante = new Date('1970-1-1 ' + tr.cells[TEMPOS].children[TemposTotal].textContent)
  restante = new Date(restante - decorrido)
  tr.cells[TEMPOS].children[TemposRestante].textContent = restante.toISOString().substr(11, 8)
  tr.cells[TEMPOS].children[TemposBarra].value = event[1]
  //carregar o proximo
  if(tr.cells[TEMPOS].children[TemposRestante].textContent === '00:00:05'
  && tr.nextElementSibling !== null
  && tr.nextElementSibling.getAttribute('preload') === null){
    Preload(tr.nextElementSibling)
    return
  }
  //play no proximo
  if (tr.cells[TEMPOS].children[TemposRestante].textContent === '00:00:00'
  && tr.classList.contains('Played') === true
  && tr.nextElementSibling !== null
  && tr.nextElementSibling.classList.contains('Played') === false) {
    Play(tr.nextElementSibling)
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
  temp.innerHTML = '<a href"#" onclick="Play(this.closest(\'tr\'))" class="Pointer">▶️</a>' +
    '<a href"#" onclick="Remover(this.closest(\'tr\'))" class="Pointer">❎</a>'
  td.appendChild(temp)
  tr.appendChild(td)

  //tempos
  td = document.createElement('td')
  td.classList = Css
  temp = document.createElement('span')
  if (DraggedVideo !== null) {
    if (DraggedVideo.cells[1] === undefined) {//ndi
      temp.textContent = '00:00:00'
    }else{
      temp.textContent = DraggedVideo.cells[1].textContent
    }
  } else {
    temp.textContent = DraggedPlaylist.cells[TEMPOS].children[TemposTotal].textContent
  }
  td.appendChild(temp)
  temp = document.createElement('span')
  temp.textContent = ' / '
  td.appendChild(temp)
  duracao = document.createElement('span')
  if (DraggedVideo !== null) {
    if (DraggedVideo.cells[1] !== undefined) {
      duracao.textContent = DraggedVideo.cells[1].textContent
    }
  } else {
    duracao.textContent = DraggedPlaylist.cells[TEMPOS].children[TemposTotal].textContent
  }
  td.appendChild(duracao)
  td.appendChild(document.createElement('br'))
  temp = document.createElement('progress')
  duracao = duracao.textContent.split(':')
  duracao = (duracao[0] * 3600) + (duracao[1] * 60) + parseInt(duracao[2])
  temp.setAttribute('max', duracao)
  td.appendChild(temp)
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
      document.getElementById('Vazio').remove()
    }
  } else {
    Objeto.previousSibling.remove()
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
    if (tr.cells[0].textContent.toLowerCase().includes(Texto.toLowerCase()) === false) {
      tr.style.display = 'none'
    } else {
      tr.style.display = ''
    }
  })
}

function Play(tr) {
  if(tr.getAttribute('preload') === null){
    Preload(tr)
  }
  fetch(
    'play.php?action=play&logo=' + tr.cells[OPCOES].children[OpcoesLogo].checked +
    '&live=' + tr.cells[OPCOES].children[OpcoesLive].checked
  )
  temp = new Date
  tr.cells[HORA].innerHTML = temp.toLocaleDateString() + '<br>' + temp.toLocaleTimeString()
  tr.classList.add('Played')
  tr.cells[VIDEO].children[2].remove()
  //Hora dos próximos
  clearInterval(TempoNdi[2])
  if(tr.cells[VIDEO].children[0].textContent === 'ENTRADA NDI'){
    TempoNdi[0] = tr
    TempoNdi[1] = new Date('1970-1-1')
    TempoNdi[2] = setInterval(function(){
      TempoNdi[1].setSeconds(TempoNdi[1].getSeconds() + 1)
      TempoNdi[0].cells[TEMPOS].children[TemposTotal].textContent = TempoNdi[1].toLocaleTimeString()
    },1000)
  }else{
    RecalcularTudo(tr)
  }
}

function Preload(tr){
  fetch(
    'play.php?action=load&video=' + tr.cells[VIDEO].children[0].textContent +
    '&transicao=' + tr.cells[OPCOES].children[OpcoesTransicao].value +
    '&duracao=' + tr.cells[OPCOES].children[OpcoesTempo].value +
    '&tween=' + tr.cells[OPCOES].children[OpcoesTween].value +
    '&direcao=' + tr.cells[OPCOES].children[OpcoesDirecao].value
  )
  tr.setAttribute('preload', true)
}

function RecalcularTudo(tr) {
  tr = tr.nextElementSibling
  while (tr !== null) {
    if(tr.previousSibling.cells[VIDEO].children[0].textContent === 'ENTRADA NDI'){
      tr.cells[HORA].textContent = ''
    }else{
      tr.cells[HORA].textContent = TempoSoma(
        tr.previousSibling.cells[HORA].innerHTML.replaceAll('<br>', ' '),
        tr.previousSibling.cells[TEMPOS].children[TemposTotal].textContent
      )
    }
    if(tr.cells[VIDEO].children[0].textContent !== 'ENTRADA NDI'){
      tr.cells[TEMPOS].children[TemposRestante].textContent = tr.cells[TEMPOS].children[TemposTotal].textContent
    }
    tr.cells[HORA].innerHTML = tr.cells[HORA].innerHTML.replaceAll(' ', '<br>')
    tr.classList.remove('Played')
    tr.removeAttribute('preload')
    tr = tr.nextElementSibling
  }
}

function Remover(tr) {
  tr.remove()
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