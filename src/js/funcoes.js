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

let Dragged = null
let TempoNdi = []

Ajax('cls.php', 'Videos')
Ajax('ConfigServer.php', 'AjaxBlank')

osc.onmessage = function (event) {
  event = JSON.parse(event.data)
  //VU
  document.getElementById('Volume1').value = event[2]
  document.getElementById('Volume2').value = event[3]
  //tempo reproduzido
  decorrido = new Date('1970-1-1')
  tr = document.getElementById(event[0].replaceAll(' ', ''))
  if (tr === null
  || tr.classList.contains('Played') === false) {
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

setInterval(function(){
  document.getElementById('Playlist').querySelectorAll('[cron="true"]').forEach(function(tr){
    hora = new Date
    hora.setSeconds(hora.getSeconds() + 1)
    hora = DateFormat(hora, true)
    if(tr.cells[HORA].innerHTML === hora){
      Play(tr)
      return
    }
  })
}, 500)

function CreateLine(Objeto, EmCima) {
  const Css = 'BorderFinBlack TextCenter'

  if(Dragged.cells.length === 4){
    if(EmCima){
      temp = Objeto
    }else{
      temp = Objeto.nextElementSibling
    }
    Objeto.parentNode.insertBefore(Dragged, temp)
    return
  }

  tr = document.createElement('tr')
  tr.id = Dragged.cells[0].textContent.replaceAll(' ', '')
  DragEnable(tr)
  tr.setAttribute('onclick', 'Selecionar(event,this);SomaTempoPlaylist(this)')

  //hora
  td = document.createElement('td')
  td.classList = Css
  td.setAttribute('onclick', 'event.stopPropagation();CronSet(this)')
  tr.appendChild(td)

  //video
  td = document.createElement('td')
  td.classList = Css
  temp = document.createElement('span')
  temp.textContent = Dragged.cells[0].textContent
  td.appendChild(temp)
  td.appendChild(document.createElement('br'))
  temp = document.createElement('span')
  temp.innerHTML = '<a href"#" onclick="event.stopPropagation();Play(this.closest(\'tr\'))" class="Pointer">▶️</a>' +
    '<a href"#" onclick="event.stopPropagation();Remover(this.closest(\'tr\'))" class="Pointer">❎</a>'
  td.appendChild(temp)
  tr.appendChild(td)

  //tempos
  td = document.createElement('td')
  td.classList = Css
  temp = document.createElement('span')
  if(Dragged.cells[1] !== undefined){
    temp.textContent = Dragged.cells[1].textContent
  }else{
    temp.textContent = '00:00:00'
  }
  td.appendChild(temp)
  temp = document.createElement('span')
  temp.textContent = ' / '
  td.appendChild(temp)
  duracao = document.createElement('span')
  if(Dragged.cells[1] !== undefined){
    duracao.textContent = Dragged.cells[1].textContent
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
  if(EmCima){
    temp = Objeto
  }else{
    temp = Objeto.nextSibling
  }
  Objeto.parentNode.insertBefore(tr, temp)
  if((temp = document.getElementById('Vazio')) !== null){
    temp.remove()
  }
  Dragged = null
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
    fetch(
      'play.php?action=loadplay&canal=' + document.getElementById('canal').value +
      '&video=' + tr.cells[VIDEO].children[0].textContent +
      '&transicao=' + tr.cells[OPCOES].children[OpcoesTransicao].value +
      '&duracao=' + tr.cells[OPCOES].children[OpcoesTempo].value +
      '&tween=' + tr.cells[OPCOES].children[OpcoesTween].value +
      '&direcao=' + tr.cells[OPCOES].children[OpcoesDirecao].value +
      '&logo=' + tr.cells[OPCOES].children[OpcoesLogo].checked +
      '&live=' + tr.cells[OPCOES].children[OpcoesLive].checked
    )
    tr.setAttribute('preload', true)
  }else{
    fetch(
      'play.php?action=play&logo=' + tr.cells[OPCOES].children[OpcoesLogo].checked +
      '&live=' + tr.cells[OPCOES].children[OpcoesLive].checked +
      '&canal=' + document.getElementById('canal').value
    )
  }
  tr.cells[HORA].innerHTML = DateFormat(new Date, true)
  tr.classList.add('Played')
  tr.cells[VIDEO].children[2].remove()
  tr.removeAttribute('draggable')
  tr.removeAttribute('ondragstart')
  tr.removeAttribute('cron')
  tr.previousElementSibling.removeAttribute('ondragover')
  tr.previousElementSibling.removeAttribute('ondragleave')
  //Hora dos próximos
  clearInterval(TempoNdi[2])
  if(tr.cells[VIDEO].children[0].textContent === 'ENTRADA NDI'){
    TempoNdi[0] = tr
    TempoNdi[1] = new Date('1970-1-1')
    TempoNdi[2] = setInterval(function(){
      TempoNdi[1].setSeconds(TempoNdi[1].getSeconds() + 1)
      TempoNdi[0].cells[TEMPOS].children[TemposTotal].textContent = TempoNdi[1].toLocaleTimeString(
        [],
        {hour: '2-digit', minute: '2-digit', second: '2-digit'}
      )
    }, 1000)
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
    '&direcao=' + tr.cells[OPCOES].children[OpcoesDirecao].value +
    '&canal=' + document.getElementById('canal').value
  )
  tr.setAttribute('preload', true)
}

function RecalcularTudo(tr) {
  tr = tr.nextElementSibling
  while (tr !== null) {
    if(tr.previousElementSibling.cells[VIDEO].children[0].textContent === 'ENTRADA NDI'){
      tr.cells[HORA].textContent = ''
    }else if(tr.previousElementSibling.cells[HORA].innerHTML !== ''){
      tr.cells[HORA].innerHTML = TimeSum(
        tr.previousElementSibling.cells[HORA].innerHTML.replaceAll('<br>', ' '),
        tr.previousElementSibling.cells[TEMPOS].children[TemposTotal].textContent,
        true
      )
    }
    if(tr.cells[VIDEO].children[0].textContent !== 'ENTRADA NDI'){
      tr.cells[TEMPOS].children[TemposRestante].textContent = tr.cells[TEMPOS].children[TemposTotal].textContent
    }
    tr.cells[HORA].innerHTML = tr.cells[HORA].innerHTML
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

function Selecionar(Evento, tr){
  if(tr.classList.contains('Played')){
    return
  }
  if(Evento.shiftKey){
    ultimo = document.getElementById('Playlist').querySelectorAll('tr.Selected')
    if(ultimo.length === 0){
      return
    }
    ultimo = ultimo[ultimo.length - 1]
    ultimo = ultimo.nextElementSibling
    while(ultimo !== tr){
      ultimo.classList.toggle('Selected')
      ultimo = ultimo.nextElementSibling
    }
    ultimo.classList.toggle('Selected')
  }else{
    tr.classList.toggle('Selected')
  }
}

function SomaTempoPlaylist(){
  tempo = new Date('1970-1-1')
  document.getElementById('Playlist').querySelectorAll('tr.Selected').forEach(function(tr){
    temp = tr.cells[TEMPOS].children[TemposTotal].textContent.split(':').map(Number)
    tempo.setHours(tempo.getHours() + temp[0])
    tempo.setMinutes(tempo.getMinutes() + temp[1])
    tempo.setSeconds(tempo.getSeconds() + temp[2])
  })
  document.getElementById('SumPlaylist').textContent = DateFormat(tempo).split(' ')[1]
}