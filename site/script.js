const nameInput = document.getElementById('nameInput')
const msgInput = document.getElementById('msgInput')
const chat = document.getElementById('chat')
const sendForm = document.getElementById('sendForm')

const KEY = 'aloo_chat_ui_1'
let state = {name:'',messages:[]}

function load(){
  const raw = localStorage.getItem(KEY)
  if(!raw) return {name:'',messages:[]}
  try{return JSON.parse(raw)}catch(e){return {name:'',messages:[]}}
}

function save(){
  localStorage.setItem(KEY, JSON.stringify(state))
  if(typeof bc !== 'undefined') bc.postMessage({type:'state-updated'})
  else localStorage.setItem(KEY + '_updated_at', Date.now())
}

function render(){
  chat.innerHTML = ''
  state.messages.forEach(m=>{
    const box = document.createElement('div')
    box.className = m.me ? 'msg msg-me' : 'msg'
    box.innerHTML = '<div class="who">'+m.name+'</div><div class="bubble">'+m.text+'</div>'
    chat.appendChild(box)
  })
  chat.scrollTop = chat.scrollHeight
}

state = load()
nameInput.value = state.name || ''
render()

let bc
try{bc = new BroadcastChannel('aloo_chat_channel')}
catch(e){bc = undefined}

if(bc){
  bc.addEventListener('message', ev=>{
    if(ev.data && ev.data.type === 'state-updated'){
      state = load()
      nameInput.value = state.name || ''
      render()
    }
  })
}

window.addEventListener('storage', e=>{
  if(e.key === KEY || e.key === KEY + '_updated_at'){
    state = load()
    nameInput.value = state.name || ''
    render()
  }
})

sendForm.addEventListener('submit', e=>{
  e.preventDefault()
  const name = nameInput.value.trim()
  const text = msgInput.value.trim()
  if(!text) return
  state.name = name
  state.messages.push({name: name || 'Me', text, me: true})
  save()
  render()
  msgInput.value = ''
})
