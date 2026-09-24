window.myPb = null;
window.classement0={};
window.justificatifs={};
window.currentMois="2026-09";
// Copie de la prmière feuille en fonction des dates
async function copieFirtsSheet(){
         let wb=await window.ExcelAccessManager.readFile('data/verrif/result.xlsx')
         let ws=wb.getWorksheet('Feuil1')
         let oKeys=Object.keys(window.classement0)
         for (let i = 0; i < oKeys.length; i++) {
            let newSheetName = `${oKeys[i]}-05-2026`;
               await window.ExcelAccessManager.dupliquerFeuille(wb, ws, newSheetName);
                }   
                
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        let fileName = 'result.xlsx';
        window.ExcelAccessManager.downloadBlob(blob, fileName);
    }

function recupPresenceOnDate(date, fnName=null){
    let o=window.classement0[date]
    console.log(date,fnName,o, o[fnName])
    return o[fnName]|| null
}

function rectifPresenceOnDate(donnees, matricule){
    const matriculeRecherche = matricule; // Changez cette valeur pour tester (ex: "M00000")
    let trouvee=false
    let i=0
    let ligneTrouvee=[]
    while (i<donnees.length && trouvee===false) {
         
        if(donnees[i][2]===matriculeRecherche){
            // console.log(donnees[i])
            ligneTrouvee=donnees[i]
            trouvee=true
        }
        // console.log(donnees[i][2],matricule,trouvee)
        i++
    }
    const indexAuHasard = Math.floor(Math.random() * donnees.length); 
    ligneTrouvee=(trouvee===false)?donnees[indexAuHasard]:ligneTrouvee
    // trouvee=true   
    // 1. On cherche la ligne de l'employé
    // let ligneTrouvee = donnees.find(ligne => ligne.includes(matriculeRecherche));

    // 2. Si non trouvé, on prend une ligne au hasard
    // console.log(ligneTrouvee)
    // let trouvee=false
    // if (typeof(ligneTrouvee)==='undefined') {
    //     const indexAuHasard = Math.floor(Math.random() * donnees.length);
    //     ligneTrouvee = donnees[indexAuHasard];
    //     trouvee=false
    //     // console.log("Matricule non trouvé. Ligne retournée au hasard :");
    // } else {
    //     // console.log("Matricule trouvé :");
    //     trouvee=true
    // }

    // console.log(ligneTrouvee);
    return [ligneTrouvee,trouvee];
 
}

async function verrifPresence(){
    let wb=await window.ExcelAccessManager.readFile('data/verrif/result.xlsx')
    let wss=wb.worksheets
    // console.log(wss)
    const verrifSheet = (sheet) => {
        // console.log(`Vérification de la feuille : ${sheet.name}`);
        for(let i=12;i<23;i++){
            let row=sheet.getRow(i)
            let date=row.getCell(2).value.split('-')[0]
            let fnName=row.getCell(6).value
            // console.log(recupPresenceOnDate(date, fnName));
            let donnees=recupPresenceOnDate(date, fnName)
            if(donnees){
                let matricule=row.getCell(3).value
                let r=rectifPresenceOnDate(donnees, matricule)
                console.log(r);
                
                let ligneTrouvee=r[0]
                let t=r[1]
                // console.log(ligneTrouvee);
                
                let a1=[3,4,6]
                row.getCell(3).value=ligneTrouvee[2]
                
                row.getCell(4).value=ligneTrouvee[3]
                
                // row.getCell(5).value=ligneTrouvee[4]
                row.getCell(6).value=ligneTrouvee[4]
                // row.getCell(7).value=ligneTrouvee[6]
                // row.getCell(8).value=ligneTrouvee[7]
                // console.log(row);
                
                if(t===false){
                    row.getCell(5).value="NT"
                //     a1.forEach((colIndex)=>{
                //     row.getCell(colIndex).fill = {
                //         type: "pattern",
                //         pattern: "lightTrellis",   // ou "lightGrid", "lightTrellis", "darkTrellis", etc.
                //         fgColor: { argb: "FFFF0000" }, // couleur des hachures
                //         bgColor: { argb: "FFFFFFFF" }  // couleur de fond
                //     };
                // })
                }else{
                //     a1.forEach((colIndex)=>{
                //     row.getCell(colIndex).fill = {
                //         type: "pattern",
                //         pattern: "lightTrellis",   // ou "lightGrid", "lightTrellis", "darkTrellis", etc.
                //         fgColor: { argb: "FFFFFFFF" }, // couleur des hachures
                //         bgColor: { argb: "FFFFFFFF" }  // couleur de fond
                //     };
                // })
                }


            }
            // console.log(row.values)
        }

    }
    let i=1
    let batchSize=1
    let lim=wss.length
    let lecture1= async () => {
        let end= Math.min(i+ batchSize, lim);
        for (; i < end; i++) {
            verrifSheet(wss[i]);
        }
        if(end<lim){
            window.myPb.progress((end/lim)*100)
            setTimeout(await lecture1, 10);
        }else{
             const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        let fileName = 'result.xlsx';
        window.ExcelAccessManager.downloadBlob(blob, fileName);
        }
    }
    await lecture1()

}

