class SavePointage{
    constructor(){
        this.container=document.getElementById('progressBarContainer')
        this.tr=document.querySelectorAll('table tr')
        let btn=document.createElement('input')
        btn.type='button'
        btn.value='savePointage'
        btn.addEventListener('click',(e)=>{
            let data=this.saveAllPointageTime()
            this.telechargerFichierTexte(data)
        })
        this.container.appendChild(btn)
    }

    saveAllPointageTime(){
       let tr=document.querySelectorAll('table tr')
       let x=0,y=0,v="",res=[]
       tr.forEach(e1 => {
        let trid=e1.id
        // console.log(trid)
         let tds=e1.querySelectorAll('td')
         y=0
         tds.forEach(e2 => {
            // console.log(e2)
            let span =e2.querySelector('.containerInTd .heureEntree')
            if(typeof(span)!=='undefined' && span!==null){
                if(span.textContent!==""){
                    res.push([trid,y,span.textContent])
                }
            }
           y++
         });
         x++
       });
    console.log(res)
    return res
    }

    // Votre objet ou tableau
// const mesDonnees = {
//     nom: "Dupont",
//     liste: [1, 2, 3],
//     actif: true
// };

telechargerFichierTexte(donnees, nomFichier = 'donnees.txt') {
    // 1. Convertir l'objet en texte JSON lisible (indenté avec 2 espaces)
    const texteJSON = JSON.stringify(donnees, null, 2);
    
    // 2. Créer un Blob (contenu du fichier)
    const blob = new Blob([texteJSON], { type: 'text/plain' });
    
    // 3. Créer un lien invisible pour déclencher le téléchargement
    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(blob);
    lien.download = nomFichier;
    
    // 4. Simuler le clic et nettoyer la mémoire
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
    URL.revokeObjectURL(lien.href);
}

async  lireFichierDonnees(opt={}) {
  const{pointageUrl=`data/${window.currentMois}/pointage.txt`}=opt
  try {
    // 1. Appeler le fichier (remplacez par le chemin réel de votre fichier)
    const reponse = await fetch(pointageUrl);
    
    // Vérifier si le fichier existe et a bien été chargé
    if (!reponse.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
    }

    // 2. Convertir le texte JSON directement en objet ou array JavaScript
    const donnees = await reponse.json();
    
    // 3. Utiliser vos données
    // console.log("Données récupérées avec succès :", donnees);
    return donnees;

  } catch (erreur) {
    console.error("Impossible de lire le fichier :", erreur);
  }
}

renderDonnes(ar){
  
  ar.forEach((v)=>{
    let tr=document.querySelector(`tr#${v[0]}`)
    let tds=tr.children
    let c=tds[v[1]].querySelector('.containerInTd .heureEntree')
    c.textContent=v[2]
  })
}

sumariseDay(n){
  let s=n.toString().padStart(2,"0")
  let sel=`td[data-index="${s}"]`
  let tds=document.querySelectorAll(sel)
  // console.log(tds)
  for(let i=1;i<tds.length;i++){
    let o=tds[i].querySelector('.containerInTd .heureEntree')
    if(o.textContent===""){
      o.dataset.status="error"
    }
  }
}

setHeureEntreeSortieTS(){//ajoutter les heure d'entré et sortie via le TS si je n'ai pas percu
  let trs=document.querySelectorAll('tr')
  for(let i=1;i<trs.length;i++){
    let tr=trs[i]
    let tds=tr.querySelectorAll('td')
    for(let j=1;j<tds.length;j++){
      let td=tds[j]
      let hEntreSortie=td.querySelectorAll('.containerInTd span')
      let heureEntree=hEntreSortie[0]
      let heureSortie=hEntreSortie[1]
      // console.log(heureEntree.textContent)
      let label=td.querySelector('label')
      let presenceT=label.textContent
      if(!isNaN(presenceT) && presenceT!=="" && heureEntree.textContent===""){
        heureEntree.textContent="07:00"
        heureEntree.className="heureEntreeT"
        let heureSortieT=parseInt(presenceT)+8
        let sHeureSortie=`${heureSortieT.toString().padStart(2,"0")}:00`
      }
      if(!isNaN(presenceT) && presenceT!=="" && heureSortie.textContent===""){
        let heureSortieT=parseInt(presenceT)+8
        let sHeureSortie=`${heureSortieT.toString().padStart(2,"0")}:00`
        heureSortie.textContent=sHeureSortie
        heureSortie.className="heureSortieT"
      }

    }
  }

}

async chargerRectifs(){
let rectifUrls=['data/rectifs/donnees.txt','data/rectifs/donnees (1).txt','data/rectifs/donnees (2).txt','data/rectifs/donnees (3).txt','data/rectifs/donnees (4).txt','data/rectifs/donnees (5).txt','data/rectifs/donnees (6).txt','data/rectifs/donnees (7).txt','data/rectifs/donnees (8).txt','data/rectifs/donnees (9).txt','data/rectifs/donnees (10).txt','data/rectifs/donnees (11).txt']
for(let i=0;i<rectifUrls.length;i++){
  let ar0=await this.lireFichierDonnees({pointageUrl:rectifUrls[i]})
this.renderDonnes(ar0)
}
}

}