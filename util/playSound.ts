const play = async (path: string) => {
  let primary = new Audio()
  primary.src = path
  primary.play()

  primary.addEventListener('ended', () => {
    primary.src = ''
    primary.remove()
  })

  document.addEventListener('muteAll', () => {
    primary.pause()
    primary.src = ''
    primary.remove()
  })
}

export default play