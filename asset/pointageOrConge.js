class PointageOrConge{
    constructor(){
        this.container=document.getElementById('progressBarContainer')
        let select=document.createElement('select')
        let option1=document.createElement('option')
        option1.value="pointage"
        option1.textContent="Pointage"
        let option2=document.createElement('option')
        option2.value="conge"
        option2.textContent="Congé"
        select.appendChild(option1)
        select.appendChild(option2)
        select.addEventListener('change',async (event)=>{
            if(event.target.value==="pointage"){
                chargeTUplantsit()
            }else if(event.target.value==="conge"){
                window.tableConge=new TableConge()
            }
        })
        this.container.appendChild(select)  

    }
}