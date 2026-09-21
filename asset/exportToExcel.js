class ExportToExcel{
    constructor(){
        let container=document.querySelector('#progressBarContainer')
        let btn=document.createElement('input')
        btn.type='button'
        btn.value='Export'
        btn.className='btnExport'
        btn.addEventListener('click',async ()=>{await this.export()})
        container.appendChild(btn)
        // setTimeout(async () => {
        //   await this.export()  
        // },10)
        // console.log('ter')

    }
    async export(){
        let ar=[]
        let table=document.querySelector("#tableContainer table")
        let tr=table.querySelectorAll('tr')
        let r=0
        let c=0
        let arJustifiedAbs=[]
        tr.forEach((v)=>{
            let ar0=[]
           let t=(r===0)?'th':'td'
           let td=v.querySelectorAll(t)
           c=0
           td.forEach((y)=>{
            let cn=y.className;
            console.log(cn)
            if(cn==="justified"){
                arJustifiedAbs.push([r,c])
            }
            ar0.push(y.innerText)
            c++
           })
           r++
           ar.push(ar0)
        })
        // console.log(ar)
        await window.ExcelAccessManager.exportRows(ar, 'export.xlsx', '202609',{arJustifiedAbs:arJustifiedAbs}) 
    }
}