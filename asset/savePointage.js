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

async  lireFichierDonnees() {
  try {
    // 1. Appeler le fichier (remplacez par le chemin réel de votre fichier)
    const reponse = await fetch(`data/${window.currentMois}/pointage.txt`);
    
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




}