class JustifPannel{
    constructor(){
        let container=document.createElement('div')
        container.id='justifContainer'
        let head=document.createElement('div')
        head.className='header'
        head.textContent='X'
        head.addEventListener('click', (e) => {
            let parent=e.target.closest('#justifContainer')
            // console.log(parent)
            parent.classList.toggle('is-active');
        });
        container.appendChild(head)
        let body=document.createElement('div')
        body.className='body'
        let frame=document.createElement('iframe')
        body.appendChild(frame)
        container.appendChild(body)
        document.querySelector('body').appendChild(container)
        
    }
}