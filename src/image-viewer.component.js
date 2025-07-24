"use strict";
exports.__esModule = true;
var core_1 = require("@angular/core");
var iv_viewer_1 = require("iv-viewer");
var iv_viewer_2 = require("iv-viewer");
/**
 * @author Breno Prata - 22/12/2017
 */
var ImageViewerComponent = (function () {
    function ImageViewerComponent(renderer) {
        this.renderer = renderer;
        this.BASE_64_IMAGE = 'data:image/png;base64,';
        this.BASE_64_PNG = this.BASE_64_IMAGE + " ";
        this.ROTACAO_PADRAO_GRAUS = 90;
        this.rotate = true;
        this.download = true;
        this.fullscreen = true;
        this.resetZoom = true;
        this.loadOnInit = false;
        this.showOptions = true;
        this.zoomInButton = true;
        this.zoomOutButton = true;
        this.showPDFOnlyOption = true;
        this.primaryColor = '#0176bd';
        this.buttonsColor = 'white';
        this.buttonsHover = '#333333';
        this.defaultDownloadName = 'Image';
        this.rotateRightTooltipLabel = 'Rotate right';
        this.rotateLeftTooltipLabel = 'Rotate left';
        this.resetZoomTooltipLabel = 'Reset zoom';
        this.fullscreenTooltipLabel = 'Fullscreen';
        this.zoomInTooltipLabel = 'Zoom In';
        this.zoomOutTooltipLabel = 'Zoom Out';
        this.downloadTooltipLabel = 'Download';
        this.showPDFOnlyLabel = 'Show only PDF';
        this.openInNewTabTooltipLabel = 'Open in new tab';
        this.enableTooltip = true;
        this.onNext = new core_1.EventEmitter();
        this.onPrevious = new core_1.EventEmitter();
        this.showOnlyPDF = false;
        this.zoomPercent = 100;
    }
    ImageViewerComponent.prototype.ngOnInit = function () {
        if (this.loadOnInit) {
            this.isImagensPresentes();
        }
    };
    ImageViewerComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.inicializarCores();
        if (this.loadOnInit) {
            this.inicializarImageViewer();
            setTimeout(function () {
                _this.showImage();
            }, 1000);
        }
    };
    ImageViewerComponent.prototype.inicializarCores = function () {
        this.setStyleClass('inline-icon', 'background-color', this.primaryColor);
        this.setStyleClass('footer-info', 'background-color', this.primaryColor);
        this.setStyleClass('footer-icon', 'color', this.buttonsColor);
    };
    ImageViewerComponent.prototype.ngOnChanges = function (changes) {
        this.imagesChange(changes);
        this.primaryColorChange(changes);
        this.buttonsColorChange(changes);
        this.defaultDownloadNameChange(changes);
    };
    ImageViewerComponent.prototype.zoomIn = function () {
        this.zoomPercent += 10;
        this.viewer.zoom(this.zoomPercent);
    };
    ImageViewerComponent.prototype.zoomOut = function () {
        if (this.zoomPercent === 100) {
            return;
        }
        this.zoomPercent -= 10;
        if (this.zoomPercent < 0) {
            this.zoomPercent = 0;
        }
        this.viewer.zoom(this.zoomPercent);
    };
    ImageViewerComponent.prototype.primaryColorChange = function (changes) {
        var _this = this;
        if (changes['primaryColor'] || changes['showOptions']) {
            setTimeout(function () {
                _this.setStyleClass('inline-icon', 'background-color', _this.primaryColor);
                _this.setStyleClass('footer-info', 'background-color', _this.primaryColor);
            }, 350);
        }
    };
    ImageViewerComponent.prototype.buttonsColorChange = function (changes) {
        var _this = this;
        if (changes['buttonsColor'] || changes['rotate'] || changes['download']
            || changes['fullscreen']) {
            setTimeout(function () {
                _this.setStyleClass('footer-icon', 'color', _this.buttonsColor);
            }, 350);
        }
    };
    ImageViewerComponent.prototype.defaultDownloadNameChange = function (changes) {
        if (changes['defaultDownloadName']) {
            this.defaultDownloadName = this.defaultDownloadName;
        }
    };
    ImageViewerComponent.prototype.imagesChange = function (changes) {
        var _this = this;
        if (changes['images'] && this.isImagensPresentes()) {
            this.inicializarImageViewer();
            setTimeout(function () {
                _this.showImage();
            }, 1000);
        }
    };
    ImageViewerComponent.prototype.isImagensPresentes = function () {
        return this.images
            && this.images.length > 0;
    };
    ImageViewerComponent.prototype.inicializarImageViewer = function () {
        this.indexImagemAtual = 1;
        this.rotacaoImagemAtual = 0;
        this.totalImagens = this.images.length;
        if (this.viewer) {
            this.wrapper.querySelector('.total').innerHTML = this.totalImagens;
            return;
        }
        this.wrapper = document.getElementById("" + this.idContainer);
        if (this.wrapper) {
            this.curSpan = this.wrapper.querySelector('#current');
            this.viewer = new iv_viewer_1["default"](this.wrapper.querySelector('.image-container'));
            this.wrapper.querySelector('.total').innerHTML = this.totalImagens;
        }
    };
    ImageViewerComponent.prototype.showImage = function () {
        this.prepararTrocaImagem();
        var imgObj = this.BASE_64_PNG;
        if (this.isPDF()) {
            this.carregarViewerPDF();
        }
        else if (this.isURlImagem()) {
            imgObj = this.getImagemAtual();
            this.stringDownloadImagem = this.getImagemAtual();
        }
        else {
            imgObj = this.BASE_64_PNG + this.getImagemAtual();
            this.stringDownloadImagem = this.BASE_64_IMAGE + this.getImagemAtual();
        }
        this.viewer.load(imgObj, imgObj);
        this.curSpan.innerHTML = this.indexImagemAtual;
        this.inicializarCores();
    };
    ImageViewerComponent.prototype.carregarViewerPDF = function () {
        this.esconderBotoesImageViewer();
        var _a = this.getTamanhoIframe(), widthIframe = _a.widthIframe, heightIframe = _a.heightIframe;
        this.injetarIframe(widthIframe, heightIframe);
    };
    ImageViewerComponent.prototype.injetarIframe = function (widthIframe, heightIframe) {
        var ivImageWrap = document.getElementById(this.idContainer).getElementsByClassName('iv-image-wrap').item(0);
        var iframe = document.createElement('iframe');
        iframe.id = this.getIdIframe();
        iframe.style.width = widthIframe + "px";
        iframe.style.height = heightIframe + "px";
        iframe.src = "" + this.converterPDFBase64ParaBlob();
        this.renderer.appendChild(ivImageWrap, iframe);
    };
    ImageViewerComponent.prototype.getTamanhoIframe = function () {
        var container = document.getElementById(this.idContainer);
        var widthIframe = container.offsetWidth;
        var heightIframe = container.offsetHeight;
        return { widthIframe: widthIframe, heightIframe: heightIframe };
    };
    ImageViewerComponent.prototype.esconderBotoesImageViewer = function () {
        this.setStyleClass('iv-loader', 'visibility', 'hidden');
        this.setStyleClass('options-image-viewer', 'visibility', 'hidden');
    };
    ImageViewerComponent.prototype.isPDF = function () {
        return this.getImagemAtual().startsWith('JVBE') || this.getImagemAtual().startsWith('0M8R');
    };
    ImageViewerComponent.prototype.isURlImagem = function () {
        return this.getImagemAtual().match(new RegExp(/^(https|http|www\.|blob)/g));
    };
    ImageViewerComponent.prototype.prepararTrocaImagem = function () {
        this.rotacaoImagemAtual = 0;
        this.limparCacheElementos();
    };
    ImageViewerComponent.prototype.limparCacheElementos = function () {
        var container = document.getElementById(this.idContainer);
        var iframeElement = document.getElementById(this.getIdIframe());
        var ivLargeImage = document.getElementById(this.idContainer).getElementsByClassName('iv-large-image').item(0);
        if (iframeElement) {
            this.renderer.removeChild(container, iframeElement);
            if (ivLargeImage) {
                this.renderer.removeChild(container, ivLargeImage);
            }
        }
        if (iframeElement) {
        }
        this.setStyleClass('iv-loader', 'visibility', 'auto');
        this.setStyleClass('options-image-viewer', 'visibility', 'inherit');
    };
    ImageViewerComponent.prototype.proximaImagem = function () {
        this.isImagemVertical = false;
        this.indexImagemAtual++;
        if (this.indexImagemAtual > this.totalImagens) {
            this.indexImagemAtual = 1;
        }
        this.onNext.emit(this.indexImagemAtual);
        if (!this.isPDF() && this.showOnlyPDF) {
            this.proximaImagem();
            return;
        }
        this.showImage();
    };
    ImageViewerComponent.prototype.imagemAnterior = function () {
        this.isImagemVertical = false;
        this.indexImagemAtual--;
        if (this.indexImagemAtual <= 0) {
            this.indexImagemAtual = this.totalImagens;
        }
        this.onPrevious.emit(this.indexImagemAtual);
        if (!this.isPDF() && this.showOnlyPDF) {
            this.imagemAnterior();
            return;
        }
        this.showImage();
    };
    ImageViewerComponent.prototype.rotacionarDireita = function () {
        var _this = this;
        var timeout = this.resetarZoom();
        setTimeout(function () {
            _this.rotacaoImagemAtual += _this.ROTACAO_PADRAO_GRAUS;
            _this.isImagemVertical = !_this.isImagemVertical;
            _this.atualizarRotacao();
        }, timeout);
    };
    ImageViewerComponent.prototype.rotacionarEsquerda = function () {
        var _this = this;
        var timeout = this.resetarZoom();
        setTimeout(function () {
            _this.rotacaoImagemAtual -= _this.ROTACAO_PADRAO_GRAUS;
            _this.isImagemVertical = !_this.isImagemVertical;
            _this.atualizarRotacao();
        }, timeout);
    };
    ImageViewerComponent.prototype.resetarZoom = function () {
        this.zoomPercent = 100;
        this.viewer.zoom(this.zoomPercent);
        var timeout = 800;
        if (this.viewer._state.zoomValue === this.zoomPercent) {
            timeout = 0;
        }
        return timeout;
    };
    ImageViewerComponent.prototype.atualizarRotacao = function (isAnimacao) {
        if (isAnimacao === void 0) { isAnimacao = true; }
        var scale = '';
        if (this.isImagemVertical && this.isImagemSobrepondoNaVertical()) {
            scale = "scale(" + this.getScale() + ")";
        }
        var novaRotacao = "rotate(" + this.rotacaoImagemAtual + "deg)";
        this.carregarImagem(novaRotacao, scale, isAnimacao);
    };
    ImageViewerComponent.prototype.getScale = function () {
        var containerElement = document.getElementById(this.idContainer);
        var ivLargeImageElement = document.getElementById(this.idContainer).getElementsByClassName('iv-large-image').item(0);
        var diferencaTamanhoImagem = ivLargeImageElement.clientWidth - containerElement.clientHeight;
        if (diferencaTamanhoImagem >= 250 && diferencaTamanhoImagem < 300) {
            return (ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight) - 0.1;
        }
        else if (diferencaTamanhoImagem >= 300 && diferencaTamanhoImagem < 400) {
            return ((ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight)) - 0.15;
        }
        else if (diferencaTamanhoImagem >= 400) {
            return ((ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight)) - 0.32;
        }
        return 0.6;
    };
    ImageViewerComponent.prototype.isImagemSobrepondoNaVertical = function () {
        var margemErro = 5;
        var containerElement = document.getElementById(this.idContainer);
        var ivLargeImageElement = document.getElementById(this.idContainer).getElementsByClassName('iv-large-image').item(0);
        return containerElement.clientHeight < ivLargeImageElement.clientWidth + margemErro;
    };
    ImageViewerComponent.prototype.carregarImagem = function (novaRotacao, scale, isAnimacao) {
        var _this = this;
        if (isAnimacao === void 0) { isAnimacao = true; }
        if (isAnimacao) {
            this.adicionarAnimacao('iv-snap-image');
            this.adicionarAnimacao('iv-large-image');
        }
        this.adicionarRotacao('iv-snap-image', novaRotacao, scale);
        this.adicionarRotacao('iv-large-image', novaRotacao, scale);
        setTimeout(function () {
            if (isAnimacao) {
                _this.retirarAnimacao('iv-snap-image');
                _this.retirarAnimacao('iv-large-image');
            }
        }, 501);
    };
    ImageViewerComponent.prototype.retirarAnimacao = function (componente) {
        this.setStyleClass(componente, 'transition', 'auto');
    };
    ImageViewerComponent.prototype.adicionarRotacao = function (componente, novaRotacao, scale) {
        this.setStyleClass(componente, 'transform', novaRotacao + " " + scale);
    };
    ImageViewerComponent.prototype.adicionarAnimacao = function (componente) {
        this.setStyleClass(componente, 'transition', "0.5s linear");
    };
    ImageViewerComponent.prototype.mostrarFullscreen = function () {
        var _this = this;
        var timeout = this.resetarZoom();
        setTimeout(function () {
            _this.viewerFullscreen = new iv_viewer_2.FullScreenViewer();
            var imgSrc;
            if (_this.isURlImagem()) {
                imgSrc = _this.getImagemAtual();
            }
            else {
                imgSrc = _this.BASE_64_PNG + _this.getImagemAtual();
            }
            _this.viewerFullscreen.show(imgSrc, imgSrc);
            _this.atualizarRotacao(false);
        }, timeout);
    };
    ImageViewerComponent.prototype.converterPDFBase64ParaBlob = function () {
        var arrBuffer = this.base64ToArrayBuffer(this.getImagemAtual());
        var newBlob = new Blob([arrBuffer], { type: 'application/pdf' });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        return window.URL.createObjectURL(newBlob);
    };
    ImageViewerComponent.prototype.getImagemAtual = function () {
        return this.images[this.indexImagemAtual - 1];
    };
    ImageViewerComponent.prototype.base64ToArrayBuffer = function (data) {
        var binaryString = window.atob(data);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    };
    ImageViewerComponent.prototype.showPDFOnly = function () {
        this.showOnlyPDF = !this.showOnlyPDF;
        this.proximaImagem();
    };
    ImageViewerComponent.prototype.setStyleClass = function (nomeClasse, nomeStyle, cor) {
        var cont;
        var listaElementos = document.getElementById(this.idContainer).getElementsByClassName(nomeClasse);
        for (cont = 0; cont < listaElementos.length; cont++) {
            this.renderer.setStyle(listaElementos.item(cont), nomeStyle, cor);
        }
    };
    ImageViewerComponent.prototype.atualizarCorHoverIn = function (event) {
        this.renderer.setStyle(event.srcElement, 'color', this.buttonsHover);
    };
    ImageViewerComponent.prototype.atualizarCorHoverOut = function (event) {
        this.renderer.setStyle(event.srcElement, 'color', this.buttonsColor);
    };
    ImageViewerComponent.prototype.getIdIframe = function () {
        return this.idContainer + '-iframe';
    };
    ImageViewerComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'app-image-viewer',
                    templateUrl: './image-viewer.component.html',
                    styleUrls: ['./image-viewer.component.scss']
                },] },
    ];
    /** @nocollapse */
    ImageViewerComponent.ctorParameters = function () { return [
        { type: core_1.Renderer2 },
    ]; };
    ImageViewerComponent.propDecorators = {
        'idContainer': [{ type: core_1.Input },],
        'images': [{ type: core_1.Input },],
        'rotate': [{ type: core_1.Input },],
        'download': [{ type: core_1.Input },],
        'fullscreen': [{ type: core_1.Input },],
        'resetZoom': [{ type: core_1.Input },],
        'loadOnInit': [{ type: core_1.Input },],
        'showOptions': [{ type: core_1.Input },],
        'zoomInButton': [{ type: core_1.Input },],
        'zoomOutButton': [{ type: core_1.Input },],
        'showPDFOnlyOption': [{ type: core_1.Input },],
        'primaryColor': [{ type: core_1.Input },],
        'buttonsColor': [{ type: core_1.Input },],
        'buttonsHover': [{ type: core_1.Input },],
        'defaultDownloadName': [{ type: core_1.Input },],
        'rotateRightTooltipLabel': [{ type: core_1.Input },],
        'rotateLeftTooltipLabel': [{ type: core_1.Input },],
        'resetZoomTooltipLabel': [{ type: core_1.Input },],
        'fullscreenTooltipLabel': [{ type: core_1.Input },],
        'zoomInTooltipLabel': [{ type: core_1.Input },],
        'zoomOutTooltipLabel': [{ type: core_1.Input },],
        'downloadTooltipLabel': [{ type: core_1.Input },],
        'showPDFOnlyLabel': [{ type: core_1.Input },],
        'openInNewTabTooltipLabel': [{ type: core_1.Input },],
        'enableTooltip': [{ type: core_1.Input },],
        'onNext': [{ type: core_1.Output },],
        'onPrevious': [{ type: core_1.Output },]
    };
    return ImageViewerComponent;
}());
exports.ImageViewerComponent = ImageViewerComponent;
