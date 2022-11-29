// Create a perspective matrix
// options: fov in degrees, aspect, near, far
// return: DOMMatrix
perspective = options => {
    var fov = options.fov || 85;
    fov = fov * Math.PI / 180;       // fov in radians
    var aspect = options.ratio || 1; // canvas.width / canvas.height
    var near = options.near || 0.01; // can't be 0
    var far = options.far || 100;
    var f = 1 / Math.tan(fov);
    var nf = 1 / (near - far);
    return new DOMMatrix([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * near * far) * nf, 0
    ]);
}

