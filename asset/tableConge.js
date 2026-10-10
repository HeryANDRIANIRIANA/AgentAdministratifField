class TableConge{
    constructor(){
        setTimeout(async()=>{
            await this.defineData()
        },10)
        this.ws=null
        this.colLimit=[]
    }
    async defineData(){
        //le data provienne d'une feuille excel
        // console.log(window.wb)
        const startIndex="Solde au 31/08/2026"
        const endIndex= "Solde au 31/12/2026"
        const getColLimit=()=>{
            let enteteData=this.ws.getRow(1).values
            // console.log(enteteData);
            let start=enteteData.indexOf(startIndex)
            let end=enteteData.indexOf(endIndex)
            // console.log(this.ws.getRow(1).getCell(start).address);
            return [start,end]
        }
        const getUsedRow=()=>{
            let usedRows=[]
           this.ws.eachRow({includeEmpty:false},(row, rowNumber)=>{
            // console.log(row,rowNumber);
            if(!row.hidden){
                usedRows.push(rowNumber)
            }
            
           })
           return usedRows
        }
        this.ws=window.wb.getWorksheet(window.feuilleConge)
        this.colLimit=getColLimit()
        // this.usedRows=getUsedRow()
        await this.drawTable()
    }
    async drawTable(){
        let colSelectors=[]
        const formatMonth=(m)=>{
            
            let s=""
            let a=m.split('/')
            s=a[2]+'-'+a[1]
            return s;
        }
        const addTd=(opt={})=>{
            const{type='td',textContent='',parent=null, colIndex=0}=opt
            let td=document.createElement(type)
            if(type==='th'){
                let arTextC=textContent.split(' ')
                td.dataset.colSelector=(arTextC.length>1)?arTextC[1].toLowerCase():arTextC[0].toLowerCase()
                colSelectors.push(td.dataset.colSelector)
                //mise en place des mois dans colSelector
                if(arTextC[0].trim().toLowerCase()==='solde' && colSelectors.length>1){
                    let position=colSelectors.length-1
                    colSelectors[position-3]+=" "+formatMonth(arTextC[2])

                }
            }else{
                // console.log(colSelectors[colIndex])
                td.dataset.colSelector=colSelectors[colIndex].split(' ')[0]
                td.dataset.mois=(typeof(colSelectors[colIndex].split(' ')[1])!=="undefined")?colSelectors[colIndex].split(' ')[1]:''
            }
            td.textContent=textContent
            if(parent){
                parent.appendChild(td)
            }
            return td
        }
        let container=document.getElementById('tableContainer')
        container.children[0].remove()
        let table=document.createElement('table')
        let hr=document.createElement('thead') 
        addTd({textContent:"NOM PRENOMS",parent:hr, type:'th'})
        this.ws.getRow(1).eachCell((cell, colNumber) => {
            if(colNumber>=this.colLimit[0] && colNumber<=this.colLimit[1]){
                addTd({textContent:cell.value,parent:hr, type:'th'})
            }
        });
        table.appendChild(hr)
        this.ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if(rowNumber>1 && !row.hidden){
                let nomPrenom=row.getCell(3).value+" "+row.getCell(4).value
                let tr=document.createElement('tr')
                tr.id=row.getCell(1).value
                addTd({textContent:nomPrenom,parent:tr, type:'td'})
                let i=1
                row.eachCell((cell, colNumber) => {
                    if(colNumber>=this.colLimit[0] && colNumber<=this.colLimit[1]){
                        // console.log(cell.value)
                        addTd({textContent:(typeof(cell.value) !== 'object' ? cell.value.toFixed(2) : cell.value.result.toFixed(2)),parent:tr, type:'td', colIndex:i})
                        i++
                    }
                });
                table.appendChild(tr)
            }
                
        });
        container.appendChild(table)
        await this.placeJustificatifs()
    }

    async placeJustificatifs(){
        let ar=["2026-09","2026-11"]
        for(let i=0;i<ar.length;i++){
            delete window.classement0[ar[i]]
            window.classement0={...await listAndClassementFileNames({currentMois:ar[i]}), ...window.classement0}
        }
        // console.log(window.classement0)
        Object.keys(window.classement0).forEach(async (value, key) => {
            // Process each value in window.classement0
            let m=value //mois
            let o=window.classement0[value]
            if(o.hasOwnProperty('CONGE')){
                 let conge=o['CONGE']
                //  console.log(m,conge)
                Object.values(conge).forEach((v,k)=>{
                    // console.log(v)
                    Object.entries(v).forEach(([k1, v1]) => {
                        // console.log(k1, v1);
                        let detail=v1[0].fileComment.dateConcernee
                        let fileUrl=v1[0].fileUrl
                        let trId=k1
                        // const moisValeur = "2026-11";
                        const e = document.querySelector(`#${trId} td[data-mois="${m}"]`);
                        if (e) {
                            e.className='justified'
                            e.dataset.justifUrl=fileUrl
                            e.addEventListener('click',(ev)=>{
                            let parentTd=ev.target
                            // console.log(parentTd.dataset.justifUrl)
                            //#justifContainer.is-active
                            let justifContainer=document.querySelector('#justifContainer')
                            if(!justifContainer.classList.contains("is-active")){
                            justifContainer.classList.add('is-active')

                            }
                            let frame=justifContainer.querySelector('.body iframe')
                            frame.src=parentTd.dataset.justifUrl
                            })
                        }
                    })
                })
            }
            
            
        });
    }
    
}