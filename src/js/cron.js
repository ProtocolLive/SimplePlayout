function CronDone(td){
  data = td.querySelector('input[type="datetime-local"]')
  td.innerHTML = DateFormat(new Date(data.value.replaceAll('T', ' '))).replaceAll(' ', '<br>')
  RecalcularTudo(td.closest('tr'))
  td.closest('tr').setAttribute('cron', true)
}

function CronOut(td){
  td.innerHTML = ''
}

function CronSet(td){
  if(td.parentNode.classList.contains('Played')){
    return
  }
  temp = document.createElement('input')
  temp.type = 'datetime-local'
  temp.step = 1
  temp2 = new Date
  temp.value = temp2.getFullYear() + '-' + (temp2.getMonth() + 1).toString().padStart(2, '0') + '-' + temp2.getDate().toString().padStart(2, '0') + 'T' +
    temp2.getHours().toString().padStart(2, '0') + ':' + temp2.getMinutes().toString().padStart(2, '0') + ':' + temp2.getSeconds().toString().padStart(2, '0')
  temp.setAttribute('onclick', 'event.stopPropagation()')
  td.innerHTML = ''
  td.appendChild(temp)
  td.appendChild(document.createElement('br'))
  temp = document.createElement('button')
  temp.type = 'button'
  temp.textContent = 'Cancelar'
  temp.setAttribute('onclick', 'event.stopPropagation();CronOut(this.closest(\'td\'))')
  td.appendChild(temp)
  temp = document.createElement('button')
  temp.type = 'button'
  temp.textContent = 'OK'
  temp.setAttribute('onclick', 'event.stopPropagation();CronDone(this.closest(\'td\'))')
  td.appendChild(temp)
}