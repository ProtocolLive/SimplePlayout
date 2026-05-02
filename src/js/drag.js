function DragEnable(tr){
  tr.setAttribute('draggable', 'true')
  tr.setAttribute('ondragstart', "Dragged=this")
  tr.setAttribute('ondragover', "DragOver(event,this)")
  tr.setAttribute('ondragleave', "DragLeave(this)")
  tr.setAttribute('ondrop', "DragDrop(event,this)")
}

function DragDrop(Event, tr){
  Event.preventDefault()
  tr.classList.remove('Selected', 'AddTop', 'AddBottom')
  medidas = tr.getBoundingClientRect()
  meio = medidas.top + medidas.height / 2
  CreateLine(tr, Event.clientY < meio)
  RecalcularTudo(tr)
}

function DragLeave(tr){
  tr.classList.remove('Selected', 'AddTop', 'AddBottom')
}

function DragOver(Event, tr){
  if(Dragged !== tr){
    event.preventDefault()
    medidas = tr.getBoundingClientRect()
    meio = medidas.top + medidas.height / 2
    if(Event.clientY < meio){
      tr.classList.add('AddTop')
      tr.classList.remove('AddBottom')
    }else{
      tr.classList.remove('AddTop')
      tr.classList.add('AddBottom')
    }
  }
}