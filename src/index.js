"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var image_viewer_component_1 = require("./image-viewer.component");
__export(require("./image-viewer.component"));
var ImageViewerModule = (function () {
    function ImageViewerModule() {
    }
    ImageViewerModule.forRoot = function () {
        return {
            ngModule: ImageViewerModule
        };
    };
    ImageViewerModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        image_viewer_component_1.ImageViewerComponent
                    ],
                    exports: [
                        image_viewer_component_1.ImageViewerComponent,
                    ]
                },] },
    ];
    /** @nocollapse */
    ImageViewerModule.ctorParameters = function () { return []; };
    return ImageViewerModule;
}());
exports.ImageViewerModule = ImageViewerModule;
