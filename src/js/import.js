function Export(){
  videos = document.getElementById('Playlist').querySelectorAll('tr.Selected')
  if(videos.length === 0){
    alert('Nenhum video selecionado')
    return
  }
  videos2 = []
  videos.forEach(function(video){
    videos2.push([
      video.cells[HORA].innerHTML.replaceAll('<br>', ' '),
      video.cells[VIDEO].children[0].textContent
    ])
  })
  dados = new Blob([JSON.stringify(videos2)], {type: 'application/json'})
  link = document.createElement('a')
  link.href = URL.createObjectURL(dados)
  link.download = 'playlist.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

function Import(){
  file = new FileReader
  file.onload = function(e){
    data = JSON.parse(e.target.result)
    data.forEach(function(video){
      document.getElementById('Videos').querySelectorAll('tr').forEach(function(tr){
        if(tr.cells.length === 2
        && tr.cells[0].textContent === video[1]){
          tr.ondblclick()
          document.getElementById(video[1].replaceAll(' ', '')).cells[HORA].innerHTML = video[0].replaceAll(' ', '<br>')
        }
      })
    })
    document.removeChild(obj)
  }
  obj = document.createElement('input')
  obj.type = 'file'
  obj.accept = 'application/json'
  obj.setAttribute('onchange', 'file.readAsText(obj.files[0])')
  obj.click()
}