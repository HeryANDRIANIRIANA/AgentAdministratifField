class ExcelAccessManager {
    constructor() {
        if (!window.ExcelJS) {
            throw new Error('ExcelJS n\'est pas chargé. Vérifie le script exceljs.min.js dans index.html.');
        }
        this.ExcelJS = window.ExcelJS;
    }

    async readFile(fileUrl) {
        if (typeof fileUrl !== 'string' || fileUrl.trim() === '') {
            throw new Error('Le paramètre fileUrl doit être une URL valide sous forme de chaîne.');
        }

        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Impossible de charger le fichier Excel : ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = new this.ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        return workbook;
    }

    async readRows(file, sheetName = null) {
        const workbook = await this.readFile(file);
        const worksheet = sheetName
            ? workbook.getWorksheet(sheetName)
            : workbook.worksheets[0];

        if (!worksheet) {
            throw new Error('Aucune feuille Excel trouvée dans le fichier.');
        }

        const rows = [];
        worksheet.eachRow((row) => {
            rows.push(row.values.slice(1));
        });

        return rows;
    }

    async readObjects(file, sheetName = null) {
        const workbook = await this.readFile(file);
        const worksheet = sheetName
            ? workbook.getWorksheet(sheetName)
            : workbook.worksheets[0];

        if (!worksheet) {
            throw new Error('Aucune feuille Excel trouvée dans le fichier.');
        }

        const rawRows = worksheet.getSheetValues();
        if (rawRows.length < 2) {
            return [];
        }

        const headers = rawRows[0];
        const objects = [];

        for (let i = 1; i < rawRows.length; i++) {
            const values = rawRows[i];
            const item = {};

            headers.forEach((header, index) => {
                item[String(header)] = values[index] ?? '';
            });

            objects.push(item);
        }

        return objects;
    }

    async exportRows(rows, fileName = 'export.xlsx', sheetName = 'Feuille1',opt={}) {
        const{arJustifiedAbs=[]}=opt
        const workbook = new this.ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        rows.forEach((row) => {
            worksheet.addRow(row);
        });

        //mise en forme
            // 3. 📐 REDIMENSIONNEMENT AUTOMATIQUE DES COLONNES
        worksheet.columns.forEach(column => {
            let maxLongueur = 0;
            
            column.eachCell({ includeEmpty: true }, cell => {
                if (cell.value) {
                    // Convertit la valeur en chaîne pour mesurer sa longueur
                    const longueurTexte = cell.value.toString().length;
                    if (longueurTexte > maxLongueur) {
                        maxLongueur = longueurTexte;
                    }
                }
            });
            
            // Assigne la largeur : longueur max + une marge de sécurité (ici 4 caractères)
            // On définit une taille minimale (ex: 12) pour éviter les colonnes trop ratatinées
            column.width = maxLongueur < 12 ? 3 : maxLongueur + 4;
        });

        if(arJustifiedAbs.length>0){
            arJustifiedAbs.forEach((v)=>{
                let r=v[0]+1
                let c=v[1]+1
                const cel=worksheet.getCell(r,c)
                cel.fill = {
                    type: 'pattern',
                    pattern: 'darkDown',           // Type de hachure (diagonale descendante)
                    fgColor: { argb: '0F00FF00' }, // Couleur des lignes (Rouge - Format ARGB)
                    bgColor: { argb: 'FFFFFFFF' }  // Couleur du fond (Blanc - Format ARGB)
                };
            })
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        this.downloadBlob(blob, fileName);
    }

    downloadBlob(blob, fileName) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    async classement(file,sheetName=null){
        try {
            const wb=await this.readFile(file)
            const ws=wb.getWorksheet(sheetName)
            let o1={} 
            const buildDateClassement= () => {
                let ar=ws.getRow(1).values
                // console.log(ar.length);
                let lim=ar.length-1
                for(let i=5;i<lim;i++){
                    // window.classement0[ar[i]]={}  
                    o1[ar[i]]={}       
                }
            }
            buildDateClassement()
           
            // console.log(o1);
            let length=ws._rows.length+1
            let params={
                start:1,
                batchSize:10
                    } 
            let i=2; 
            
            let lecture1= () => {
                let end= Math.min(i+ params.batchSize, length);
                for (; i < end; i++) {
                    let row=ws.getRow(i)
                    let arKeys=Object.keys(o1)
                    let lim=arKeys.length+5
                    for(let j=5;j<lim;j++){
                       
                        let k=j-5;
                        let dt=arKeys[k];
                        let fnName=row.getCell(4).value;
                        // console.log(i,dt,fnName);
                        
                        fnName=(fnName==="MANŒUVRE")?fnName="ASSISTANT MONTEUR":fnName
                        if(!isNaN(parseInt(row.getCell(j).value))){
                            if(typeof(o1[dt][fnName])==="undefined"){
                                o1[dt][fnName]=[]
                            }
                            o1[dt][fnName].push(row.values)
                        }
                    }   
                    // console.log(row.values);
                    
                } 
                 if(end<=length){
                    // params.start+=params.batchSize
                    window.myPb.progress((i/length)*100)
                    setTimeout(lecture1, 10);
                }     
            }
            lecture1()
            window.classement0={...window.classement0,...o1}
            //  console.log(window.classement0)


        } catch (error) {
            console.error('Erreur lors du classement des données :', error);
        }
    }

    async dupliquerFeuille(workbook, sourceSheet, newSheetName) {
            const newSheet = workbook.addWorksheet(newSheetName);
            // console.log(newSheet);
            
            // Copier les propriétés globales
            newSheet.properties = JSON.parse(JSON.stringify(sourceSheet.properties || {}));
            newSheet.pageSetup = JSON.parse(JSON.stringify(sourceSheet.pageSetup || {}));
            newSheet.views = JSON.parse(JSON.stringify(sourceSheet.views || []));

            // Copier la largeur des colonnes
            sourceSheet.columns?.forEach((col, index) => {
                if (col) {
                    newSheet.getColumn(index + 1).width = col.width;
                    if (col.style) {
                        newSheet.getColumn(index + 1).style = JSON.parse(JSON.stringify(col.style));
                    }
                }
            });

            // Copier les lignes, cellules, valeurs et styles
            sourceSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                const newRow = newSheet.getRow(rowNumber);
                newRow.height = row.height;

                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    const newCell = newRow.getCell(colNumber);
                    newCell.value = cell.value;
                    
                    if (cell.style) {
                        newCell.style = JSON.parse(JSON.stringify(cell.style));
                    }
                });
            });

            // Copier les cellules fusionnées
            if (sourceSheet._merges) {
            // console.log(sourceSheet._merges)
                Object.values(sourceSheet._merges).forEach(merge => {
                    // console.log(merge.model)
                    newSheet.mergeCells(
                        merge.model.top,
                        merge.model.left,
                        merge.model.bottom,
                        merge.model.right
                    );
                });
            }
            const ajoutDate=()=>{
                newSheet.getRow(12).getCell(2).value=newSheetName
            }
            ajoutDate()
            return newSheet;
        }


}

window.ExcelAccessManager = new ExcelAccessManager();