async function elabbborationTSCleanUP(){
    let fileNames=['data/verrif/1 TIME SHEET PLANTSITE 04 05 26 au 09 05 2026.xlsx',
        'data/verrif/2 TIME SHEET PLANTSITE 11 05 26 au 17 05 2026.xlsx',
        'data/verrif/3 TIME SHEET PLANTSITE18 05 AU 30 05 2026 RECAP ABS.xlsx']

        let params1={
            start:0,
            batchSize:1
        }
        let i0=0
        let lim=fileNames.length
        let lireddParFile= async () => {
            let end= Math.min(i0+ params1.batchSize, lim);
            for (; i0< end; i0++) { 
                let fileName=fileNames[i0]
                await window.ExcelAccessManager.classement(fileName,'PRESENCE');
            }
            if(end<lim){
                setTimeout(async()=>await lireddParFile(), 10);  
            }else{
                // console.log(window.classement0)
                // copieFirtsSheet()
                verrifPresence()
            }
        }
        await lireddParFile()
}

async function getFileList(){
    try{
        let rep=await fetch('data/fileList.txt')
        let fileNames=await rep.text()
        return fileNames.split(',').filter((v)=>!!v)
    }catch(e){  
        console.log(e)
    }
}

async function getCommentaire(pdfUrl) {
    try {
        // console.log(pdfUrl)
        let comm=""
        const resp = await fetch(pdfUrl)
            // if(!resp.ok)throw new Error('erreur')
            const arBuffer = await resp.arrayBuffer()
            const pdfDc = await PDFLib.PDFDocument.load(arBuffer)
            // console.log(pdfDc)
            comm= pdfDc.getSubject()

            return comm

    } catch (err) {
        console.log(err)
    }

}

async function listAndClassementFileNames(opt={}){ 
    const{currentMois=window.currentMois}=opt
    let fileNames=await getFileList()
    let params1={
        start:0,
        batchSize:1
    }
    let i0=0
    let lim=fileNames.length 
    let o={}   
    // console.log(fileNames)
    return new Promise((resolve)=>{
        let lire= async () => {
        let end= Math.min(i0 + params1.batchSize, lim);
        for (; i0< end; i0++) { 
            let fileName=fileNames[i0]
            
            let arUrl=fileName.split('/')
            arUrl.shift()
            arUrl.shift()
            let str=arUrl.join('/')
            let extensionName=fileName.split('.')[1]
            let moisName="", typeName=""
            if(extensionName==='pdf'){
                
               moisName=fileName.split('/')[3]
               typeName=fileName.split('/')[4]
               if(typeof(o[moisName])==='undefined'){
                o[moisName]={}
               }
               

                if(moisName===currentMois){
                     let comm=await getCommentaire(str)
                let com1=(typeof(comm)==='undefined')?"":JSON.parse(comm)  
                    if(typeName==="TS"){
                        if(typeof(o[moisName][typeName])==='undefined'){
                        o[moisName][typeName]=[]
                        }
                        if(typeof(com1)==="object"){
                        o[moisName][typeName].push({fileUrl:str, fileComment:com1})
                        }
                    }else{
                    if(typeof(o[moisName][typeName])==='undefined'){
                    o[moisName][typeName]={}
                    }   
                    if(typeof(com1)==="object"){
                        let concernedDts=com1.dateConcernee.split(',')
                        
                        let matricule=com1.tag.split('_')[0].split('-')[1]
                        // console.log(concernedDts,matricule)
                        concernedDts.forEach((v)=>{
                            if(typeof(o[moisName][typeName][v])==="undefined"){
                            o[moisName][typeName][v]={}
                        }
                        if(typeof(o[moisName][typeName][v][matricule])==="undefined"){
                            o[moisName][typeName][v][matricule]=[]
                        }
                        o[moisName][typeName][v][matricule].push({fileUrl:str, fileComment:com1})
                        })
                    }
                }
                }

            }   
            
        }
        if(end<lim){
            window.myPb.progress((end/lim)*100)
            setTimeout(async()=>await lire(), 10);  
        }else{
            window.myPb.progress((end/lim)*100)
            // console.log(end,lim)
            resolve(o)
        }
    }
     lire()

    })
    
}

