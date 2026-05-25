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
    let error = ''
    data.forEach(function(video){
      const id = video[1].replaceAll(' ', '')
      const tr = document.getElementById('video-' + id)
      if(tr === null){
        error += video[1]
      }else{
        tr.ondblclick()
        document.getElementById(id).cells[HORA].innerHTML = video[0].replaceAll(' ', '<br>')
      }
    })
    if(error !== ''){
      alert('Videos não encontrados:\n' + error)
    }
  }
  obj = document.createElement('input')
  obj.type = 'file'
  obj.accept = 'application/json'
  obj.setAttribute('onchange', 'file.readAsText(obj.files[0])')
  obj.click()
}