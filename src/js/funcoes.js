const Server = '192.168.0.102'

const HORA = 0
const VIDEO = 1
const TEMPOS = 2
const OPCOES = 3
const OK = 4

const TemposAtual = 0
const TemposTotal = 2
const TemposBarra = 4

const OpcoesTransicao = 0
const OpcoesTempo = 1
const OpcoesTween = 3
const OpcoesDirecao = 4
const OpcoesLogo = 6

let DraggedItem = null

const osc = new EventSource('http://127.0.0.1:8080/osc.php')
EnableDragInChildrens(document.getElementById('Playlist'))
Ajax('cls.php?server=' + Server, 'Videos')

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
  event[1] = Math.floor(event[1])
  tr.cells[TEMPOS].children[0].textContent = new Date(event[1] * 1000).toISOString().substr(11, 8)
  tr.cells[TEMPOS].children[TemposBarra].value = event[1]
  //play no proximo
  if(tr.cells[TEMPOS].children[TemposAtual].textContent === tr.cells[TEMPOS].children[TemposTotal].textContent
  && tr.cells[OK].textContent === ''){
    tr.cells[OK].textContent = 'OK'
    if(tr.nextElementSibling !== null){
      Play(tr.nextElementSibling)
    }
  }
}

function CalcularHorarios(Start, Segundos) {
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

function EnableDrag(Item) {
  Item.addEventListener('dragover', function (e) {
    e.preventDefault()
    this.classList.add('Selected')
  })
  Item.addEventListener('dragleave', function () {
    this.classList.remove('Selected')
  })
  Item.addEventListener('drop', function (e) {
    const Css = 'BorderFinBlack TextCenter'
    e.preventDefault()
    if (DraggedItem === this) {
      return
    }
    this.classList.remove('Selected')
    tr = document.createElement('tr')
    tr.id = DraggedItem.cells[0].textContent.replaceAll(' ', '')
    EnableDrag(tr)

    //hora
    td = document.createElement('td')
    td.classList = Css
    tr.appendChild(td)

    //video
    td = document.createElement('td')
    td.classList = Css
    temp = document.createElement('span')
    temp.textContent = DraggedItem.cells[0].textContent
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
    temp.textContent = '00:00:00'
    td.appendChild(temp)
    temp = document.createElement('span')
    temp.textContent = ' / '
    td.appendChild(temp)
    temp = document.createElement('span')
    if (DraggedItem.cells[1] === undefined) {
      temp.textContent = 'NDI'
    } else {
      temp.textContent = DraggedItem.cells[1].textContent
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
    temp.textContent = 'Push'
    select.appendChild(temp)
    temp = document.createElement('option')
    temp.value = 'SLIDE'
    temp.textContent = 'Slide'
    select.appendChild(temp)
    temp = document.createElement('option')
    temp.value = 'WIPE'
    temp.textContent = 'Wipe'
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
    tr.appendChild(td)

    td = document.createElement('td')
    td.classList = Css
    tr.appendChild(td)

    this.parentNode.insertBefore(tr, this.nextSibling)
    if(document.getElementById('Vazio') !== null){
      document.getElementById('Playlist').removeChild(document.getElementById('Vazio'))
    }
  })
}

function EnableDragInChildrens(Id) {
  Id.querySelectorAll('tr').forEach(function (item) {
    EnableDrag(item)
  })
}

function FiltraVideos(Texto) {
  document.getElementById('Videos').querySelectorAll('tr').forEach(function (tr) {
    if (tr.cells[0].textContent.toLowerCase().search(Texto.toLowerCase()) === -1) {
      tr.style.display = 'none'
    }
  })
}

function Play(Objeto) {
  if (Objeto.cells[1].textContent === 'ENTRADA NDI') {
    fetch('ndi.php?url=' + Server)
  } else {
    fetch(
      'play.php?server=' + Server +
      '&video=' + Objeto.cells[VIDEO].children[0].textContent +
      '&transicao=' + Objeto.cells[OPCOES].children[OpcoesTransicao].value +
      '&duracao=' + Objeto.cells[OPCOES].children[OpcoesTempo].value +
      '&tween=' + Objeto.cells[OPCOES].children[OpcoesTween].value +
      '&direcao=' + Objeto.cells[OPCOES].children[OpcoesDirecao].value +
      '&logo=' + Objeto.cells[OPCOES].children[OpcoesLogo].checked +
      '&live='
    )
  }
  //Hora reproduzido
  temp = new Date
  Objeto.cells[HORA].innerHTML = temp.toLocaleDateString() + '<br>' + temp.toLocaleTimeString()
  //Definir valor máximo no progress
  duracao = Objeto.cells[TEMPOS].children[TemposTotal].textContent.split(':')
  duracao = (duracao[0] * 3600) + (duracao[1] * 60) + parseInt(duracao[2])
  Objeto.cells[TEMPOS].children[TemposBarra].setAttribute('max', duracao)
  //Hora dos próximos
  Objeto.cells[OK].textContent = ''
  Objeto = Objeto.nextElementSibling
  while (Objeto !== null) {
    Objeto.cells[HORA].textContent = CalcularHorarios(
      Objeto.previousSibling.cells[HORA].textContent,
      Objeto.previousSibling.cells[TEMPOS].children[TemposTotal].textContent
    )
    Objeto.cells[TEMPOS].children[TemposAtual].textContent = '00:00:00'
    Objeto.cells[OK].textContent = ''
    Objeto = Objeto.nextElementSibling
  }
}

function Remover(Objeto){
  document.getElementById('Playlist').removeChild(Objeto.parentNode.parentNode.parentNode)
  if(document.getElementById('Playlist').querySelectorAll('tr').length === 0){
    tr = document.createElement('tr')
    tr.id = 'Vazio'
    td = document.createElement('td')
    td.classList = 'BorderFinBlack TextCenter'
    td.textContent = 'VAZIO'
    td.setAttribute('colspan', 6)
    tr.appendChild(td)
    EnableDrag(tr)
    document.getElementById('Playlist').appendChild(tr)
  }
}