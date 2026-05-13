/**
 * @param {Date} Data
 * @param {boolean} Br
 * @returns Formato DD/MM/YYYY HH:MM:SS
 */
function DateFormat(Data, Br){
  return Data.getDate().toString().padStart(2, '0') + '/' +
    (Data.getMonth() + 1).toString().padStart(2, '0') + '/' +
    Data.getFullYear() + (Br ? '<br>' : ' ') +
    Data.getHours().toString().padStart(2, '0') + ':' +
    Data.getMinutes().toString().padStart(2, '0') + ':' +
    Data.getSeconds().toString().padStart(2, '0')
}

/**
 * 
 * @param {string} Data Formato DD/MM/YYYY HH:MM:SS
 */
function DatePrepare(Data){
  Data = Data.split(' ')
  Data[0] = Data[0].split('/')
  return new Date(Data[0][2] + '-' + Data[0][1] + '-' + Data[0][0] + ' ' + Data[1])
}

/**
 * 
 * @param {string} Start Hora inicial, no formato DD/MM/YYYY HH:MM:SS
 * @param {string} Seconds Tempo a adicionar, no formato HH:MM:SS
 * @param {boolean} Br
 */
function TimeSum(Start, Seconds, Br) {
  if (Start === '') {
    return
  }
  Start = DatePrepare(Start)
  Seconds = Seconds.split(':').map(Number)
  Start.setSeconds(Start.getSeconds() + Seconds[2])
  Start.setMinutes(Start.getMinutes() + Seconds[1])
  Start.setHours(Start.getHours() + Seconds[0])
  return DateFormat(Start, Br)
}