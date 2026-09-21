class progressBar {
    constructor(container) {
        this.container = document.getElementById(container);
        this.progressBar = document.createElement('div');
        this.progressBar.style.width = '10%';
        this.progressBar.style.height = '10%';

        this.progressBar.style.backgroundColor = '#4caf50';
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

}
