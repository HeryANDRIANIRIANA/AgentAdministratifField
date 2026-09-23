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
         let tds=e1.querySelectorAll('td')
         y=0
         tds.forEach(e2 => {
            // console.log(e2)
            let span =e2.querySelector('.containerInTd .heureEntree')
            if(typeof(span)!=='undefined' && span!==null){
                if(span.textContent!==""){
                    res.push([x,y,span.textContent])
                }
            }
           y++
         });
         x++
       });
    
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
  const y=23
  ar.forEach((v)=>{
    let tds=this.tr[v[0]].querySelectorAll('td')
    let c=tds[y].querySelector('.containerInTd .heureEntree')
    c.textContent=v[2]
  })
}





}