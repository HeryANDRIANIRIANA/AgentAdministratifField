class TableManager{

constructor(opt={}){
    const{month="2026-09",
        ws=null,
        colLimit=null,
        usedRow=null
    }=opt
    // console.log(opt)
    this.trByName={}

    this.month=month
    let tcontainer=document.createElement('div')
    tcontainer.id='tableContainer'
    let table=document.createElement('table')
    tcontainer.appendChild(table)
    let hr=document.createElement('tr')
    const ajoutTH=(txt,opt={})=>{
        const{type='th',o=hr, selectorIndex="0"}=opt
        let th=document.createElement(type)
        // console.log(selectorIndex)
        let s=selectorIndex.toString().padStart(2,"0")
        let y=this.month.split('-')[0]
        let m=this.month.split('-')[1]
        let dt=new Date(y,m,s)
        let d=dt.getDay()
        // console.log(d)
        th.dataset.index=s
        th.classList.add(`jours${d}`)
        if(type==='td' && selectorIndex!=="0"){
            let div=document.createElement('div')
            div.className='containerInTd'
            let span=document.createElement('span')
            span.textContent=''
            span.className='heureEntree'
            div.appendChild(span)
            let label=document.createElement('label')
            
            label.textContent=txt
            div.appendChild(label)
            div.addEventListener('click',(e)=>{
                this.setEnterTime(e)
            })
            th.appendChild(div)

        }else{
            th.textContent=txt
        }
        o.appendChild(th)
    }
    ajoutTH("NOM PRENOM/Date")
    let dtData=ws.getRow(4).values
    for(let i=colLimit[0];i<=colLimit[1];i++){
        if(typeof(dtData[i])!=="undefined"){
            ajoutTH(dtData[i],{selectorIndex:dtData[i]})
        }
    }
    table.appendChild(hr)
    
    const ajoutTableBody=()=>{
        usedRow.forEach(element => {
        let tr=document.createElement('tr')
        
        let ar=ws.getRow(element).values
        tr.id=ar[1]
        // ajoutTH(ar[9],{type:'td',o:tr})
        let nameToLower=ar[9].toLowerCase()
        if(typeof(this.trByName[nameToLower])==="undefined"){
            this.trByName[nameToLower]=[]
        }
        this.trByName[nameToLower].push(tr.id)
        ajoutTH(ar[9],{type:'td',o:tr})
        for(let i=colLimit[0];i<=colLimit[1];i++){
            let txt=""
            if(typeof(dtData[i])!=="undefined"){
                // console.log(dtData[i])
                if(typeof(ar[i])!=="undefined"){
                txt=ar[i]
                // console.log(txt)
                if(typeof(ar[i])!=="number"){
                    txt=txt.slice(0,2)
                }
                ajoutTH(txt,{type:'td',o:tr, selectorIndex:dtData[i]})
                }else{
                 ajoutTH("",{type:'td',o:tr, selectorIndex:dtData[i]})   
                }
            }
            
            
        }
        table.appendChild(tr)
        
        });
    }
    ajoutTableBody()
    

    let body=document.querySelector('body')
    body.appendChild(tcontainer)
    setTimeout( this.filterByName() ,100)
    this.enterTime()

}

elaborationDates(){
    try{
        let monthLength=31
        let curentMonth=parseInt(this.month.split('-')[1])-1
        let dt=new Date(parseInt(this.month.split('-')[0]),curentMonth,monthLength)
        console.log(dt.getMonth())
    }catch(e){
        console.log(e)
    }
}

filterByName(){
    const hideAlltr=(opt=true)=>{
        let tr=document.querySelectorAll('#tableContainer table tr')
        // console.log(tr)
        let i=0
        tr.forEach((v)=>{
            if(i!==0){
                // tr.style.display=(opt===true)?'none':'block';
                tr[i].hidden=opt
            }
            i++
        })
    }
    const initFilter=()=>{
        let filterField=document.querySelector("#tableContainer table tr th")
        // console.log(filterField.classList)
        let input=document.createElement('input')
        input.className='nameFilterInput'
        input.placeholder="NOM PRENOM"
        input.addEventListener('input',(e)=>{
            // console.log(this.trByName)
            let ar0=Object.keys(this.trByName)
            let v=e.target.value.toLowerCase()
            if(v!==''){
                hideAlltr(true)
            }else{
                hideAlltr(false)
            }

            let nameFound=ar0.filter(m=>{
                return m.toLowerCase().includes(v);
            })
            // console.log(nameFound)
            nameFound.forEach((v)=>{
                let s=this.trByName[v][0]
                let t=document.getElementById(`${s}`)
                t.hidden=false
            })
            
        })
        filterField.replaceChildren(input)
        

    }
    initFilter()
}

enterTime(){
    const hideAlltd=(s="")=>{
        let tr=document.querySelectorAll('#tableContainer table tr')
        // console.log(tr)
        let i=0
        tr.forEach((v)=>{
            let l=Array.from(tr[i].children)
            let j=0
            // console.log(l)
            l.forEach((td)=>{
                if(j!==0){
                    if(s!=="" && td.dataset.index!==s){
                        td.hidden=true
                    }else{
                        td.hidden=false
                    }
                }
               j++ 
            })
            i++
        })
    }
    let container=document.querySelector('#progressBarContainer')
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'ma-case'; // Optionnel : utile pour l'associer à un label
    checkbox.value = 'valeur_ici';
    let dt=new Date()
    
    let s=dt.getDate().toString().padStart(2,0)
    checkbox.addEventListener('change',(e)=>{
        if(e.target.checked){
            hideAlltd(s)
        }else{
            hideAlltd()
        }
    })

    container.appendChild(checkbox)
}

setEnterTime(e){
    // console.log(e.target)
    // console.log(e.target.closest('td'))
    // let div=e.target.closest('div')
    if(document.querySelector('#ma-case').checked){
        let span=e.target.children[0]
        let dt=new Date()
        let h=dt.getHours()
        let min=dt.getMinutes()
        // console.log(h)
        let sh=h.toString().padStart(2,"0")
        let smin=min.toString().padStart(2,"0")
    span.textContent=`${sh}:${smin}`
    }
    
    
}

}
