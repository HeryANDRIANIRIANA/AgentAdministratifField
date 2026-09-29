class progressBar {
    constructor(container) {
        this.container = document.getElementById(container);
        this.progressBar = document.createElement('div');
        this.progressBar.style.width = '10%';
        this.progressBar.style.height = '10%';

        this.progressBar.style.backgroundColor = '#f4ee51';
        this.container.appendChild(this.progressBar);
    }

    progress(percent) {
        this.progressBar.style.width = percent + '%';

    }
    getValue() {
        return parseInt(this.progressBar.style.width);
    }
    setLoadingMode() {
        // this.progressBar.style.width = '100%';
        // this.progressBar.style.backgroundColor = '#2196F3';
        this.container.style.height='100%';
    }

    setLoadedMode(){
        document.querySelector("#progressBarContainer").style.height="30px";
        document.querySelector("#imageConatiner").style.display="none";
        document.querySelector("#pbContainer2").style.top="10px"
        document.querySelector("#pbContainer2").style.width="100%"
    }

}
