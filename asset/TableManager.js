class TableManager{

constructor(opt={}){
    const{month="2026-09",
        ws=null,
        colLimit=null,
        usedRow=null
    }=opt
    // console.log(opt)

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
        console.log(d)
        th.dataset.index=s
        th.classList.add(`jours${d}`)
        th.textContent=txt
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

}
