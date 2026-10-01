class MoisSelector{
    constructor(){
        this.container=document.getElementById('progressBarContainer')
        let selContainer=document.createElement('div')
        let txtlabel='Mois'
        let label=document.createElement('span')
        label.textContent=txtlabel
        selContainer.appendChild(label)
        let selInput=document.createElement('select')
        // selInput.type='select'
        selInput.id='moisSelct'
        selContainer.appendChild(selInput)
        this.container.appendChild(selContainer)
        let arMois=['2026-09','2026-10']
        arMois.map((v)=>{
            let option=new Option(v,v)
            selInput.add(option)
        })
        this.mois=window.currentMois
        let i=0
        Array.from(selInput.options).forEach((opt)=>{
            // console.log(opt.value,this.mois)
            if(opt.value===this.mois){
                selInput.selectedIndex=i
            }
            i++
        })
        selInput.addEventListener('change',(e)=>{
            let v=e.target.value
            window.location.search=`?mois=${v}`
            
        })

    }
}