async function getColMonth(ws){
    /**recuperer la colonne de début et la colonne de fin
     * 
     */
    
    let mRow=ws.getRow(2).values //ligne des mois
    let colStart=0, colEnd=0
    mRow.forEach((v,i)=>{
       if(typeof(v)==="object"){
        // console.log(v.getMonth(),v.getFullYear())
        if(v.getMonth()===8 && v.getFullYear()===2026){
            colStart=(colStart===0)?i:colStart
        }
        if(v.getMonth()===9 && v.getFullYear()===2026){
            colEnd=(colEnd===0)?i:colEnd
        }
        
       }
    })
    let dtRow=ws.getRow(4).values //ligne des dates

    let j=colStart+7
    for(let i=colStart;i<=j;i++){
        let dt=dtRow[i]  
        if(dt===1){
            colStart=i
        }
    }
    j=colEnd+7
    for(let l=colEnd;l<=j;l++){
        let dt=dtRow[l]
        if(dt===1){
            colEnd=l-1
        }
    }
    let s=ws.getCell(4,colStart).address
    let e=ws.getCell(4,colEnd).address
    return [colStart,colEnd]
}

async function getUsedRow(ws,colLimit,opt={}) {
    const{}=opt
    let length=ws.rowCount
    // console.log(length)
    let usedR=[]
    for(let r=5; r<=length;r++){
        let content=ws.getCell(r,colLimit[0]).value
        // console.log(content)
        if(content!==null){
            usedR.push(r)
        }
    }
    return usedR
}

function getCoordsJustifs(opt={}){
const{month="2026-09"}=opt
let res=[]
let o=window.classement0[month]
// console.log(o)
Object.keys(o).forEach((o1)=>{
    if(o1!=="TS"){
        let o2=o[o1]
        // console.log(o2)
        Object.keys(o2).forEach((o3)=>{
            let o4=o2[o3]
            //console.log(o3)//y
            Object.keys(o4).forEach((o5)=>{
                //console.log(o5)//x
                let o6=o4[o5]
                //console.log(o6)//data
                //console.log(o6[0]['fileUrl'])//z
                res.push([o5,o3,o6[0]['fileUrl'],o6])

            })
        })
    }
})
// console.log(res)
return res
}

function setJustificatifs(ar){
    // console.log(ar)

ar.forEach(element => {
    // console.log(element)
    let i=element[1].split('-')[2]
    // let selector=`tr#${element[0]} td[data-index="${i}"]`
    // if(element[0]="IN615")
    let selector=`tr#${element[0]}`
    // console.log(selector)
    let e=document.querySelector(selector);
    if(e!==null){
        let f=e.querySelector(`td[data-index="${i}"]`)
        // console.log(f.dataset)
        if(f!==null){
            f.classList.add('justified')
        }
    }
    // console.log(e)
    //e.classList.add('justified')
});
}

$($(document).ready(async function() {
    window.myPb = new progressBar('progressBarContainer')
    window.classement0=await listAndClassementFileNames()
    // console.log(window.classement0)
    let wb=await window.ExcelAccessManager.readFile('data/CREATION SUIVI PRESENCE.xlsx')
    let ws=wb.getWorksheet('TU PLANTSITE')
    let colLimit=await getColMonth(ws)
    // console.log(colLimit)
    let usedRow= await getUsedRow(ws,colLimit)
    // console.log(usedRow)
    let params={ws:ws, colLimit:colLimit, usedRow:usedRow}
    window.tableManager=new TableManager(params)
    let r=getCoordsJustifs()
    setJustificatifs(r)
    window.exportToexcel=new ExportToExcel()
    const savePointage=new SavePointage()
    let pointageData=await savePointage.lireFichierDonnees()
    // console.log(pointageData)
    savePointage.renderDonnes(pointageData)
    // savePointage.sumariseDay(23)
    // console.log(pointageData)
}));