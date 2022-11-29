// Declare a pyramid (base: 1x1 square, sides: equilateral triangles)
// Returns [vertices (Float32Array), normals (Float32Array), indices (Uint16Array)] 
pyramid = () => {
    var vertices = new Float32Array([
        // Front
        -0.5, 0.0, 0.5,
        0.5, 0.0, 0.5,
        0.0, 0.866, 0.0,

        // Right
        0.5, 0.0, 0.5,
        0.5, 0.0, -0.5,
        0.0, 0.866, 0.0,

        // Back
        0.5, 0.0, -0.5,
        -0.5, 0.0, -0.5,
        0.0, 0.866, 0.0,

        // Left
        -0.5, 0.0, -0.5,
        -0.5, 0.0, 0.5,
        0.0, 0.866, 0.0,

        // Base 1 
        -0.5, 0.0, 0.5,
        -0.5, 0.0, -0.5,
        0.5, 0.0, 0.5,

        // Base 2 
        -0.5, 0.0, -0.5,
        0.5, 0.0, -0.5,
        0.5, 0.0, 0.5
    ]);

    var normals = new Float32Array([
        0, -0.5, 0.866, 0, -0.5, 0.866, 0, -0.5, 0.866,  // Back
        0.866, -0.5, 0, 0.866, -0.5, 0, 0.866, -0.5, 0,  // Left
        0, -0.5, -0.866, 0, -0.5, -0.866, 0, -0.5, -0.866, // Front
        -0.866, -0.5, 0, -0.866, -0.5, 0, -0.866, -0.5, 0,  // Right
        0, 1, 0, 0, 1, 0, 0, 1, 0,         // Base
        0, 1, 0, 0, 1, 0, 0, 1, 0
    ]);

    var indices = new Uint16Array([
        0, 1, 2,    // Front
        3, 4, 5,    // Right
        6, 7, 8,    // Back
        9, 10, 11,  // Left
        12, 13, 14, 15, 16, 17 // Base
    ]);

    return [vertices, normals, indices];
}