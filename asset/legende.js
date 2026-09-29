class legende{
    constructor(){
        let legendeContainer =document.createElement('div')
        let head=document.createElement('div')
        head.className='header'
        head.textContent="LEGENDE"
        head.addEventListener('click', (e) => {
            let parent=e.target.closest('#legende')
            console.log(parent)
            parent.classList.toggle('is-active');
        });
        legendeContainer.appendChild(head)
        legendeContainer.id="legende"
        document.querySelector('body').appendChild(legendeContainer)
        let ar=[`heure d'entrée`,'durée sur field', 'heure de sortie','Banque','Absence sans Evidence','Absence avec Evidence', 'Permission', 'Congé','OMSI','Repos Medical']
        let arContent=['','9','','BA','AB','XX','PE','CO','OM','RM']
        let t1=document.createElement('table')
        t1.className='tableLegende0'
        
        for(let i=0;i<ar.length;i++){
            let tr=document.createElement('tr')
            let td = document.createElement('td')
            let div=document.createElement('div')
            div.className='containerInTd'
            let span=document.createElement('span')
            span.textContent=(i===0)?`xx:xx`:''
            span.className='heureEntree'
            div.appendChild(span)
            let label=document.createElement('label')
            label.textContent=arContent[i]
            div.appendChild(label)
            let span2=document.createElement('span')
            span2.textContent=(i===2)?`xx:xx`:''
            span2.className='heureSortie'
            div.appendChild(span2)
            td.appendChild(div)
            
            tr.appendChild(td)
            let td2=document.createElement('td')
            let div2=document.createElement('div')
            div2.textContent=ar[i]
            td2.appendChild(div2)
            tr.appendChild(td2)

            if(i===5){
                td.classList.add('justified')
                td2.classList.add('justified')
            }

            t1.appendChild(tr)
        }
        // t1.appendChild(tr)
        // let tr1=document.createElement('tr')
        // for(let i=0;i<ar.length;i++){
        //     let td = document.createElement('td')
        //     let div=document.createElement('div')
        //     div.textContent=ar[i]

        //     td.appendChild(div)
        //     tr1.appendChild(td)
        // }
        // t1.appendChild(tr1)
        setTimeout(()=>{legendeContainer.appendChild(t1)},200)
    }
}
