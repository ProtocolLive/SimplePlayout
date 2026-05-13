function DragEnable(tr){
  tr.setAttribute('draggable', 'true')
  tr.setAttribute('ondragstart', "Dragged=this")
  tr.setAttribute('ondragover', "DragOver(event,this)")
  tr.setAttribute('ondragleave', "DragLeave(this)")
  tr.setAttribute('ondrop', "DragDrop(event,this)")
}

function DragDrop(Event, tr){
  const medidas = tr.getBoundingClientRect()
  const meio = medidas.top + medidas.height / 2
  if(tr.classList.contains('Played')
  && tr === tr.parentElement.lastElementChild
  && Event.clientY < meio){
    return
  }
  Event.preventDefault()
  tr.classList.remove('Selected', 'AddTop', 'AddBottom')
  CreateLine(tr, Event.clientY < meio)
  RecalcularTudo(tr)
}

function DragLeave(tr){
  tr.classList.remove('Selected', 'AddTop', 'AddBottom')
}

function DragOver(Event, tr){
  const ultimo = tr.parentElement.lastElementChild
  if(Dragged === tr){
    return
  }
  event.preventDefault()
  medidas = tr.getBoundingClientRect()
  meio = medidas.top + medidas.height / 2
  if(Event.clientY < meio){
    if(tr.classList.contains('Played') === false && tr !== ultimo){
      tr.classList.add('AddTop')
    }
    tr.classList.remove('AddBottom')
  }else{
    tr.classList.remove('AddTop')
    tr.classList.add('AddBottom')
  }
}